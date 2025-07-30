import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { Box, Package2, MoreHorizontal, Plus, Search } from "lucide-react";
import { 
  mockBoxes, 
  calculateBoxCapacity, 
  getBoxCapacityColorClass,
  formatBoxLocation
} from "~/features/dashboard/models/box.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Box Management - POS System" },
    { name: "description", content: "Manage product boxes and locations" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  // Get search and filter params
  const search = searchParams.get("search") || "";
  const warehouseId = searchParams.get("warehouse") || "";
  const status = searchParams.get("status") || "";
  const section = searchParams.get("section") || "";
  const row = searchParams.get("row") || "";
  const column = searchParams.get("column") || "";
  const level = searchParams.get("level") || "";
  
  // Get sort params
  const sortField = searchParams.get("sort") || "code";
  const sortDirection = searchParams.get("direction") || "asc";
  
  // Get pagination params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  // Filter boxes based on search and filter params
  let filteredBoxes = [...mockBoxes];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredBoxes = filteredBoxes.filter(box => 
      box.code.toLowerCase().includes(searchLower) ||
      (box.name?.toLowerCase().includes(searchLower) || false) ||
      box.warehouseName.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply warehouse filter
  if (warehouseId) {
    filteredBoxes = filteredBoxes.filter(box => box.warehouseId === warehouseId);
  }
  
  // Apply status filter
  if (status) {
    const isActive = status === "active";
    filteredBoxes = filteredBoxes.filter(box => box.isActive === isActive);
  }
  
  // Apply section filter
  if (section) {
    filteredBoxes = filteredBoxes.filter(box => box.section === section);
  }
  
  // Apply row filter
  if (row) {
    filteredBoxes = filteredBoxes.filter(box => box.row === row);
  }
  
  // Apply column filter
  if (column) {
    filteredBoxes = filteredBoxes.filter(box => box.column === column);
  }
  
  // Apply level filter
  if (level) {
    filteredBoxes = filteredBoxes.filter(box => box.level === parseInt(level));
  }
  
  // Sort the boxes
  filteredBoxes.sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "code":
        comparison = a.code.localeCompare(b.code);
        break;
      case "name":
        const aName = a.name || "";
        const bName = b.name || "";
        comparison = aName.localeCompare(bName);
        break;
      case "warehouse":
        comparison = a.warehouseName.localeCompare(b.warehouseName);
        break;
      case "location":
        comparison = formatBoxLocation(a).localeCompare(formatBoxLocation(b));
        break;
      case "capacity":
        comparison = a.capacity - b.capacity;
        break;
      case "usage":
        const aUsage = calculateBoxCapacity(a);
        const bUsage = calculateBoxCapacity(b);
        comparison = aUsage - bUsage;
        break;
      case "status":
        comparison = (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1;
        break;
      default:
        comparison = a.code.localeCompare(b.code);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  // Get total count for pagination
  const total = filteredBoxes.length;
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBoxes = filteredBoxes.slice(startIndex, endIndex);
  
  // Get unique sections, rows, columns, levels from all boxes for filters
  const sections = Array.from(new Set(mockBoxes.map(box => box.section))).sort();
  const rows = Array.from(new Set(mockBoxes.map(box => box.row))).sort();
  const columns = Array.from(new Set(mockBoxes.map(box => box.column))).sort();
  const levels = Array.from(new Set(mockBoxes.map(box => box.level))).sort();
  
  return json({
    boxes: paginatedBoxes,
    warehouses: mockWarehouses,
    sections,
    rows,
    columns,
    levels,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
};

export default function BoxesIndex() {
  const { 
    boxes, 
    warehouses, 
    sections, 
    rows, 
    columns, 
    levels,
    total, 
    page, 
    limit, 
    totalPages 
  } = useLoaderData<typeof loader>();
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const warehouseId = searchParams.get("warehouse") || "";
  const status = searchParams.get("status") || "";
  const section = searchParams.get("section") || "";
  const row = searchParams.get("row") || "";
  const column = searchParams.get("column") || "";
  const level = searchParams.get("level") || "";
  const sort = searchParams.get("sort") || "code";
  const direction = searchParams.get("direction") || "asc";
  
  // Helper for updating search params
  const updateSearchParams = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (key === "page" && value === "1") {
      newSearchParams.delete("page");
    } else if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    
    // Reset to page 1 when filters change
    if (key !== "page" && key !== "limit") {
      newSearchParams.delete("page");
    }
    
    setSearchParams(newSearchParams);
  };
  
  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams("search", e.target.value);
  };
  
  // Handle sort column click
  const handleSortClick = (field: string) => {
    if (sort === field) {
      updateSearchParams("direction", direction === "asc" ? "desc" : "asc");
    } else {
      updateSearchParams("sort", field);
      updateSearchParams("direction", "asc");
    }
  };
  
  // Sort indicator for column headers
  const SortIndicator = ({ field }: { field: string }) => {
    if (sort !== field) return null;
    
    return direction === "asc" 
      ? <Box className="ml-1 h-4 w-4" /> 
      : <Box className="ml-1 h-4 w-4 transform rotate-180" />;
  };
  
  // Calculate pagination numbers
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(startItem + limit - 1, total);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Box Management</h2>
          <p className="text-muted-foreground">Manage product boxes and their locations</p>
        </div>
        
        <Link
          to="/dashboard/boxes/add"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Box
        </Link>
      </div>
      
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search boxes..."
            className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            value={warehouseId}
            onChange={(e) => updateSearchParams("warehouse", e.target.value)}
          >
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            value={status}
            onChange={(e) => updateSearchParams("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <div className="flex gap-2">
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-2 py-2"
              value={section}
              onChange={(e) => updateSearchParams("section", e.target.value)}
            >
              <option value="">Section</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-2 py-2"
              value={row}
              onChange={(e) => updateSearchParams("row", e.target.value)}
            >
              <option value="">Row</option>
              {rows.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-2 py-2"
              value={column}
              onChange={(e) => updateSearchParams("column", e.target.value)}
            >
              <option value="">Column</option>
              {columns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-2 py-2"
              value={level}
              onChange={(e) => updateSearchParams("level", e.target.value)}
            >
              <option value="">Level</option>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Boxes Table */}
      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs border-b bg-muted/50">
              <tr>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("code")}
                >
                  <div className="flex items-center">
                    Code
                    <SortIndicator field="code" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("name")}
                >
                  <div className="flex items-center">
                    Name
                    <SortIndicator field="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("warehouse")}
                >
                  <div className="flex items-center">
                    Warehouse
                    <SortIndicator field="warehouse" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("location")}
                >
                  <div className="flex items-center">
                    Location
                    <SortIndicator field="location" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("capacity")}
                >
                  <div className="flex items-center">
                    Capacity
                    <SortIndicator field="capacity" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("usage")}
                >
                  <div className="flex items-center">
                    Usage
                    <SortIndicator field="usage" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSortClick("status")}
                >
                  <div className="flex items-center">
                    Status
                    <SortIndicator field="status" />
                  </div>
                </th>
                <th className="px-6 py-3 text-center font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {boxes.length > 0 ? (
                boxes.map((box) => {
                  const capacityPercentage = calculateBoxCapacity(box);
                  const capacityColorClass = getBoxCapacityColorClass(capacityPercentage);
                  
                  return (
                    <tr key={box.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link 
                          to={`/dashboard/boxes/${box.id}`} 
                          className="font-medium flex items-center gap-2"
                        >
                          <Package2 className="h-4 w-4 text-muted-foreground" />
                          {box.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {box.name || <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/dashboard/warehouses/${box.warehouseId}`}
                          className="text-primary hover:underline"
                        >
                          {box.warehouseName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {formatBoxLocation(box)}
                      </td>
                      <td className="px-6 py-4">
                        {box.capacity} units
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                capacityPercentage < 50
                                  ? "bg-green-500"
                                  : capacityPercentage < 80
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${capacityPercentage}%` }}
                            />
                          </div>
                          <span className={capacityColorClass}>
                            {capacityPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          box.isActive 
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}>
                          {box.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="relative group">
                            <button
                              className="p-1 rounded-md hover:bg-muted"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border hidden group-hover:block z-10">
                              <div className="py-1">
                                <Link
                                  to={`/dashboard/boxes/${box.id}`}
                                  className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                >
                                  View Details
                                </Link>
                                <Link
                                  to={`/dashboard/boxes/${box.id}/edit`}
                                  className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                >
                                  Edit Box
                                </Link>
                                <Link
                                  to={`/dashboard/boxes/${box.id}/items`}
                                  className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                                >
                                  Manage Items
                                </Link>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                                >
                                  Delete Box
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package2 className="h-8 w-8 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No boxes found</h3>
                      <p className="text-muted-foreground">
                        {search || warehouseId || status || section || row || column || level
                          ? "Try adjusting your filters"
                          : "Add your first box to get started"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{boxes.length > 0 ? startItem : 0}</span> to{" "}
          <span className="font-medium">{boxes.length > 0 ? endItem : 0}</span> of{" "}
          <span className="font-medium">{total}</span> boxes
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page:</span>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 py-0.5"
              value={limit.toString()}
              onChange={(e) => {
                updateSearchParams("limit", e.target.value);
                updateSearchParams("page", "1");
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => updateSearchParams("page", (page - 1).toString())}
              aria-label="Previous page"
            >
              &lt;
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNum => {
                if (totalPages <= 5) return true;
                if (pageNum === 1 || pageNum === totalPages) return true;
                if (pageNum >= page - 1 && pageNum <= page + 1) return true;
                return false;
              })
              .map((pageNum, i, filtered) => (
                <React.Fragment key={pageNum}>
                  {i > 0 && filtered[i - 1] !== pageNum - 1 && (
                    <span className="flex items-center justify-center h-8 w-8">...</span>
                  )}
                  <button
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-input bg-background hover:bg-muted transition-colors"
                    }`}
                    onClick={() => updateSearchParams("page", pageNum.toString())}
                  >
                    {pageNum}
                  </button>
                </React.Fragment>
              ))}
            
            <button
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => updateSearchParams("page", (page + 1).toString())}
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
