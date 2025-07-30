import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowUpDown, 
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatCurrency, generatePagination } from "~/lib/utils";
import { mockProducts, type ProductListItem, type ProductFilter } from "~/features/dashboard/models/product.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Products - POS System" },
    { name: "description", content: "Manage your product inventory" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // In a real app, this would fetch data from your database
  const url = new URL(request.url);
  
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const warehouseId = url.searchParams.get("warehouseId") || "";
  const minPrice = url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined;
  const maxPrice = url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined;
  const inStock = url.searchParams.get("inStock") === "true";
  const boxId = url.searchParams.get("boxId") || "";
  const page = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "10");
  const sortBy = url.searchParams.get("sortBy") || "name";
  const sortOrder = url.searchParams.get("sortOrder") || "asc";

  const filter: ProductFilter = {
    search,
    category: category || undefined,
    warehouseId: warehouseId || undefined,
    minPrice,
    maxPrice,
    inStock: url.searchParams.has("inStock") ? inStock : undefined,
    boxId: boxId || undefined,
    page,
    limit,
    sortBy,
    sortOrder: sortOrder === "desc" ? "desc" : "asc"
  };
  
  // Filter and sort products
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchLower))
    );
  }
  
  if (filter.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === filter.category
    );
  }
  
  if (filter.warehouseId) {
    filteredProducts = filteredProducts.filter(product => 
      product.warehouseId === filter.warehouseId
    );
  }
  
  if (filter.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= filter.minPrice!
    );
  }
  
  if (filter.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= filter.maxPrice!
    );
  }
  
  if (filter.inStock !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      filter.inStock ? product.stockQuantity > 0 : true
    );
  }
  
  if (filter.boxId) {
    filteredProducts = filteredProducts.filter(product => 
      product.boxId === filter.boxId
    );
  }
  
  // Sort products
  filteredProducts.sort((a, b) => {
    const sortField = filter.sortBy || "name";
    const sortMultiplier = filter.sortOrder === "desc" ? -1 : 1;
    
    if (sortField === "price") {
      return (a.price - b.price) * sortMultiplier;
    }
    
    if (sortField === "stockQuantity") {
      return (a.stockQuantity - b.stockQuantity) * sortMultiplier;
    }
    
    // Default to sort by name
    return a.name.localeCompare(b.name) * sortMultiplier;
  });
  
  // Get total count before pagination
  const totalCount = filteredProducts.length;
  
  // Apply pagination
  const startIndex = (filter?.page ?? 1 - 1) * (filter?.limit ?? 10);
  const endIndex = startIndex + (filter?.limit ?? 10);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Convert to list items
  const productListItems: ProductListItem[] = paginatedProducts.map(product => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    stockQuantity: product.stockQuantity,
    category: product.category,
    warehouseId: product.warehouseId,
    warehouseName: product.warehouseName,
    isActive: product.isActive,
    boxId: product.boxId,
    boxName: product.boxName
  }));
  
  // Get unique categories and warehouses for filters
  const categories = Array.from(new Set(mockProducts.map(product => product.category)));
  const warehouses = Array.from(
    new Set(mockProducts.map(product => product.warehouseId))
  ).map(warehouseId => ({
    id: warehouseId,
    name: mockProducts.find(product => product.warehouseId === warehouseId)?.warehouseName || ""
  }));
  
  const boxes = Array.from(
    new Set(mockProducts.filter(p => p.boxId).map(product => product.boxId))
  ).map(boxId => ({
    id: boxId,
    name: mockProducts.find(product => product.boxId === boxId)?.boxName || ""
  }));
  
  const totalPages = Math.ceil(totalCount / (filter?.limit ?? 10));

  return json({
    products: productListItems,
    filter,
    pagination: {
      page: filter?.page ?? 1,
      limit: filter?.limit ?? 10,
      totalCount,
      totalPages
    },
    filterOptions: {
      categories,
      warehouses,
      boxes
    }
  });
};

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
}

function ActionButton({ label, icon, onClick, variant = "ghost" }: ActionButtonProps) {
  const baseClasses = "w-8 h-8 rounded-md flex items-center justify-center transition-colors";
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = generatePagination(currentPage, totalPages);
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-input bg-background disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-background hover:bg-accent"
            } ${typeof page !== "number" ? "cursor-default" : ""}`}
            disabled={typeof page !== "number"}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-input bg-background disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ProductsIndex() {
  const { 
    products, 
    filter, 
    pagination, 
    filterOptions 
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    category: filter.category || "",
    warehouseId: filter.warehouseId || "",
    inStock: filter.inStock || false,
    boxId: filter.boxId || ""
  });
  
  // Handle page change
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    // If already sorting by this field, toggle direction
    if (filter.sortBy === field) {
      newParams.set("sortOrder", filter.sortOrder === "asc" ? "desc" : "asc");
    } else {
      newParams.set("sortBy", field);
      newParams.set("sortOrder", "asc");
    }
    
    setSearchParams(newParams);
  };
  
  // Apply filters
  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (tempFilters.category) {
      newParams.set("category", tempFilters.category);
    } else {
      newParams.delete("category");
    }
    
    if (tempFilters.warehouseId) {
      newParams.set("warehouseId", tempFilters.warehouseId);
    } else {
      newParams.delete("warehouseId");
    }
    
    if (tempFilters.inStock) {
      newParams.set("inStock", "true");
    } else {
      newParams.delete("inStock");
    }
    
    if (tempFilters.boxId) {
      newParams.set("boxId", tempFilters.boxId);
    } else {
      newParams.delete("boxId");
    }
    
    // Reset to page 1
    newParams.set("page", "1");
    
    setSearchParams(newParams);
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    const newParams = new URLSearchParams();
    
    // Keep search query if any
    if (filter.search) {
      newParams.set("search", filter.search);
    }
    
    // Keep sort if any
    if (filter.sortBy) {
      newParams.set("sortBy", filter.sortBy);
      newParams.set("sortOrder", filter.sortOrder ?? "asc");
    }
    
    setSearchParams(newParams);
    setTempFilters({
      category: "",
      warehouseId: "",
      inStock: false,
      boxId: ""
    });
    setShowFilters(false);
  };
  
  // Check if any filters are active
  const hasActiveFilters = filter.category || filter.warehouseId || filter.inStock || filter.boxId;

  // Handle view, edit, delete actions
  const handleView = (id: string) => {
    navigate(`/dashboard/products/${id}`);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/dashboard/products/${id}/edit`);
  };
  
  const handleDelete = (id: string) => {
    // In a real app, this would call an action to delete the product
    alert(`Delete product ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        
        <Link 
          to="/dashboard/products/add"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md ${
              hasActiveFilters 
                ? "border-primary text-primary" 
                : "border-input bg-background"
            } hover:bg-accent transition-colors`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {Object.values(tempFilters).filter(Boolean).length}
              </span>
            )}
          </button>
          
          {showFilters && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border shadow-lg rounded-md p-4 z-10">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={tempFilters.category}
                    onChange={(e) => setTempFilters({...tempFilters, category: e.target.value})}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Warehouse</label>
                  <select
                    value={tempFilters.warehouseId}
                    onChange={(e) => setTempFilters({...tempFilters, warehouseId: e.target.value})}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Warehouses</option>
                    {filterOptions.warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Box</label>
                  <select
                    value={tempFilters.boxId}
                    onChange={(e) => setTempFilters({...tempFilters, boxId: e.target.value})}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Boxes</option>
                    {filterOptions.boxes.map((box) => (
                      <option key={box.id} value={box.id}>{box.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={tempFilters.inStock}
                    onChange={(e) => setTempFilters({...tempFilters, inStock: e.target.checked})}
                    className="h-4 w-4 rounded border-input"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Reset Filters
                  </button>
                  
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 text-sm rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filter.category && (
              <div className="bg-accent rounded-full px-3 py-1 text-xs flex items-center gap-1">
                <span>Category: {filter.category}</span>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("category");
                    setSearchParams(newParams);
                    setTempFilters({...tempFilters, category: ""});
                  }}
                  className="hover:bg-muted rounded-full w-4 h-4 inline-flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
            
            {filter.warehouseId && (
              <div className="bg-accent rounded-full px-3 py-1 text-xs flex items-center gap-1">
                <span>Warehouse: {filterOptions.warehouses.find(w => w.id === filter.warehouseId)?.name}</span>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("warehouseId");
                    setSearchParams(newParams);
                    setTempFilters({...tempFilters, warehouseId: ""});
                  }}
                  className="hover:bg-muted rounded-full w-4 h-4 inline-flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
            
            {filter.inStock && (
              <div className="bg-accent rounded-full px-3 py-1 text-xs flex items-center gap-1">
                <span>In Stock</span>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("inStock");
                    setSearchParams(newParams);
                    setTempFilters({...tempFilters, inStock: false});
                  }}
                  className="hover:bg-muted rounded-full w-4 h-4 inline-flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
            
            {filter.boxId && (
              <div className="bg-accent rounded-full px-3 py-1 text-xs flex items-center gap-1">
                <span>Box: {filterOptions.boxes.find(b => b.id === filter.boxId)?.name}</span>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("boxId");
                    setSearchParams(newParams);
                    setTempFilters({...tempFilters, boxId: ""});
                  }}
                  className="hover:bg-muted rounded-full w-4 h-4 inline-flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
            
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Products Table */}
      <div className="border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                  <button 
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSortChange("name")}
                  >
                    Product
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                  <button 
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSortChange("price")}
                  >
                    Price
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                  <button 
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSortChange("stockQuantity")}
                  >
                    Stock
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Warehouse</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Box</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="bg-background hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{product.name}</td>
                  <td className="px-4 py-3 text-sm font-mono">{product.sku}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-2 ${
                      product.stockQuantity > 20 
                        ? "bg-green-100 text-green-800" 
                        : product.stockQuantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm">{product.warehouseName}</td>
                  <td className="px-4 py-3 text-sm">{product.boxName || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-2 ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        label="View"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => handleView(product.id)}
                      />
                      <ActionButton
                        label="Edit"
                        icon={<Pencil className="h-4 w-4" />}
                        onClick={() => handleEdit(product.id)}
                      />
                      <ActionButton
                        label="Delete"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => handleDelete(product.id)}
                        variant="destructive"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                    {filter.search || hasActiveFilters 
                      ? "No products match the current filters" 
                      : "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {products.length} of {pagination.totalCount} products
      </div>
    </div>
  );
}
