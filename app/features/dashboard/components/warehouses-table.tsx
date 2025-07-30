import React from "react";
import { Link } from "@remix-run/react";
import { 
  type ColumnDef, 
  type SortingState,
  type CellContext 
} from "@tanstack/react-table";
import { Building2, MoreHorizontal } from "lucide-react";
import { Warehouse, calculateCapacityPercentage, getCapacityColorClass, formatFullAddress } from "~/features/dashboard/models/warehouse.model";
import { DataTable } from "~/features/dashboard/components/data-table";
import { Badge } from "~/ui/badge/badge";
import { StatusBadge } from "~/features/dashboard/components/status-badge";

export interface WarehousesTableProps {
  warehouses: Warehouse[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onSortingChange: (sorting: SortingState) => void;
}

// Define columns for DataTable
const getTableColumns = (): ColumnDef<Warehouse>[] => [
  {
    accessorKey: "name",
    header: "Name & Code",
    cell: ({ row }: CellContext<Warehouse, unknown>) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <Link 
            to={`/dashboard/warehouses/${row.original.id}`}
            className="font-medium text-foreground hover:underline"
          >
            {row.original.name}
          </Link>
          <div className="text-sm text-muted-foreground">
            {row.original.code}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }: CellContext<Warehouse, unknown>) => (
      <div>
        <div className="font-medium">{row.original.address}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.city}, {row.original.province}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }: CellContext<Warehouse, unknown>) => (
      <div>
        <div className="font-medium">
          {row.original.usedCapacity} / {row.original.capacity}
        </div>
        <div className="h-2 w-24 rounded-full bg-secondary">
          <div
            className={`h-full rounded-full ${getCapacityColorClass(calculateCapacityPercentage(row.original))}`}
            style={{ width: `${calculateCapacityPercentage(row.original)}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }: CellContext<Warehouse, unknown>) => (
      <div>
        <div className="font-medium">{row.original.city}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.province}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "managerId",
    header: "Manager",
    cell: ({ row }: CellContext<Warehouse, unknown>) => {
      return <div>{row.original.managerName || "-"}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: CellContext<Warehouse, unknown>) => {
      return <StatusBadge isActive={row.original.isActive} />;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }: CellContext<Warehouse, unknown>) => (
      <div className="flex justify-end gap-2">
        <Link 
          to={`/dashboard/warehouses/${row.original.id}`}
          className="h-8 w-8 rounded-md border border-input bg-background p-0 hover:bg-muted flex items-center justify-center"
        >
          <span className="sr-only">View</span>
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

export const WarehousesTable: React.FC<WarehousesTableProps> = ({ 
  warehouses,
  sorting,
  setSorting,
  onSortingChange,
}) => {
  // Get table columns
  const tableColumns = React.useMemo(() => getTableColumns(), []);
  
  return (
    <DataTable
      columns={tableColumns}
      data={warehouses}
      sorting={sorting}
      setSorting={setSorting}
      onSortingChange={onSortingChange}
    />
  );
};
