import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Package2, Plus, Search } from "lucide-react";
import { useBoxFilters } from "~/features/dashboard/hooks/use-box-filters";
import React from "react";
import { mockBoxes, type Box, formatBoxLocation, calculateBoxCapacity } from "~/features/dashboard/models/box.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";
import { 
  EmptyState, 
  FilterSection,
  Pagination,
  BoxesTable
} from "~/features/dashboard/components";
import type { SortingState } from "@tanstack/react-table";

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
  
  // Get pagination params with proper defaults for compatibility with nuqs
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  
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
  
  // Use our custom hook for URL query state management
  const {
    search,
    warehouseId,
    status,
    section,
    row,
    column,
    level,
    page: pageParam,
    limit: limitParam,
    sorting,
    setSorting,
    handleSearchChange,
    handleFilterChange,
    clearFilters,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    hasActiveFilters
  } = useBoxFilters();
  
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
      <FilterSection
        searchValue={search || ""}
        onSearchChange={handleSearchChange}
        warehouses={warehouses.map(w => ({ value: w.id, label: w.name }))}
        sections={sections}
        rows={rows}
        columns={columns}
        levels={levels}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      {/* Boxes Table */}
      {boxes.length === 0 ? (
        <div className="rounded-md border p-8">
          <EmptyState
            icon={Package2}
            title="No boxes found"
            description={hasActiveFilters
              ? "Try adjusting your filters"
              : "Add your first box to get started"}
            actionLink="/dashboard/boxes/add"
            actionLabel="Add Box"
            actionIcon={Plus}
            showAction={!hasActiveFilters}
          />
        </div>
      ) : (
        <BoxesTable
          boxes={boxes}
          sorting={sorting}
          setSorting={setSorting}
          onSortingChange={handleSortingChange}
        />
      )}
      
      {/* Pagination */}
      <Pagination
        page={pageParam}
        limit={limitParam}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
