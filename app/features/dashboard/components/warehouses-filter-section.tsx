import { Filter, Search, X } from "lucide-react";
import { ChangeEvent } from "react";
import { Button } from "~/ui/button/button";
import { Input } from "~/ui/input/input";
import { Badge } from "~/ui/badge/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select/select";
import { WarehouseFilterValues, WarehouseTempFilterValues } from "../hooks/use-warehouses-filters";

export interface FilterOption {
  value: string;
  label: string;
}

export interface WarehousesFilterSectionProps {
  searchValue: string | null;
  onSearchChange: (value: string) => void;
  filterValues: WarehouseFilterValues;
  tempFilterValues: WarehouseTempFilterValues;
  onTempFilterChange: (key: keyof WarehouseTempFilterValues, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClearFilter: (key: keyof WarehouseFilterValues) => void;
  hasActiveFilters: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  cities: FilterOption[];
  provinces: FilterOption[];
}

export function WarehousesFilterSection({
  searchValue,
  onSearchChange,
  filterValues,
  tempFilterValues,
  onTempFilterChange,
  onApplyFilters,
  onResetFilters,
  onClearFilter,
  hasActiveFilters,
  showFilters = false,
  onToggleFilters,
  cities,
  provinces,
}: WarehousesFilterSectionProps) {
  return (
    <div className="border rounded-md">
      {/* Search and Filter Controls */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search warehouses by name, code, address, or city..."
              className="pl-9"
              value={searchValue || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={showFilters ? "bg-muted" : ""}
            onClick={onToggleFilters}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="grid gap-4 pt-2 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={tempFilterValues.status}
                onValueChange={(value: string) => onTempFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">City</label>
              <Select
                value={tempFilterValues.city}
                onValueChange={(value: string) => onTempFilterChange("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Province</label>
              <Select
                value={tempFilterValues.province}
                onValueChange={(value: string) => onTempFilterChange("province", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={onApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filterValues.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filterValues.search}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onClearFilter("search")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </Button>
              </Badge>
            )}
            
            {filterValues.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filterValues.status === "active" ? "Active" : "Inactive"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onClearFilter("status")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove status filter</span>
                </Button>
              </Badge>
            )}
            
            {filterValues.city && (
              <Badge variant="secondary" className="gap-1">
                City: {filterValues.city}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onClearFilter("city")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove city filter</span>
                </Button>
              </Badge>
            )}
            
            {filterValues.province && (
              <Badge variant="secondary" className="gap-1">
                Province: {filterValues.province}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onClearFilter("province")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove province filter</span>
                </Button>
              </Badge>
            )}
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-sm h-7"
                onClick={onResetFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
