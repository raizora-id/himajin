import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";
import { Button } from "~/ui/button/button";
import { Pagination } from "~/features/dashboard/components/pagination";
import { WarehousesTable } from "~/features/dashboard/components/warehouses-table";
import { WarehousesFilterSection } from "~/features/dashboard/components/warehouses-filter-section";
import { useWarehousesFilters } from "~/features/dashboard/hooks/use-warehouses-filters";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";

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
        const usedCapacityA = Math.round((a.usedCapacity / a.capacity) * 100);
        const usedCapacityB = Math.round((b.usedCapacity / b.capacity) * 100);
        comparison = usedCapacityA - usedCapacityB;
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
  
  // Format cities and provinces for filter options
  const cities = Array.from(
    new Set(mockWarehouses.map(warehouse => warehouse.city))
  ).sort().map(city => ({ value: city, label: city }));
  
  const provinces = Array.from(
    new Set(mockWarehouses.map(warehouse => warehouse.province))
  ).sort().map(province => ({ value: province, label: province }));
  
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

export default function WarehousesList() {
  const { warehouses, pagination, filters } = useLoaderData<typeof loader>();
  const {
    filterValues,
    tempFilterValues,
    sortingState,
    paginationState,
    onSearchChange,
    onTempFilterChange,
    onApplyFilters,
    onResetFilters,
    onClearFilter,
    onSortingChange,
    hasActiveFilters,
    showFilters,
    toggleFilters,
    setPage,
    setPageSize,
    setSorting
  } = useWarehousesFilters();
  
  const handleDeleteWarehouse = (id: string) => {
    // In a real application, this would call an API to delete the warehouse
    console.log(`Delete warehouse with ID: ${id}`);
    alert(`Warehouse with ID ${id} would be deleted here.`);
    // After deletion, you would typically reload the data
  };
  
  // Adapter function to convert between react-table's SortingState and our field-based sorting
  const handleSortingChange = (sorting: SortingState) => {
    // Extract the first sorting rule (we're using single-field sorting)
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      onSortingChange(id);
    }
  };
  
  // Create a proper adapter for setSorting that matches React.Dispatch<React.SetStateAction<SortingState>>
  const handleSetSorting: React.Dispatch<React.SetStateAction<SortingState>> = (action) => {
    // Handle both direct state updates and function updates
    const newSorting = typeof action === 'function' ? action([
      { id: sortingState.sortField || 'name', desc: sortingState.sortDirection === 'desc' }
    ]) : action;
    
    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      const direction = desc ? "desc" : "asc";
      setSorting(id, direction);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-2xl font-semibold">Warehouses</h1>
        <Button asChild>
          <Link to="/dashboard/warehouses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Link>
        </Button>
      </div>
      
      {/* Filter Section */}
      <WarehousesFilterSection 
        searchValue={filterValues.search}
        onSearchChange={onSearchChange}
        filterValues={filterValues}
        tempFilterValues={tempFilterValues}
        onTempFilterChange={onTempFilterChange}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
        onClearFilter={onClearFilter}
        hasActiveFilters={hasActiveFilters}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        cities={filters.cities}
        provinces={filters.provinces}
      />
      
      {/* Table */}
      <div className="mt-4">
        <WarehousesTable 
          warehouses={warehouses}
          sorting={[{ id: sortingState.sortField || 'name', desc: sortingState.sortDirection === 'desc' }]}
          setSorting={handleSetSorting}
          onSortingChange={handleSortingChange}
        />
      </div>
      
      {/* Pagination */}
      <div className="mt-4">
        <Pagination 
          page={paginationState.page}
          limit={paginationState.pageSize}
          total={pagination.totalCount}
          onPageChange={setPage}
          onLimitChange={setPageSize}
        />
      </div>
    </div>
  );
}
