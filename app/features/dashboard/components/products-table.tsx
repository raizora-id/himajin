import React from "react";
import { Link } from "@remix-run/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { 
  type ColumnDef, 
  type SortingState 
} from "@tanstack/react-table";
import { 
  type ProductListItem,
} from "~/features/dashboard/models/product.model";
import { DataTable, StatusBadge, WarehouseLink } from "./";
import { formatCurrency } from "~/shared/lib/utils";

export interface ProductsTableProps {
  products: ProductListItem[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onSortingChange: (sorting: SortingState) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Define columns for DataTable
const getTableColumns = (
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<ProductListItem>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.original.price)
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
    cell: ({ row }) => {
      const stockQty = row.original.stockQuantity;
      return (
        <span className={`inline-block rounded-full px-2 ${
          stockQty > 20 
            ? "bg-green-100 text-green-800" 
            : stockQty > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        }`}>
          {stockQty}
        </span>
      );
    }
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "warehouseName",
    header: "Warehouse",
    cell: ({ row }) => {
      const data = row.original;
      return data.warehouseName ? (
        <WarehouseLink id={data.warehouseId} name={data.warehouseName} />
      ) : "-";
    }
  },
  {
    accessorKey: "boxName",
    header: "Box",
    cell: ({ row }) => row.original.boxName || "-"
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onView(row.original.id)}
          className="h-8 w-8 rounded-md border border-input bg-background p-0 hover:bg-muted flex items-center justify-center"
        >
          <span className="sr-only">View</span>
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(row.original.id)}
          className="h-8 w-8 rounded-md border border-input bg-background p-0 hover:bg-muted flex items-center justify-center"
        >
          <span className="sr-only">Edit</span>
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(row.original.id)}
          className="h-8 w-8 rounded-md border border-input bg-background p-0 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
        >
          <span className="sr-only">Delete</span>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

export const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products,
  sorting,
  setSorting,
  onSortingChange,
  onView,
  onEdit,
  onDelete
}) => {
  // Get table columns
  const tableColumns = React.useMemo(() => 
    getTableColumns(onView, onEdit, onDelete), 
    [onView, onEdit, onDelete]
  );
  
  return (
    <DataTable
      columns={tableColumns}
      data={products}
      sorting={sorting}
      setSorting={setSorting}
      onSortingChange={onSortingChange}
    />
  );
};
