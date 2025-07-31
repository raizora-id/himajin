import { useCallback } from "react";
import { useSearchParams } from "@remix-run/react";

export interface WarehouseFilterValues {
  search: string | null;
  status: string | null;
  city: string | null;
  province: string | null;
}

export interface WarehouseTempFilterValues {
  status: string;
  city: string;
  province: string;
}

export interface WarehouseSortingState {
  sortField: string | null;
  sortDirection: string | null;
}

export interface WarehousePaginationState {
  page: number;
  pageSize: number;
}

export interface UseWarehousesFiltersReturn {
  // Current filter values from URL
  filterValues: WarehouseFilterValues;
  
  // Temporary filter values for UI controls
  tempFilterValues: WarehouseTempFilterValues;
  
  // Sorting state
  sortingState: WarehouseSortingState;
  
  // Pagination state
  paginationState: WarehousePaginationState;
  
  // State setters
  setSearch: (value: string | null) => void;
  setFilter: (key: keyof WarehouseFilterValues, value: string | null) => void;
  setSorting: (field: string, direction: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Handler functions
  onSearchChange: (value: string) => void;
  onTempFilterChange: (key: keyof WarehouseTempFilterValues, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClearFilter: (key: keyof WarehouseFilterValues) => void;
  onSortingChange: (field: string) => void;
  
  // Helper state
  hasActiveFilters: boolean;
  showFilters: boolean;
  toggleFilters: () => void;
  
  // Total items for pagination calculations
  totalItems: number;
  setTotalItems: (total: number) => void;
}

export function useWarehousesFilters(): UseWarehousesFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Extract values from URL params
  const search = searchParams.get("q");
  const status = searchParams.get("status");
  const city = searchParams.get("city");
  const province = searchParams.get("province");
  
  const sortField = searchParams.get("sortField") || "name";
  const sortDirection = searchParams.get("sortDirection") || "asc";
  
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  
  // Local state for UI filters toggle
  const showFilters = searchParams.has("showFilters") 
    ? searchParams.get("showFilters") === "true" 
    : false;
  
  // Temporary filter values for UI before applying
  const tempFilterValues: WarehouseTempFilterValues = {
    status: status || "all",
    city: city || "all",
    province: province || "all"
  };
  
  // Check if there are any active filters
  const hasActiveFilters = 
    !!search || 
    (status !== null && status !== "all") || 
    (city !== null && city !== "all") || 
    (province !== null && province !== "all");
  
  // Track total items for pagination calculations
  // This will be set from the loader data
  const totalItems = parseInt(searchParams.get("totalItems") || "0");
  
  // Helper functions to update URL params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      
      // Reset to page 1 when filters change
      if (!Object.keys(updates).includes("page")) {
        newParams.set("page", "1");
      }
      
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );
  
  // Setters for individual filter values
  const setSearch = useCallback(
    (value: string | null) => {
      updateSearchParams({ q: value });
    },
    [updateSearchParams]
  );
  
  const setFilter = useCallback(
    (key: keyof WarehouseFilterValues, value: string | null) => {
      updateSearchParams({ [key]: value });
    },
    [updateSearchParams]
  );
  
  const setSorting = useCallback(
    (field: string, direction: string) => {
      updateSearchParams({
        sortField: field,
        sortDirection: direction
      });
    },
    [updateSearchParams]
  );
  
  const setPage = useCallback(
    (newPage: number) => {
      updateSearchParams({ page: String(newPage) });
    },
    [updateSearchParams]
  );
  
  const setPageSize = useCallback(
    (newPageSize: number) => {
      updateSearchParams({
        pageSize: String(newPageSize),
        page: "1" // Reset to first page when changing page size
      });
    },
    [updateSearchParams]
  );
  
  const setTotalItems = useCallback(
    (total: number) => {
      updateSearchParams({ totalItems: String(total) });
    },
    [updateSearchParams]
  );
  
  // Handler functions for UI components
  const onSearchChange = useCallback(
    (value: string) => {
      if (value === "") {
        setSearch(null);
      } else {
        setSearch(value);
      }
    },
    [setSearch]
  );
  
  const onTempFilterChange = useCallback(
    (key: keyof WarehouseTempFilterValues, value: string) => {
      tempFilterValues[key] = value;
    },
    [tempFilterValues]
  );
  
  const onApplyFilters = useCallback(() => {
    updateSearchParams({
      status: tempFilterValues.status === "all" ? null : tempFilterValues.status,
      city: tempFilterValues.city === "all" ? null : tempFilterValues.city,
      province: tempFilterValues.province === "all" ? null : tempFilterValues.province
    });
  }, [tempFilterValues, updateSearchParams]);
  
  const onResetFilters = useCallback(() => {
    tempFilterValues.status = "all";
    tempFilterValues.city = "all";
    tempFilterValues.province = "all";
    
    updateSearchParams({
      q: null,
      status: null,
      city: null,
      province: null
    });
  }, [tempFilterValues, updateSearchParams]);
  
  const onClearFilter = useCallback(
    (key: keyof WarehouseFilterValues) => {
      if (key === "search") {
        setSearch(null);
      } else {
        setFilter(key, null);
        // Also update the temp filter state
        const tempKey = key as keyof WarehouseTempFilterValues;
        if (tempKey) {
          tempFilterValues[tempKey] = "all";
        }
      }
    },
    [setSearch, setFilter, tempFilterValues]
  );
  
  const onSortingChange = useCallback(
    (field: string) => {
      let direction = "asc";
      if (field === sortField) {
        direction = sortDirection === "asc" ? "desc" : "asc";
      }
      setSorting(field, direction);
    },
    [sortField, sortDirection, setSorting]
  );
  
  const toggleFilters = useCallback(() => {
    updateSearchParams({ showFilters: showFilters ? null : "true" });
  }, [showFilters, updateSearchParams]);
  
  return {
    filterValues: {
      search,
      status,
      city,
      province
    },
    tempFilterValues,
    sortingState: {
      sortField,
      sortDirection
    },
    paginationState: {
      page,
      pageSize
    },
    setSearch,
    setFilter,
    setSorting,
    setPage,
    setPageSize,
    onSearchChange,
    onTempFilterChange,
    onApplyFilters,
    onResetFilters,
    onClearFilter,
    onSortingChange,
    hasActiveFilters,
    showFilters,
    toggleFilters,
    totalItems,
    setTotalItems
  };
}
