import React, { useState } from "react";
import { Filter, Search, Calendar } from "lucide-react";
import { TransactionStatus, PaymentMethod, getPaymentMethodLabel, getStatusLabel } from "../models/transaction.model";

export interface FilterOption {
  id?: string;
  name: string;
}

interface FilterValues {
  search: string | null;
  status: string | null;
  paymentMethod: string | null;
  warehouse: string | null;
  dateRange: string | null;
}

interface TempFilterValues {
  status: string;
  paymentMethod: string;
  warehouse: string;
  dateRange: string;
}

export interface TransactionsFilterSectionProps {
  searchValue: string | null;
  onSearchChange: (value: string) => void;
  filterValues: FilterValues;
  tempFilterValues: TempFilterValues;
  onTempFilterChange: (key: string, value: any) => void;
  warehouses: FilterOption[];
  hasActiveFilters: boolean;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClearFilter: (key: string) => void;
}

export function TransactionsFilterSection({
  searchValue,
  onSearchChange,
  filterValues,
  tempFilterValues,
  onTempFilterChange,
  warehouses,
  hasActiveFilters,
  onApplyFilters,
  onResetFilters,
  onClearFilter
}: TransactionsFilterSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

  // Get all status options
  const statusOptions = [
    { id: TransactionStatus.COMPLETED, name: getStatusLabel(TransactionStatus.COMPLETED) },
    { id: TransactionStatus.PENDING, name: getStatusLabel(TransactionStatus.PENDING) },
    { id: TransactionStatus.CANCELLED, name: getStatusLabel(TransactionStatus.CANCELLED) },
    { id: TransactionStatus.REFUNDED, name: getStatusLabel(TransactionStatus.REFUNDED) },
  ];

  // Get all payment method options
  const paymentMethodOptions = [
    { id: PaymentMethod.CASH, name: getPaymentMethodLabel(PaymentMethod.CASH) },
    { id: PaymentMethod.CREDIT_CARD, name: getPaymentMethodLabel(PaymentMethod.CREDIT_CARD) },
    { id: PaymentMethod.DEBIT_CARD, name: getPaymentMethodLabel(PaymentMethod.DEBIT_CARD) },
    { id: PaymentMethod.BANK_TRANSFER, name: getPaymentMethodLabel(PaymentMethod.BANK_TRANSFER) },
    { id: PaymentMethod.DIGITAL_WALLET, name: getPaymentMethodLabel(PaymentMethod.DIGITAL_WALLET) },
    { id: PaymentMethod.STORE_CREDIT, name: getPaymentMethodLabel(PaymentMethod.STORE_CREDIT) },
  ];

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
                <label className="text-sm font-medium">Status</label>
                <select
                  value={tempFilterValues.status}
                  onChange={(e) => onTempFilterChange("status", e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <select
                  value={tempFilterValues.paymentMethod}
                  onChange={(e) => onTempFilterChange("paymentMethod", e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Payment Methods</option>
                  {paymentMethodOptions.map((method) => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Warehouse</label>
                <select
                  value={tempFilterValues.warehouse}
                  onChange={(e) => onTempFilterChange("warehouse", e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Warehouses</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id || ""}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex mt-1 items-center gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      placeholder="From"
                      className="pl-8 pr-2 py-1 rounded-md border border-input bg-background text-sm w-full"
                      onChange={(e) => {
                        const startDate = e.target.value;
                        const endDate = tempFilterValues.dateRange?.split(',')[1] || '';
                        onTempFilterChange("dateRange", startDate ? `${startDate},${endDate}` : '');
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      placeholder="To"
                      className="pl-8 pr-2 py-1 rounded-md border border-input bg-background text-sm w-full"
                      onChange={(e) => {
                        const endDate = e.target.value;
                        const startDate = tempFilterValues.dateRange?.split(',')[0] || '';
                        onTempFilterChange("dateRange", endDate ? `${startDate},${endDate}` : '');
                      }}
                    />
                  </div>
                </div>
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
          placeholder="Search transactions..."
          value={searchValue || ""}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-4 py-2 h-10 w-full rounded-md border border-input bg-background text-sm"
        />
      </div>
      
      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-row items-center gap-2 flex-1 flex-wrap">
          {filterValues.status && (
            <FilterPill 
              label={`Status: ${getStatusLabel(filterValues.status as TransactionStatus)}`}
              onClear={() => onClearFilter("status")} 
            />
          )}
          
          {filterValues.paymentMethod && (
            <FilterPill 
              label={`Payment: ${getPaymentMethodLabel(filterValues.paymentMethod as PaymentMethod)}`}
              onClear={() => onClearFilter("paymentMethod")} 
            />
          )}
          
          {filterValues.warehouse && (
            <FilterPill 
              label={`Warehouse: ${warehouses.find(w => w.id === filterValues.warehouse)?.name || ""}`}
              onClear={() => onClearFilter("warehouse")} 
            />
          )}
          
          {filterValues.dateRange && (
            <FilterPill 
              label="Date Range"
              onClear={() => onClearFilter("dateRange")} 
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
