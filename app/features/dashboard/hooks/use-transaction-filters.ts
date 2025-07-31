import { useCallback, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { SortingState } from "@tanstack/react-table";
import { PaymentMethod, TransactionStatus } from "../models/transaction.model";

// Default values for URL parameters
const DEFAULTS = {
  sortBy: "transactionDate",
  sortOrder: "desc",
  page: "1",
  limit: "10",
};

export interface TransactionFilterValues {
  search: string | null;
  status: string | null;
  paymentMethod: string | null;
  warehouse: string | null;
  dateRange: string | null;
}

export interface TransactionTempFilterValues {
  status: string;
  paymentMethod: string;
  warehouse: string;
  dateRange: string;
}

export function useTransactionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFiltersState, setShowFiltersState] = useState(false);
  
  // Initialize temporary filter values for the UI
  const [tempFilterValues, setTempFilterValues] = useState<TransactionTempFilterValues>({
    status: searchParams.get("status") || "",
    paymentMethod: searchParams.get("paymentMethod") || "",
    warehouse: searchParams.get("warehouse") || "",
    dateRange: searchParams.get("dateRange") || "",
  });
  
  // Get values from URL
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const paymentMethod = searchParams.get("paymentMethod");
  const warehouse = searchParams.get("warehouse");
  const dateRange = searchParams.get("dateRange");
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
  const setStatus = useCallback((value: string | null) => updateUrlParam("status", value), [updateUrlParam]);
  const setPaymentMethod = useCallback((value: string | null) => updateUrlParam("paymentMethod", value), [updateUrlParam]);
  const setWarehouse = useCallback((value: string | null) => updateUrlParam("warehouse", value), [updateUrlParam]);
  const setDateRange = useCallback((value: string | null) => updateUrlParam("dateRange", value), [updateUrlParam]);
  const setSortBy = useCallback((value: string) => updateUrlParam("sortBy", value), [updateUrlParam]);
  const setSortOrder = useCallback((value: string) => updateUrlParam("sortOrder", value), [updateUrlParam]);
  const setPage = useCallback((value: number) => updateUrlParam("page", value), [updateUrlParam]);
  const setLimit = useCallback((value: number) => updateUrlParam("limit", value), [updateUrlParam]);

  // Toggle filter visibility
  const setShowFilters = useCallback((value: boolean) => {
    setShowFiltersState(value);
  }, []);
  
  // Helper to update temp filter values
  const updateTempFilter = useCallback((key: keyof TransactionTempFilterValues, value: string) => {
    setTempFilterValues(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  
  // Apply filters from temp state to URL
  const applyFilters = useCallback(() => {
    setStatus(tempFilterValues.status || null);
    setPaymentMethod(tempFilterValues.paymentMethod || null);
    setWarehouse(tempFilterValues.warehouse || null);
    setDateRange(tempFilterValues.dateRange || null);
    setPage(1); // Reset to first page when applying filters
  }, [tempFilterValues, setStatus, setPaymentMethod, setWarehouse, setDateRange, setPage]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    // Reset URL filters
    setSearch(null);
    setStatus(null);
    setPaymentMethod(null);
    setWarehouse(null);
    setDateRange(null);
    setPage(1);
    
    // Reset temp filters
    setTempFilterValues({
      status: "",
      paymentMethod: "",
      warehouse: "",
      dateRange: "",
    });
  }, [setSearch, setStatus, setPaymentMethod, setWarehouse, setDateRange, setPage]);
  
  // Check if there are active filters
  const hasActiveFilters = Boolean(search || status || paymentMethod || warehouse || dateRange);
  
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
  const filter: TransactionFilterValues = {
    search,
    status,
    paymentMethod,
    warehouse,
    dateRange,
  };
  
  return {
    search,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    warehouse,
    setWarehouse,
    dateRange,
    setDateRange,
    showFilters: showFiltersState,
    setShowFilters,
    tempFilters: tempFilterValues,
    updateTempFilter,
    applyFilters,
    resetFilters,
    page,
    setPage,
    limit,
    setLimit,
    handlePageChange,
    handleLimitChange,
    sorting,
    handleSortChange,
    handleSearchChange,
    filter,
    hasActiveFilters,
  };
}
