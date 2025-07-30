import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { ArrowDown, ArrowUp, Building2, MoreHorizontal, Plus, Search } from "lucide-react";
import { 
  mockWarehouses, 
  calculateCapacityPercentage, 
  getCapacityColorClass 
} from "~/features/dashboard/models/warehouse.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Warehouses - POS System" },
    { name: "description", content: "Manage warehouses and branches" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get search params from URL
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";
  const statusFilter = url.searchParams.get("status") || "all";
  const cityFilter = url.searchParams.get("city") || "all";
  const provinceFilter = url.searchParams.get("province") || "all";
  
  const sortField = url.searchParams.get("sortField") || "name";
  const sortDirection = url.searchParams.get("sortDirection") || "asc";
  
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
  
  // Filter warehouses based on search query and filters
  let filteredWarehouses = [...mockWarehouses];
  
  // Search by name, code, address, or city
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredWarehouses = filteredWarehouses.filter(warehouse => 
      warehouse.name.toLowerCase().includes(query) ||
      warehouse.code.toLowerCase().includes(query) ||
      warehouse.address.toLowerCase().includes(query) ||
      warehouse.city.toLowerCase().includes(query)
    );
  }
  
  // Filter by status
  if (statusFilter !== "all") {
    const isActive = statusFilter === "active";
    filteredWarehouses = filteredWarehouses.filter(warehouse => 
      warehouse.isActive === isActive
    );
  }
  
  // Filter by city
  if (cityFilter !== "all") {
    filteredWarehouses = filteredWarehouses.filter(warehouse => 
      warehouse.city === cityFilter
    );
  }
  
  // Filter by province
  if (provinceFilter !== "all") {
    filteredWarehouses = filteredWarehouses.filter(warehouse => 
      warehouse.province === provinceFilter
    );
  }
  
  // Sort warehouses
  filteredWarehouses.sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
        break;
      case "city":
        comparison = a.city.localeCompare(b.city);
        break;
      case "capacity":
        comparison = a.capacity - b.capacity;
        break;
      case "usedCapacity":
        const percentageA = calculateCapacityPercentage(a);
        const percentageB = calculateCapacityPercentage(b);
        comparison = percentageA - percentageB;
        break;
      case "isActive":
        comparison = a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  // Get total count before pagination
  const totalCount = filteredWarehouses.length;
  
  // Paginate warehouses
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedWarehouses = filteredWarehouses.slice(start, end);
  
  // Get unique cities and provinces for filters
  const cities = Array.from(
    new Set(mockWarehouses.map(warehouse => warehouse.city))
  ).sort();
  
  const provinces = Array.from(
    new Set(mockWarehouses.map(warehouse => warehouse.province))
  ).sort();
  
  return json({
    warehouses: paginatedWarehouses,
    pagination: {
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    filters: {
      cities,
      provinces,
    }
  });
};

function getQueryString(
  params: URLSearchParams,
  modifiedParams: Record<string, string | number | null>
): string {
  const newParams = new URLSearchParams(params.toString());
  
  // Update modified params
  Object.entries(modifiedParams).forEach(([key, value]) => {
    if (value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });
  
  return newParams.toString();
}

export default function WarehousesList() {
  const { warehouses, pagination, filters } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  
  // Get current sort and filter values
  const sortField = params.get("sortField") || "name";
  const sortDirection = params.get("sortDirection") || "asc";
  const searchQuery = params.get("q") || "";
  const statusFilter = params.get("status") || "all";
  const cityFilter = params.get("city") || "all";
  const provinceFilter = params.get("province") || "all";
  
  // Sort link helper
  const getSortLink = (field: string) => {
    let direction = "asc";
    if (field === sortField) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }
    return `?${getQueryString(params, {
      sortField: field,
      sortDirection: direction,
      page: 1,
    })}`;
  };
  
  // Sort indicator helper
  const SortIndicator = ({ field }: { field: string }) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Warehouses</h2>
          <p className="text-muted-foreground">Manage warehouses and branches</p>
        </div>
        <Link
          to="/dashboard/warehouses/add"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <form method="get" action="/dashboard/warehouses">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search warehouses by name, code, address..."
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background"
                  defaultValue={searchQuery}
                />
                {/* Preserve other params */}
                <input type="hidden" name="status" value={statusFilter} />
                <input type="hidden" name="city" value={cityFilter} />
                <input type="hidden" name="province" value={provinceFilter} />
                <input type="hidden" name="sortField" value={sortField} />
                <input type="hidden" name="sortDirection" value={sortDirection} />
                <input type="hidden" name="page" value="1" />
              </div>
            </form>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              name="status"
              className="h-10 px-3 rounded-md border border-input bg-background"
              value={statusFilter}
              onChange={(e) => {
                window.location.href = `?${getQueryString(params, {
                  status: e.target.value,
                  page: 1,
                })}`;
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          {/* City Filter */}
          <div>
            <select
              name="city"
              className="h-10 px-3 rounded-md border border-input bg-background"
              value={cityFilter}
              onChange={(e) => {
                window.location.href = `?${getQueryString(params, {
                  city: e.target.value,
                  page: 1,
                })}`;
              }}
            >
              <option value="all">All Cities</option>
              {filters.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          {/* Province Filter */}
          <div>
            <select
              name="province"
              className="h-10 px-3 rounded-md border border-input bg-background"
              value={provinceFilter}
              onChange={(e) => {
                window.location.href = `?${getQueryString(params, {
                  province: e.target.value,
                  page: 1,
                })}`;
              }}
            >
              <option value="all">All Provinces</option>
              {filters.provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          
          {/* Clear Filters */}
          {(searchQuery || statusFilter !== "all" || cityFilter !== "all" || provinceFilter !== "all") && (
            <div>
              <Link
                to={`?sortField=${sortField}&sortDirection=${sortDirection}&page=1`}
                className="h-10 px-3 rounded-md border border-input bg-background inline-flex items-center"
              >
                Clear Filters
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Warehouses Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="font-semibold text-left p-4">
                  <Link to={getSortLink("name")} className="flex items-center gap-2">
                    Warehouse
                    <SortIndicator field="name" />
                  </Link>
                </th>
                <th className="font-semibold text-left p-4">
                  <Link to={getSortLink("code")} className="flex items-center gap-2">
                    Code
                    <SortIndicator field="code" />
                  </Link>
                </th>
                <th className="font-semibold text-left p-4">
                  <Link to={getSortLink("city")} className="flex items-center gap-2">
                    Location
                    <SortIndicator field="city" />
                  </Link>
                </th>
                <th className="font-semibold text-left p-4">
                  <Link to={getSortLink("capacity")} className="flex items-center gap-2">
                    Capacity
                    <SortIndicator field="capacity" />
                  </Link>
                </th>
                <th className="font-semibold text-left p-4">
                  <Link to={getSortLink("usedCapacity")} className="flex items-center gap-2">
                    Usage
                    <SortIndicator field="usedCapacity" />
                  </Link>
                </th>
                <th className="font-semibold text-left p-4">
                  <Link to={getSortLink("isActive")} className="flex items-center gap-2">
                    Status
                    <SortIndicator field="isActive" />
                  </Link>
                </th>
                <th className="font-semibold text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    No warehouses found matching your filters.
                  </td>
                </tr>
              ) : (
                warehouses.map((warehouse) => {
                  const capacityPercentage = calculateCapacityPercentage(warehouse);
                  const capacityColor = getCapacityColorClass(capacityPercentage);
                  
                  return (
                    <tr key={warehouse.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <Link 
                          to={`/dashboard/warehouses/${warehouse.id}`} 
                          className="font-medium flex items-center gap-2"
                        >
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {warehouse.name}
                        </Link>
                      </td>
                      <td className="p-4">{warehouse.code}</td>
                      <td className="p-4">
                        <div>{warehouse.city}</div>
                        <div className="text-xs text-muted-foreground">{warehouse.province}</div>
                      </td>
                      <td className="p-4">
                        {new Intl.NumberFormat().format(warehouse.capacity)} units
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${capacityPercentage < 50 ? 'bg-green-500' : capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${capacityPercentage}%` }}
                            />
                          </div>
                          <span className={capacityColor}>{capacityPercentage}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          warehouse.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end">
                          <div className="relative dropdown">
                            <button 
                              className="p-2 rounded-md hover:bg-muted"
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border hidden">
                              <div className="py-1">
                                <Link 
                                  to={`/dashboard/warehouses/${warehouse.id}`}
                                  className="block px-4 py-2 text-sm hover:bg-muted"
                                >
                                  View Details
                                </Link>
                                <Link 
                                  to={`/dashboard/warehouses/${warehouse.id}/edit`}
                                  className="block px-4 py-2 text-sm hover:bg-muted"
                                >
                                  Edit
                                </Link>
                                <button 
                                  className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-border py-4 px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{" "}
            {pagination.totalCount} warehouses
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <select
                className="h-9 px-3 rounded-md border border-input bg-background"
                value={pagination.pageSize}
                onChange={(e) => {
                  window.location.href = `?${getQueryString(params, {
                    pageSize: e.target.value,
                    page: 1,
                  })}`;
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <Link
                to={`?${getQueryString(params, { page: Math.max(1, pagination.page - 1) })}`}
                className={`h-9 w-9 flex items-center justify-center rounded-md border border-input ${
                  pagination.page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                }`}
                aria-disabled={pagination.page <= 1}
              >
                <span className="sr-only">Previous Page</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              
              <span className="mx-3">
                Page{" "}
                <strong>
                  {pagination.page} of {pagination.totalPages || 1}
                </strong>
              </span>
              
              <Link
                to={`?${getQueryString(params, { page: Math.min(pagination.totalPages, pagination.page + 1) })}`}
                className={`h-9 w-9 flex items-center justify-center rounded-md border border-input ${
                  pagination.page >= pagination.totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                }`}
                aria-disabled={pagination.page >= pagination.totalPages}
              >
                <span className="sr-only">Next Page</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
