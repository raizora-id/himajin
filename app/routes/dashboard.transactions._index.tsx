import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { FilePen, Eye, Trash, ChevronLeft, ChevronRight, Search, Calendar, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { PaymentMethod, TransactionStatus, getPaymentMethodLabel, getStatusLabel, getWarehousesFromTransactions, mockTransactions } from "~/features/dashboard/models/transaction.model";
import { formatCurrency, formatDate } from "~/utils/format";

export const meta: MetaFunction = () => {
  return [
    { title: "Transactions - POS System" },
    { name: "description", content: "Manage and track transactions" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Parse query parameters for filtering, sorting, and pagination
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  // Search params
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const warehouse = searchParams.get("warehouse") || "";
  const dateRange = searchParams.get("dateRange") || "";
  
  // Sorting
  const sortBy = searchParams.get("sortBy") || "transactionDate";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  
  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  
  // Filter transactions
  let filteredTransactions = [...mockTransactions];
  
  // Apply search filter (search by invoice number, customer name, or ID)
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTransactions = filteredTransactions.filter(transaction => 
      transaction.invoiceNumber.toLowerCase().includes(searchLower) ||
      (transaction.customerName && transaction.customerName.toLowerCase().includes(searchLower))
    );
  }
  
  // Filter by status
  if (status) {
    filteredTransactions = filteredTransactions.filter(transaction => 
      transaction.status === status
    );
  }
  
  // Filter by payment method
  if (paymentMethod) {
    filteredTransactions = filteredTransactions.filter(transaction => 
      transaction.paymentMethod === paymentMethod
    );
  }
  
  // Filter by warehouse
  if (warehouse) {
    filteredTransactions = filteredTransactions.filter(transaction => 
      transaction.warehouseId === warehouse
    );
  }
  
  // Filter by date range
  if (dateRange) {
    const [startDate, endDate] = dateRange.split(',').map(date => new Date(date));
    
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);
      
      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
  }
  
  // Apply sorting
  filteredTransactions.sort((a, b) => {
    let aValue, bValue;
    
    // Determine which field to sort by
    switch (sortBy) {
      case "invoiceNumber":
        aValue = a.invoiceNumber;
        bValue = b.invoiceNumber;
        break;
      case "customerName":
        aValue = a.customerName || "";
        bValue = b.customerName || "";
        break;
      case "total":
        aValue = a.grandTotal;
        bValue = b.grandTotal;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "paymentMethod":
        aValue = a.paymentMethod;
        bValue = b.paymentMethod;
        break;
      case "warehouse":
        aValue = a.warehouseName;
        bValue = b.warehouseName;
        break;
      case "transactionDate":
      default:
        aValue = new Date(a.transactionDate).getTime();
        bValue = new Date(b.transactionDate).getTime();
    }
    
    // Determine sort direction
    const sortMultiplier = sortOrder === "asc" ? 1 : -1;
    
    // Compare values
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * sortMultiplier;
    } else {
      return (aValue > bValue ? 1 : -1) * sortMultiplier;
    }
  });
  
  // Calculate pagination
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const offset = (currentPage - 1) * pageSize;
  
  // Paginate transactions
  const paginatedTransactions = filteredTransactions.slice(offset, offset + pageSize);
  
  // Get all warehouses for filter dropdown
  const warehouses = getWarehousesFromTransactions();
  
  // Currency formatting is now imported from utils/format.ts
  
  return json({
    transactions: paginatedTransactions,
    pagination: {
      totalItems,
      totalPages,
      currentPage,
      pageSize,
    },
    filters: {
      statuses: Object.values(TransactionStatus),
      paymentMethods: Object.values(PaymentMethod),
      warehouses,
    },
  });
};

// formatDate is now imported from utils/format.ts

// Helper to get status badge styles
function getStatusBadgeStyles(status: TransactionStatus): string {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case TransactionStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case TransactionStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case TransactionStatus.REFUNDED:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export default function TransactionsList() {
  const { transactions, pagination, filters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Current filter values
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentPaymentMethod = searchParams.get("paymentMethod") || "";
  const currentWarehouse = searchParams.get("warehouse") || "";
  const currentDateRange = searchParams.get("dateRange") || "";
  const currentSortBy = searchParams.get("sortBy") || "transactionDate";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  
  // Helper to update search params
  const updateSearchParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update provided parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 if filters changed
    if (!params.hasOwnProperty("page")) {
      newParams.set("page", "1");
    }
    
    setSearchParams(newParams);
  };
  
  // Handle sort column click
  const handleSort = (column: string) => {
    if (currentSortBy === column) {
      // Toggle sort order if already sorting by this column
      updateSearchParams({
        sortBy: column,
        sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to descending for new sort column
      updateSearchParams({
        sortBy: column,
        sortOrder: "desc",
      });
    }
  };
  
  // Helper to render sort indicator
  const renderSortIndicator = (column: string) => {
    if (currentSortBy !== column) return null;
    
    return currentSortOrder === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1" />
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Link 
          to="/dashboard/transactions/add" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md inline-flex items-center gap-2"
        >
          New Transaction
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md"
              value={currentSearch}
              onChange={(e) => updateSearchParams({ search: e.target.value || null })}
            />
          </div>
          
          {/* Date Range Filter */}
          <div className="relative">
            <button
              onClick={() => setDatePickerOpen(!datePickerOpen)}
              className="inline-flex items-center gap-2 bg-background border border-input rounded-md px-3 py-2 text-sm"
            >
              <Calendar className="h-4 w-4" />
              {currentDateRange ? 
                `${new Date(currentDateRange.split(',')[0]).toLocaleDateString('id-ID')} - ${new Date(currentDateRange.split(',')[1]).toLocaleDateString('id-ID')}` : 
                "Date Range"}
            </button>
            {datePickerOpen && (
              <div className="absolute z-10 mt-2 bg-card border border-border rounded-md p-4 shadow-md">
                <p className="text-sm mb-2">Date Range (Not functional in demo)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    className="bg-background border border-input rounded-md px-2 py-1 text-sm"
                    placeholder="Start Date"
                  />
                  <input 
                    type="date" 
                    className="bg-background border border-input rounded-md px-2 py-1 text-sm"
                    placeholder="End Date"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      updateSearchParams({ dateRange: null });
                      setDatePickerOpen(false);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setDatePickerOpen(false)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded-md text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={currentStatus}
              onChange={(e) => updateSearchParams({ status: e.target.value || null })}
              className="bg-background border border-input rounded-md px-3 py-2 pr-8 text-sm"
            >
              <option value="">All Statuses</option>
              {filters.statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Payment Method Filter */}
          <div>
            <select
              value={currentPaymentMethod}
              onChange={(e) => updateSearchParams({ paymentMethod: e.target.value || null })}
              className="bg-background border border-input rounded-md px-3 py-2 pr-8 text-sm"
            >
              <option value="">All Payment Methods</option>
              {filters.paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {getPaymentMethodLabel(method)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Warehouse Filter */}
          <div>
            <select
              value={currentWarehouse}
              onChange={(e) => updateSearchParams({ warehouse: e.target.value || null })}
              className="bg-background border border-input rounded-md px-3 py-2 pr-8 text-sm"
            >
              <option value="">All Warehouses</option>
              {filters.warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Reset Filters */}
          {(currentSearch || currentStatus || currentPaymentMethod || currentWarehouse || currentDateRange) && (
            <button
              onClick={() => {
                const newParams = new URLSearchParams();
                newParams.set("page", "1");
                newParams.set("sortBy", currentSortBy);
                newParams.set("sortOrder", currentSortOrder);
                setSearchParams(newParams);
              }}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
            >
              <Filter className="mr-1 h-4 w-4" /> Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("invoiceNumber")}
                >
                  <div className="flex items-center">
                    Invoice Number {renderSortIndicator("invoiceNumber")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("transactionDate")}
                >
                  <div className="flex items-center">
                    Date {renderSortIndicator("transactionDate")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("customerName")}
                >
                  <div className="flex items-center">
                    Customer {renderSortIndicator("customerName")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Total {renderSortIndicator("total")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status {renderSortIndicator("status")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("paymentMethod")}
                >
                  <div className="flex items-center">
                    Payment {renderSortIndicator("paymentMethod")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("warehouse")}
                >
                  <div className="flex items-center">
                    Warehouse {renderSortIndicator("warehouse")}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/dashboard/transactions/${transaction.id}`}
                        className="text-primary hover:text-primary/90"
                      >
                        {transaction.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.customerName || "Walk-in Customer"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(transaction.grandTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyles(transaction.status)}`}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.warehouseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/dashboard/transactions/${transaction.id}`}
                          className="text-muted-foreground hover:text-foreground"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/dashboard/transactions/${transaction.id}/edit`}
                          className="text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <FilePen className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-muted-foreground hover:text-destructive"
                          title="Delete"
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Are you sure you want to delete this transaction?")) {
                              // In a real app, we would handle deletion here
                              alert("Transaction deletion would happen here in a real app");
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-muted-foreground">
                    No transactions found. Adjust your filters or add a new transaction.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-card border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(pagination.totalItems, 1 + (pagination.currentPage - 1) * pagination.pageSize)}-
            {Math.min(pagination.totalItems, pagination.currentPage * pagination.pageSize)} of {pagination.totalItems} transactions
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={pagination.pageSize}
              onChange={(e) => updateSearchParams({ pageSize: e.target.value, page: "1" })}
              className="bg-background border border-input rounded-md px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => updateSearchParams({ page: String(pagination.currentPage - 1) })}
                className="p-1 rounded-md disabled:text-muted-foreground/50 text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground/50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="text-sm">
                Page {pagination.currentPage} of {pagination.totalPages || 1}
              </span>
              
              <button
                disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
                onClick={() => updateSearchParams({ page: String(pagination.currentPage + 1) })}
                className="p-1 rounded-md disabled:text-muted-foreground/50 text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground/50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
