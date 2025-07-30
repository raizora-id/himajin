import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { 
  Package, 
  Plus, 
} from "lucide-react";
import { Pagination, ProductsTable, ProductFilterSection } from "~/features/dashboard/components";
import { useProductFilters } from "~/features/dashboard/hooks/use-product-filters";
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

export default function ProductsIndex() {
  const { 
    products, 
    filter, 
    pagination, 
    filterOptions 
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  
  // Use our custom hook for filter state management
  const { 
    search,
    category,
    setCategory,
    warehouseId,
    setWarehouseId,
    boxId,
    setBoxId,
    inStock,
    setInStock,
    showFilters,
    setShowFilters,
    tempFilters,
    updateTempFilter,
    applyFilters,
    resetFilters,
    page,
    setPage,
    limit,
    setLimit,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    hasActiveFilters,
    sorting,
    setSorting
  } = useProductFilters();
  
  // Initialize temp filters with data from the loader if provided
  useEffect(() => {
    if (filter) {
      updateTempFilter("category", filter.category || "");
      updateTempFilter("warehouseId", filter.warehouseId || "");
      updateTempFilter("inStock", filter.inStock || false);
      updateTempFilter("boxId", filter.boxId || "");
    }
  }, [filter]);

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
      <ProductFilterSection 
        searchValue={filter.search || ""}
        onSearchChange={handleSearchChange}
        filterValues={{
          category: filter.category || "",
          warehouseId: filter.warehouseId || "",
          boxId: filter.boxId || "",
          inStock: !!filter.inStock
        }}
        tempFilterValues={tempFilters}
        onTempFilterChange={updateTempFilter}
        categories={filterOptions.categories}
        warehouses={filterOptions.warehouses}
        boxes={filterOptions.boxes}
        hasActiveFilters={hasActiveFilters}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        onClearFilter={(key) => {
          if (key === "category") {
            updateTempFilter("category", "");
            setCategory(null);
          } else if (key === "warehouseId") {
            updateTempFilter("warehouseId", "");
            setWarehouseId(null);
          } else if (key === "boxId") {
            updateTempFilter("boxId", "");
            setBoxId(null);
          } else if (key === "inStock") {
            updateTempFilter("inStock", false);
            setInStock(null);
          }
        }}
      />
      
      {/* Products Table */}
      <div className="border border-border rounded-md overflow-hidden">
        {products.length === 0 ? (
          <div className="rounded-md border p-8">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <Package className="h-12 w-12 text-muted-foreground/80" />
              <h3 className="text-lg font-semibold">
                {filter.search || hasActiveFilters 
                  ? "No products match the current filters" 
                  : "No products found"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasActiveFilters 
                  ? "Try adjusting your filters or search terms" 
                  : "Add your first product to get started"}
              </p>
              {!hasActiveFilters && (
                <Link 
                  to="/dashboard/products/add"
                  className="mt-2 inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              )}
            </div>
          </div>
        ) : (
          <ProductsTable 
            products={products}
            sorting={sorting}
            setSorting={setSorting}
            onSortingChange={handleSortChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
      
      {/* Pagination */}
      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.totalCount}
        onPageChange={handlePageChange}
        onLimitChange={(newLimit: number) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {products.length} of {pagination.totalCount} products
      </div>
    </div>
  );
}
