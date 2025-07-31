import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  onSortingChange?: (sorting: SortingState) => void;
  emptyState?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting,
  setSorting,
  onSortingChange,
  emptyState
}: DataTableProps<TData, TValue>) {
  const [localSorting, setLocalSorting] = React.useState<SortingState>([]);
  
  // Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting || localSorting,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' 
        ? updater(sorting || localSorting) 
        : updater;
        
      if (setSorting) {
        setSorting(newSorting);
      } else {
        setLocalSorting(newSorting);
      }
      
      if (onSortingChange) {
        onSortingChange(newSorting);
      }
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-medium"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex items-center cursor-pointer hover:bg-muted transition-colors"
                            : "flex items-center"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        
                        {{
                          asc: <div className="ml-1 h-4 w-4">🔼</div>,
                          desc: <div className="ml-1 h-4 w-4">🔽</div>,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b bg-card last:border-0 hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-6">
                  {emptyState || (
                    <div className="text-center text-muted-foreground">
                      No results found
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
