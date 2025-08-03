import { 
  useQueryState
} from "~/shared/lib/nuqs-config";
import {
  parseAsString, 
  parseAsInteger,
  parseAsBoolean,
  parseAsStringEnum 
} from "nuqs";
import { useState, useCallback } from "react";
import { type SortingState } from "@tanstack/react-table";
import type { ProductFilter } from "~/features/dashboard/models/product.model";

export function useProductFilters() {
  // Filter query params
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault(""));
  const [warehouseId, setWarehouseId] = useQueryState("warehouseId", parseAsString.withDefault(""));
  const [boxId, setBoxId] = useQueryState("boxId", parseAsString.withDefault(""));
  const [inStock, setInStock] = useQueryState("inStock", parseAsBoolean.withDefault(false));
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString.withDefault("name"));
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", parseAsStringEnum(["asc", "desc"]).withDefault("asc"));
  
  // React-table sorting state
  const [sorting, setSorting] = useState<SortingState>([{
    id: sortBy,
    desc: sortOrder === "desc"
  }]);

  // Temporary filters for the filter dropdown
  const [tempFilters, setTempFilters] = useState({
    category: category || "",
    warehouseId: warehouseId || "",
    inStock: inStock || false,
    boxId: boxId || ""
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearch(value || null);
    // Reset to page 1 when search changes
    setPage(1);
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  /**
   * Handle sort change
   */
  const handleSortChange = useCallback((newSorting: SortingState) => {
    if (newSorting.length > 0) {
      const field = newSorting[0].id;
      const newOrder = newSorting[0].desc ? "desc" : "asc";
      
      setSortBy(field);
      setSortOrder(newOrder);
      setPage(1); // Reset to first page when sorting changes
      
      // Update the local sorting state
      setSorting(newSorting);
    }
  }, [setSortBy, setSortOrder, setPage]);
  
  // Apply filters from the temporary state
  const applyFilters = () => {
    if (tempFilters.category) {
      setCategory(tempFilters.category);
    } else {
      setCategory(null);
    }
    
    if (tempFilters.warehouseId) {
      setWarehouseId(tempFilters.warehouseId);
    } else {
      setWarehouseId(null);
    }
    
    if (tempFilters.inStock) {
      setInStock(true);
    } else {
      setInStock(null);
    }
    
    if (tempFilters.boxId) {
      setBoxId(tempFilters.boxId);
    } else {
      setBoxId(null);
    }
    
    // Reset to page 1
    setPage(1);
    
    setShowFilters(false);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setCategory(null);
    setWarehouseId(null);
    setInStock(null);
    setBoxId(null);
    setMinPrice(null);
    setMaxPrice(null);
    
    // Keep search and sorting
    
    setTempFilters({
      category: "",
      warehouseId: "",
      inStock: false,
      boxId: ""
    });
    
    setShowFilters(false);
    setPage(1);
  };
  
  // Update temporary filters
  const updateTempFilter = (field: string, value: string | boolean) => {
    setTempFilters({
      ...tempFilters,
      [field]: value
    });
  };
  
  // Check if any filters are active
  const hasActiveFilters = Boolean(category || warehouseId || inStock || boxId);
  
  // Get current filter state as an object
  const getCurrentFilters = (): ProductFilter => ({
    search: search || "",
    category: category || undefined,
    warehouseId: warehouseId || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    inStock: inStock !== null ? inStock : undefined,
    boxId: boxId || undefined,
    sortBy: sortBy || "name",
    sortOrder: sortOrder || "asc",
    page: page || 1,
    limit: limit || 10
  });
  
  return {
    // State
    search,
    setSearch,
    category,
    setCategory,
    warehouseId,
    setWarehouseId,
    boxId,
    setBoxId,
    inStock,
    setInStock,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    showFilters,
    setShowFilters,
    tempFilters,
    sorting,
    setSorting,
    
    // Handlers
    handleSearchChange,
    handlePageChange,
    handleSortChange,
    updateTempFilter,
    applyFilters,
    resetFilters,
    
    // Utility
    hasActiveFilters,
    getCurrentFilters
  };
}
