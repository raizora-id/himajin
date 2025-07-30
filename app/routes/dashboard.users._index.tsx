import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { Edit, Eye, MoreHorizontal, Plus, Trash2, Users } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { UserRole, getRoleLabel, getWarehousesFromUsers, mockUsers } from "~/features/dashboard/models/user.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Users Management - POS Dashboard" },
    { name: "description", content: "Manage system users and roles" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Pagination params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Filter params
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const warehouseId = searchParams.get("warehouseId") || "";
  const status = searchParams.get("status") || "";

  // Sort params
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // Filter users based on search/filter criteria
  let filteredUsers = [...mockUsers];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  if (warehouseId) {
    filteredUsers = filteredUsers.filter(user => user.warehouseId === warehouseId);
  }

  if (status) {
    const isActive = status === "active";
    filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
  }

  // Sort users
  filteredUsers.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
        break;
      case "role":
        comparison = a.role.localeCompare(b.role);
        break;
      case "warehouse":
        comparison = (a.warehouseName || "").localeCompare(b.warehouseName || "");
        break;
      case "lastLogin":
        const dateA = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const dateB = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        comparison = dateA - dateB;
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  // Calculate pagination
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(offset, offset + limit);

  // Get roles for filter options
  const roles = Object.values(UserRole);
  
  // Get warehouses for filter options
  const warehouses = getWarehousesFromUsers();

  return json({
    users: paginatedUsers,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    filter: {
      roles,
      warehouses,
    },
  });
};

// Function to get role badge styling based on role
function getRoleBadgeStyles(role: UserRole): string {
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
}

export default function UsersIndex() {
  const { users, pagination, filter } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Current filter values from URL
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentLimit = parseInt(searchParams.get("limit") || "10");
  const currentSearch = searchParams.get("search") || "";
  const currentRole = searchParams.get("role") || "";
  const currentWarehouseId = searchParams.get("warehouseId") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSortBy = searchParams.get("sortBy") || "name";
  const currentSortOrder = searchParams.get("sortOrder") || "asc";
  
  // Update search params while preserving existing ones
  const updateSearchParams = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    // Reset to page 1 when changing filters
    if (!("page" in params)) {
      newSearchParams.set("page", "1");
    }
    
    setSearchParams(newSearchParams);
  };
  
  // Handle sort change
  const handleSort = (field: string) => {
    if (currentSortBy === field) {
      // Toggle sort order if already sorting by this field
      updateSearchParams({
        sortBy: field,
        sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to ascending order for new sort field
      updateSearchParams({
        sortBy: field,
        sortOrder: "asc",
      });
    }
  };
  
  // Generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const rangeSize = Math.min(5, pagination.totalPages);
    
    // Calculate start and end of pagination range
    let start = Math.max(currentPage - Math.floor(rangeSize / 2), 1);
    const end = Math.min(start + rangeSize - 1, pagination.totalPages);
    
    // Adjust start if we're near the end
    if (pagination.totalPages - start < rangeSize) {
      start = Math.max(pagination.totalPages - rangeSize + 1, 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Link
          to="/dashboard/users/add"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors md:self-end"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-1">
            <label htmlFor="search" className="text-sm font-medium">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={currentSearch}
              onChange={e => updateSearchParams({ search: e.target.value || null })}
            />
          </div>
          
          {/* Role filter */}
          <div className="space-y-1">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={currentRole}
              onChange={e => updateSearchParams({ role: e.target.value || null })}
            >
              <option value="">All Roles</option>
              {filter.roles.map(role => (
                <option key={role} value={role}>
                  {getRoleLabel(role)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Warehouse filter */}
          <div className="space-y-1">
            <label htmlFor="warehouse" className="text-sm font-medium">
              Warehouse
            </label>
            <select
              id="warehouse"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={currentWarehouseId}
              onChange={e => updateSearchParams({ warehouseId: e.target.value || null })}
            >
              <option value="">All Warehouses</option>
              {filter.warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status filter */}
          <div className="space-y-1">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={currentStatus}
              onChange={e => updateSearchParams({ status: e.target.value || null })}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Users list */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-14">
                  <span className="sr-only">Avatar</span>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {currentSortBy === "name" && (
                      <span className="text-xs">{currentSortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {currentSortBy === "email" && (
                      <span className="text-xs">{currentSortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {currentSortBy === "role" && (
                      <span className="text-xs">{currentSortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("warehouse")}
                >
                  <div className="flex items-center gap-1">
                    Warehouse
                    {currentSortBy === "warehouse" && (
                      <span className="text-xs">{currentSortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("lastLogin")}
                >
                  <div className="flex items-center gap-1">
                    Last Login
                    {currentSortBy === "lastLogin" && (
                      <span className="text-xs">{currentSortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="h-4 w-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.name}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs ${getRoleBadgeStyles(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.warehouseName || <span className="text-muted-foreground italic">Global</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.lastLoginAt ? (
                      formatDate(user.lastLoginAt)
                    ) : (
                      <span className="text-muted-foreground italic">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/dashboard/users/${user.id}`}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link 
                        to={`/dashboard/users/${user.id}/edit`}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-muted transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
                        title="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> users
            </p>
            
            <div className="flex items-center gap-2">
              <select
                value={currentLimit}
                onChange={e => updateSearchParams({ limit: e.target.value, page: "1" })}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              
              <nav className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateSearchParams({ page: "1" })}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-sm border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                  title="First page"
                >
                  <span className="sr-only">First page</span>
                  <span>«</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateSearchParams({ page: String(currentPage - 1) })}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-sm border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                  title="Previous page"
                >
                  <span className="sr-only">Previous page</span>
                  <span>‹</span>
                </button>
                
                {getPaginationRange().map(pageNumber => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => updateSearchParams({ page: String(pageNumber) })}
                    className={`h-8 w-8 rounded-md flex items-center justify-center text-sm ${
                      pageNumber === currentPage
                        ? "bg-primary text-primary-foreground font-medium"
                        : "border border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={() => updateSearchParams({ page: String(currentPage + 1) })}
                  disabled={currentPage === pagination.totalPages}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-sm border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                  title="Next page"
                >
                  <span className="sr-only">Next page</span>
                  <span>›</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateSearchParams({ page: String(pagination.totalPages) })}
                  disabled={currentPage === pagination.totalPages}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-sm border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                  title="Last page"
                >
                  <span className="sr-only">Last page</span>
                  <span>»</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
