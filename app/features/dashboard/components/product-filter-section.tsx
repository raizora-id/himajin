import React, { useState } from "react";
import { Filter, Search } from "lucide-react";

export interface FilterOption {
  id?: string;
  name: string;
}

interface FilterValues {
  category: string;
  warehouseId: string;
  boxId: string;
  inStock: boolean;
}

export interface ProductFilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValues: FilterValues;
  tempFilterValues: FilterValues;
  onTempFilterChange: (key: string, value: any) => void;
  categories: string[];
  warehouses: FilterOption[];
  boxes: FilterOption[];
  hasActiveFilters: boolean;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClearFilter: (key: string) => void;
}

export function ProductFilterSection({
  searchValue,
  onSearchChange,
  filterValues,
  tempFilterValues,
  onTempFilterChange,
  categories,
  warehouses,
  boxes,
  hasActiveFilters,
  onApplyFilters,
  onResetFilters,
  onClearFilter
}: ProductFilterSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

  return (
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
              {activeFilterCount}
            </span>
          )}
        </button>
        
        {showFilters && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border shadow-lg rounded-md p-4 z-10">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={tempFilterValues.category}
                  onChange={(e) => onTempFilterChange("category", e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Warehouse</label>
                <select
                  value={tempFilterValues.warehouseId}
                  onChange={(e) => onTempFilterChange("warehouseId", e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Warehouses</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Box</label>
                <select
                  value={tempFilterValues.boxId}
                  onChange={(e) => onTempFilterChange("boxId", e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Boxes</option>
                  {boxes.map((box) => (
                    <option key={box.id} value={box.id}>
                      {box.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={tempFilterValues.inStock}
                  onChange={(e) => onTempFilterChange("inStock", e.target.checked)}
                  className="rounded border-input bg-background"
                />
                <label htmlFor="inStock" className="text-sm font-medium">In Stock Only</label>
              </div>
              
              <div className="flex justify-between space-x-2">
                <button
                  onClick={onResetFilters}
                  className="border border-input bg-background hover:bg-accent flex-1 h-9 px-2 rounded-md text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    onApplyFilters();
                    setShowFilters(false);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 h-9 px-2 rounded-md text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-4 py-2 h-10 w-full rounded-md border border-input bg-background text-sm"
        />
      </div>
      
      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-row items-center gap-2 flex-1 flex-wrap">
          {filterValues.category && (
            <FilterPill 
              label={`Category: ${filterValues.category}`}
              onClear={() => onClearFilter("category")} 
            />
          )}
          
          {filterValues.warehouseId && (
            <FilterPill 
              label={`Warehouse: ${warehouses.find(w => w.id === filterValues.warehouseId)?.name || ""}`}
              onClear={() => onClearFilter("warehouseId")} 
            />
          )}
          
          {filterValues.inStock && (
            <FilterPill 
              label="In Stock"
              onClear={() => onClearFilter("inStock")} 
            />
          )}
          
          {filterValues.boxId && (
            <FilterPill 
              label={`Box: ${boxes.find(b => b.id === filterValues.boxId)?.name || ""}`}
              onClear={() => onClearFilter("boxId")} 
            />
          )}
          
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface FilterPillProps {
  label: string;
  onClear: () => void;
}

function FilterPill({ label, onClear }: FilterPillProps) {
  return (
    <div className="bg-accent rounded-full px-3 py-1 text-xs flex items-center gap-1">
      <span>{label}</span>
      <button
        onClick={onClear}
        className="hover:bg-muted rounded-full w-4 h-4 inline-flex items-center justify-center"
      >
        &times;
      </button>
    </div>
  );
}
