import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { TransactionsTable, TransactionsFilterSection, Pagination } from "~/features/dashboard/components";
import { Button } from "~/ui/button/button";
import { useTransactionFilters } from "~/features/dashboard/hooks/use-transaction-filters";
import { PaymentMethod, TransactionStatus, getWarehousesFromTransactions, mockTransactions } from "~/features/dashboard/models/transaction.model";
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
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Apply pagination
  const startIdx = (page - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIdx, startIdx + pageSize);
  
  // Get warehouses for filter dropdown
  const warehouses = getWarehousesFromTransactions();
  
  return json({
    transactions: paginatedTransactions,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: filteredTransactions.length,
      totalPages: Math.ceil(filteredTransactions.length / pageSize)
    },
    filters: {
      search,
      status,
      paymentMethod,
      warehouse,
      dateRange
    },
    sortBy,
    sortOrder,
    warehouses
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
  const { transactions, pagination, warehouses } = useLoaderData<typeof loader>();

  // Use the custom hook for filter, search, sort and pagination
  const {
    search,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    warehouse,
    setWarehouse,
    dateRange,
    setDateRange,
    showFilters,
    setShowFilters,
    tempFilters,
    updateTempFilter,
    applyFilters,
    resetFilters,
    page,
    limit,
    handlePageChange,
    handleLimitChange,
    sorting,
    handleSortChange,
    handleSearchChange,
    filter,
    hasActiveFilters
  } = useTransactionFilters();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Link
          to="new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add transaction
        </Link>
      </div>

      {/* Filter Section */}
      <TransactionsFilterSection 
        searchValue={search}
        onSearchChange={handleSearchChange}
        filterValues={filter}
        tempFilterValues={tempFilters}
        onTempFilterChange={(key, value) => updateTempFilter(key as keyof typeof tempFilters, value)}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        onClearFilter={(key) => {
          if (key === "status") setStatus(null);
          else if (key === "paymentMethod") setPaymentMethod(null);
          else if (key === "warehouse") setWarehouse(null);
          else if (key === "dateRange") setDateRange(null);
          else if (key === "search") handleSearchChange("");
        }}
        hasActiveFilters={hasActiveFilters}
        warehouses={warehouses.map(w => ({ id: w.id, name: w.name }))}
      />

      {/* Transactions Table */}
      <TransactionsTable 
        transactions={transactions.map(transaction => ({
          id: transaction.id,
          invoiceNumber: transaction.invoiceNumber,
          transactionDate: transaction.transactionDate,
          customerName: transaction.customerName || null,
          warehouseId: transaction.warehouseId,
          warehouseName: warehouses.find(w => w.id === transaction.warehouseId)?.name || 'Unknown',
          grandTotal: transaction.total,
          status: transaction.status as TransactionStatus,
          paymentMethod: transaction.paymentMethod as PaymentMethod
        }))}
        sorting={sorting}
        onSortingChange={handleSortChange}
      />

      {/* Pagination Controls */}
      <div className="mt-6">
        <Pagination
          page={page}
          limit={limit}
          total={pagination.totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}
