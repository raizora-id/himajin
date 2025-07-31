import React from "react";
import { Link } from "@remix-run/react";
import { Eye, FilePen, Trash } from "lucide-react";
import { 
  ColumnDef,
  SortingState 
} from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { StatusBadge } from "./status-badge";
import { formatCurrency, formatDate } from "~/utils/format";
import { 
  TransactionStatus, 
  PaymentMethod, 
  getPaymentMethodLabel,
  getStatusLabel
} from "~/features/dashboard/models/transaction.model";

// Define the transaction item type based on the model
export interface TransactionItem {
  id: string;
  invoiceNumber: string;
  transactionDate: string;
  customerName: string | null;
  warehouseId: string;
  warehouseName: string;
  grandTotal: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
}

interface TransactionsTableProps {
  transactions: TransactionItem[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onDelete?: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  sorting,
  onSortingChange,
  onDelete
}: TransactionsTableProps) {
  
  // Helper to determine if status is active
  const isStatusActive = (status: TransactionStatus): boolean => {
    return status === "completed";
  };
  
  // Helper to get text based on status
  const getStatusText = (status: TransactionStatus): string => {
    return getStatusLabel(status);
  };
  
  const columns: ColumnDef<TransactionItem>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: ({ row }) => (
        <Link 
          to={`/dashboard/transactions/${row.original.id}`}
          className="text-foreground font-medium hover:underline"
        >
          {row.getValue("invoiceNumber")}
        </Link>
      )
    },
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("transactionDate"))
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const customerName = row.getValue("customerName");
        return customerName || "—";
      }
    },
    {
      accessorKey: "grandTotal",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("grandTotal"))
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TransactionStatus;
        return (
          <StatusBadge 
            isActive={isStatusActive(status)}
            activeText={getStatusText(status)}
            inactiveText={getStatusText(status)}
          />
        );
      }
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => {
        const paymentMethod = row.getValue("paymentMethod") as PaymentMethod;
        return getPaymentMethodLabel(paymentMethod);
      }
    },
    {
      accessorKey: "warehouseName",
      header: "Warehouse"
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const transaction = row.original;
        
        return (
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
                  onDelete?.(transaction.id);
                }
              }}
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={transactions}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  );
}
