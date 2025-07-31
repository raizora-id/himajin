import { useQueryState, parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs";
import React from "react";
import type { SortingState } from "@tanstack/react-table";

export function useBoxFilters() {
  // Filter query params
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [warehouseId, setWarehouseId] = useQueryState("warehouse", parseAsString);
  const [status, setStatus] = useQueryState("status", parseAsString);
  const [section, setSection] = useQueryState("section", parseAsString);
  const [row, setRow] = useQueryState("row", parseAsString);
  const [column, setColumn] = useQueryState("column", parseAsString);
  const [level, setLevel] = useQueryState("level", parseAsString);
  
  // Pagination query params
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  
  // Sorting query params
  const [sortField, setSortField] = useQueryState("sort", parseAsString.withDefault("code"));
  const [sortDirection, setSortDirection] = useQueryState(
    "direction", 
    parseAsStringEnum(["asc", "desc"]).withDefault("asc")
  );
  
  // Local sorting state for DataTable
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: sortField, desc: sortDirection === "desc" },
  ]);
  
  // Sync sorting state with URL parameters
  React.useEffect(() => {
    setSorting([{ id: sortField, desc: sortDirection === "desc" }]);
  }, [sortField, sortDirection]);
  
  // Handler for when sorting changes in the DataTable component
  const handleSortingChange = (newSorting: SortingState) => {
    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      setSortField(id);
      setSortDirection(desc ? "desc" : "asc");
    } else {
      // Clear sorting if sorting is removed
      setSortField(null);
      setSortDirection(null);
    }
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || null);
    // Reset to page 1 when search changes
    setPage(1);
  };
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: string | null) => {
    // Using the appropriate setter based on the key
    switch (key) {
      case "warehouse":
        setWarehouseId(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "section":
        setSection(value);
        break;
      case "row":
        setRow(value);
        break;
      case "column":
        setColumn(value);
        break;
      case "level":
        setLevel(value);
        break;
    }
    // Reset to page 1 when filters change
    setPage(1);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setWarehouseId(null);
    setStatus(null);
    setSection(null);
    setRow(null);
    setColumn(null);
    setLevel(null);
    setPage(1);
  };
  
  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };
  
  // Helper function to check if any filters are active
  const hasActiveFilters = Boolean(
    search || warehouseId || status || section || row || column || level
  );
  
  return {
    // Filter states
    search,
    warehouseId,
    status,
    section,
    row,
    column,
    level,
    // Pagination states
    page,
    limit,
    // Sorting states
    sorting,
    sortField,
    sortDirection,
    // Handlers
    handleSearchChange,
    handleFilterChange,
    clearFilters,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    setSorting,
    // Utility
    hasActiveFilters,
  };
}
