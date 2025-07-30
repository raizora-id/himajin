import React from "react";
import { Link } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";
import { 
  type ColumnDef, 
  type SortingState 
} from "@tanstack/react-table";
import { 
  type Box,
  calculateBoxCapacity,
  getBoxCapacityColorClass,
  formatBoxLocation,
} from "~/features/dashboard/models/box.model";
import { DataTable, StatusBadge, CapacityIndicator, WarehouseLink } from "./";

export interface BoxesTableProps {
  boxes: Box[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onSortingChange: (sorting: SortingState) => void;
}

// Define columns for DataTable
const getTableColumns = (): ColumnDef<Box>[] => [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name") || "-"
  },
  {
    accessorKey: "warehouseName",
    header: "Warehouse",
    cell: ({ row }) => {
      const data = row.original;
      return <WarehouseLink id={data.warehouseId} name={data.warehouseName} />;
    }
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => formatBoxLocation(row.original),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => `${row.original.usedCapacity}/${row.original.capacity}`
  },
  {
    accessorKey: "usage",
    header: "Usage",
    cell: ({ row }) => {
      const box = row.original;
      const percentage = calculateBoxCapacity(box);
      const colorClass = getBoxCapacityColorClass(percentage);
      return <CapacityIndicator percentage={percentage} showPercentage width="60px" colorClass={colorClass} />;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Link 
          to={`/dashboard/boxes/${row.original.id}`}
          className="h-8 w-8 rounded-md border border-input bg-background p-0 hover:bg-muted flex items-center justify-center"
        >
          <span className="sr-only">View</span>
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

export const BoxesTable: React.FC<BoxesTableProps> = ({ 
  boxes,
  sorting,
  setSorting,
  onSortingChange,
}) => {
  // Get table columns
  const tableColumns = React.useMemo(() => getTableColumns(), []);
  
  return (
    <DataTable
      columns={tableColumns}
      data={boxes}
      sorting={sorting}
      setSorting={setSorting}
      onSortingChange={onSortingChange}
    />
  );
};
