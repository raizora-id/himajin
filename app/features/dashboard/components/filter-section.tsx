import React from "react";
import { Search, X } from "lucide-react";
import { Form, useSearchParams } from "@remix-run/react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  warehouses: FilterOption[];
  sections: string[];
  rows: string[];
  columns: string[];
  levels: number[];
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterSection({
  searchValue,
  onSearchChange,
  warehouses,
  sections,
  rows,
  columns,
  levels,
  onFilterChange,
  onClearFilters
}: FilterSectionProps) {
  const [searchParams] = useSearchParams();
  
  const currentWarehouse = searchParams.get("warehouse") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSection = searchParams.get("section") || "";
  const currentRow = searchParams.get("row") || "";
  const currentColumn = searchParams.get("column") || "";
  const currentLevel = searchParams.get("level") || "";
  
  const hasActiveFilters = currentWarehouse || currentStatus || currentSection || 
                          currentRow || currentColumn || currentLevel;

  return (
    <div className="bg-card border border-border rounded-md p-4 mb-6">
      <div className="mb-4">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              className="pl-9 pr-4 py-2 rounded-md bg-input-background border border-border w-full"
              placeholder="Search boxes by code, name or warehouse..."
              value={searchValue}
              onChange={onSearchChange}
            />
          </div>
          
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded-md border border-border bg-card text-sm font-medium disabled:opacity-50"
            disabled={!hasActiveFilters}
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Warehouse filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Warehouse</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentWarehouse}
            onChange={(e) => onFilterChange("warehouse", e.target.value)}
          >
            <option value="">All warehouses</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.value} value={warehouse.value}>
                {warehouse.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentStatus}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        {/* Section filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Section</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentSection}
            onChange={(e) => onFilterChange("section", e.target.value)}
          >
            <option value="">All sections</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        
        {/* Row filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Row</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentRow}
            onChange={(e) => onFilterChange("row", e.target.value)}
          >
            <option value="">All rows</option>
            {rows.map(row => (
              <option key={row} value={row}>{row}</option>
            ))}
          </select>
        </div>
        
        {/* Column filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Column</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentColumn}
            onChange={(e) => onFilterChange("column", e.target.value)}
          >
            <option value="">All columns</option>
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </select>
        </div>
        
        {/* Level filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Level</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentLevel}
            onChange={(e) => onFilterChange("level", e.target.value)}
          >
            <option value="">All levels</option>
            {levels.map(level => (
              <option key={level} value={level.toString()}>{level}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
