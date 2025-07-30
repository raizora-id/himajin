import { useCallback, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { SortingState } from "@tanstack/react-table";
import { UserRole } from "../models/user.model";

// Default values for URL parameters
const DEFAULTS = {
  sortBy: "name",
  sortOrder: "asc",
  page: "1",
  limit: "10",
};

// Define filter value interfaces
export interface UserFilterValues {
  search: string | null;
  role: string | null;
  warehouseId: string | null;
  status: string | null;
}

export interface UserTempFilterValues {
  role: string;
  warehouseId: string;
  status: string;
}

export function useUsersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFiltersState, setShowFiltersState] = useState(false);
  
  // Initialize temporary filter values for the UI
  const [tempFilterValues, setTempFilterValues] = useState<UserTempFilterValues>({
    role: searchParams.get("role") || "",
    warehouseId: searchParams.get("warehouseId") || "",
    status: searchParams.get("status") || "",
  });
  
  // Get values from URL
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const warehouseId = searchParams.get("warehouseId");
  const status = searchParams.get("status");
  const sortBy = searchParams.get("sortBy") || DEFAULTS.sortBy;
  const sortOrder = searchParams.get("sortOrder") || DEFAULTS.sortOrder;
  const page = Number(searchParams.get("page") || DEFAULTS.page);
  const limit = Number(searchParams.get("limit") || DEFAULTS.limit);
  
  // Helper to update URL params
  const updateUrlParam = useCallback((key: string, value: string | number | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);
  
  // Setters for URL params
  const setSearch = useCallback((value: string | null) => updateUrlParam("search", value), [updateUrlParam]);
  const setRole = useCallback((value: string | null) => updateUrlParam("role", value), [updateUrlParam]);
  const setWarehouseId = useCallback((value: string | null) => updateUrlParam("warehouseId", value), [updateUrlParam]);
  const setStatus = useCallback((value: string | null) => updateUrlParam("status", value), [updateUrlParam]);
  const setSortBy = useCallback((value: string) => updateUrlParam("sortBy", value), [updateUrlParam]);
  const setSortOrder = useCallback((value: string) => updateUrlParam("sortOrder", value), [updateUrlParam]);
  const setPage = useCallback((value: number) => updateUrlParam("page", value), [updateUrlParam]);
  const setLimit = useCallback((value: number) => updateUrlParam("limit", value), [updateUrlParam]);

  // Toggle filter visibility
  const setShowFilters = useCallback((value: boolean) => {
    setShowFiltersState(value);
  }, []);
  
  // Helper to update temp filter values
  const updateTempFilter = useCallback((key: keyof UserTempFilterValues, value: string) => {
    setTempFilterValues(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  
  // Apply filters from temp state to URL
  const applyFilters = useCallback(() => {
    setRole(tempFilterValues.role || null);
    setWarehouseId(tempFilterValues.warehouseId || null);
    setStatus(tempFilterValues.status || null);
    setPage(1); // Reset to first page when applying filters
  }, [tempFilterValues, setRole, setWarehouseId, setStatus, setPage]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    // Reset URL filters
    setSearch(null);
    setRole(null);
    setWarehouseId(null);
    setStatus(null);
    setPage(1);
    
    // Reset temp filters
    setTempFilterValues({
      role: "",
      warehouseId: "",
      status: "",
    });
  }, [setSearch, setRole, setWarehouseId, setStatus, setPage]);
  
  // Check if there are active filters
  const hasActiveFilters = Boolean(search || role || warehouseId || status);
  
  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value || null);
    setPage(1); // Reset to first page when searching
  }, [setSearch, setPage]);
  
  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);
  
  // Handle limit change
  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, [setLimit, setPage]);
  
  // Convert sortBy and sortOrder to react-table's SortingState
  const sorting: SortingState = [{
    id: sortBy,
    desc: sortOrder === "desc"
  }];
  
  // Handle sorting change
  const handleSortChange = useCallback((newSorting: SortingState) => {
    if (newSorting.length > 0) {
      const field = newSorting[0].id;
      const newOrder = newSorting[0].desc ? "desc" : "asc";
      setSortBy(field);
      setSortOrder(newOrder);
    }
  }, [setSortBy, setSortOrder]);
  
  // Build filter values for the current state
  const filter: UserFilterValues = {
    search,
    role,
    warehouseId,
    status,
  };
  
  // Calculate pagination details
  const pagination = {
    currentPage: page,
    pageSize: limit,
    totalPages: 0,  // Will be set by the component
    totalItems: 0,  // Will be set by the component
  };
  
  return {
    // Filter state
    search,
    role,
    setRole,
    warehouseId,
    setWarehouseId,
    status,
    setStatus,
    
    // Filter UI state
    showFilters: showFiltersState,
    setShowFilters,
    tempFilters: tempFilterValues,
    updateTempFilter,
    applyFilters,
    resetFilters,
    
    // Pagination
    page,
    limit,
    pagination,
    handlePageChange,
    handleLimitChange,
    
    // Sorting
    sorting,
    handleSortChange,
    
    // Search
    handleSearchChange,
    
    // Combined states
    filter,
    hasActiveFilters,
  };
}
