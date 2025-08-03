import React from "react";
import { Filter, Search, X } from "lucide-react";
import { Button } from "~/shared/ui/button/button";
import { UserRole } from "../models/user.model";

export interface FilterOption {
  id: string;
  name: string;
}

export interface FilterValues {
  search: string | null;
  role: string | null;
  warehouseId: string | null;
  status: string | null;
}

export interface TempFilterValues {
  role: string;
  warehouseId: string;
  status: string;
}

export interface UsersFilterSectionProps {
  searchValue: string | null;
  onSearchChange: (value: string) => void;
  filterValues: FilterValues;
  tempFilterValues: TempFilterValues;
  onTempFilterChange: (key: keyof TempFilterValues, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClearFilter: (key: string) => void;
  hasActiveFilters: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  warehouses: FilterOption[];
}

export function UsersFilterSection({
  searchValue,
  onSearchChange,
  filterValues,
  tempFilterValues,
  onTempFilterChange,
  onApplyFilters,
  onResetFilters,
  onClearFilter,
  hasActiveFilters,
  showFilters,
  onToggleFilters,
  warehouses
}: UsersFilterSectionProps) {
  const roles = Object.values(UserRole).map(role => ({
    id: role,
    name: role.charAt(0).toUpperCase() + role.slice(1)
  }));
  
  const statusOptions = [
    { id: "active", name: "Active" },
    { id: "inactive", name: "Inactive" }
  ];
  
  // Function to get label for filter values
  const getFilterValueLabel = (key: string, value: string): string => {
    switch (key) {
      case "role":
        return roles.find(r => r.id === value)?.name || value;
      case "warehouseId":
        return warehouses.find(w => w.id === value)?.name || value;
      case "status":
        return statusOptions.find(s => s.id === value)?.name || value;
      default:
        return value;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search and filter toggle */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm"
          />
          {searchValue && (
            <button
              onClick={() => onClearFilter("search")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button
          type="button"
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={onToggleFilters}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary-foreground text-primary rounded-full">
              {Object.values(filterValues).filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>
      
      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterValues).map(([key, value]) => {
            if (!value) return null;
            
            if (key === "search") {
              return (
                <div key={key} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md">
                  <span className="font-medium">Search:</span>
                  <span>{value}</span>
                  <button
                    onClick={() => onClearFilter(key)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            }
            
            return (
              <div key={key} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md">
                <span className="font-medium capitalize">{key === "warehouseId" ? "Warehouse" : key}:</span>
                <span>{getFilterValueLabel(key, value)}</span>
                <button
                  onClick={() => onClearFilter(key)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
      
      {/* Filter dropdown panel */}
      {showFilters && (
        <div className="p-4 border rounded-md shadow-sm bg-background">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={tempFilterValues.role}
                onChange={(e) => onTempFilterChange("role", e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Warehouse filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Warehouse</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={tempFilterValues.warehouseId}
                onChange={(e) => onTempFilterChange("warehouseId", e.target.value)}
              >
                <option value="">All Warehouses</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={tempFilterValues.status}
                onChange={(e) => onTempFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
            >
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
