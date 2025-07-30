import React from "react";
import { Link } from "@remix-run/react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { 
  ColumnDef,
  SortingState 
} from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { StatusBadge } from "./status-badge";
import { formatDate } from "~/utils/format";
import { 
  UserRole, 
  getRoleLabel
} from "~/features/dashboard/models/user.model";

// Define the user item type for the table
export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  warehouseId?: string;
  warehouseName?: string;
  isActive: boolean;
  lastLoginAt?: string;
  avatar?: string;
}

export interface UsersTableProps {
  users: UserItem[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onDelete?: (id: string) => void;
}

export function UsersTable({
  users,
  sorting,
  onSortingChange,
  onDelete
}: UsersTableProps) {
  
  // Helper to get role badge styles based on role
  const getRoleBadgeStyles = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-800";
      case UserRole.MANAGER:
        return "bg-blue-100 text-blue-800";
      case UserRole.CASHIER:
        return "bg-green-100 text-green-800";
      case UserRole.INVENTORY:
        return "bg-amber-100 text-amber-800";
      case UserRole.STAFF:
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<UserItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link 
          to={`/dashboard/users/${row.original.id}`}
          className="text-foreground font-medium hover:underline flex items-center gap-2"
        >
          {row.original.avatar && (
            <img 
              src={row.original.avatar} 
              alt={row.getValue("name")} 
              className="h-8 w-8 rounded-full"
            />
          )}
          {row.getValue("name")}
        </Link>
      )
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        const badgeStyle = getRoleBadgeStyles(role);
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${badgeStyle}`}>
            {getRoleLabel(role)}
          </span>
        );
      }
    },
    {
      accessorKey: "warehouseName",
      header: "Warehouse",
      cell: ({ row }) => {
        const warehouseName = row.getValue("warehouseName");
        return warehouseName || "—";
      }
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        
        return (
          <StatusBadge 
            isActive={isActive}
            activeText="Active"
            inactiveText="Inactive"
          />
        );
      }
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLoginAt") as string | undefined;
        return lastLogin ? formatDate(lastLogin) : "Never";
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const user = row.original;
        
        return (
          <div className="flex justify-end gap-2">
            <Link
              to={`/dashboard/users/${user.id}`}
              className="text-muted-foreground hover:text-foreground"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to={`/dashboard/users/${user.id}/edit`}
              className="text-muted-foreground hover:text-foreground"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              className="text-muted-foreground hover:text-destructive"
              title="Delete"
              onClick={(e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this user?")) {
                  onDelete?.(user.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  );
}
