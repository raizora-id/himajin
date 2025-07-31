import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus, Users } from "lucide-react";
import { formatDate } from "~/utils/format";
import { UserRole, getRoleLabel, getWarehousesFromUsers, mockUsers } from "~/features/dashboard/models/user.model";
import { UsersTable, UserItem } from "~/features/dashboard/components/users-table";
import { UsersFilterSection } from "~/features/dashboard/components/users-filter-section";
import { useUsersFilters } from "~/features/dashboard/hooks/use-users-filters";
import { Pagination } from "~/features/dashboard/components/pagination";

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

export default function UsersIndex() {
  const { users, pagination, filter } = useLoaderData<typeof loader>();
  
  // Use our custom hook for filtering, sorting, and pagination
  const {
    search,
    role,
    warehouseId,
    status,
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
    filter: filterValues,
    hasActiveFilters,
  } = useUsersFilters();
  
  // Toggle filter visibility
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle filter clearing
  const handleClearFilter = (key: string) => {
    switch (key) {
      case "search":
        handleSearchChange("");
        break;
      case "role":
        updateTempFilter("role", "");
        applyFilters();
        break;
      case "warehouseId":
        updateTempFilter("warehouseId", "");
        applyFilters();
        break;
      case "status":
        updateTempFilter("status", "");
        applyFilters();
        break;
    }
  };
  
  // Convert warehouse data to the format expected by the filter component
  const warehouseOptions = filter.warehouses.map(warehouse => ({
    id: warehouse.id,
    name: warehouse.name,
  }));
  
  // Handle user deletion
  const handleDeleteUser = (id: string) => {
    // In a real app, this would make an API call
    if (confirm("Are you sure you want to delete this user?")) {
      console.log(`Delete user with ID: ${id}`);
      // After deletion, you'd typically refresh data
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        </div>
        
        <Link 
          to="/dashboard/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New User
        </Link>
      </div>
      
      {/* Content area */}
      <div className="p-6 bg-white rounded-lg border shadow-sm">
        {/* Filter section */}
        <UsersFilterSection
          searchValue={search}
          onSearchChange={handleSearchChange}
          filterValues={filterValues}
          tempFilterValues={tempFilters}
          onTempFilterChange={updateTempFilter}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
          onClearFilter={handleClearFilter}
          hasActiveFilters={hasActiveFilters}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          warehouses={warehouseOptions}
        />
        
        {/* Users table */}
        {users.length > 0 ? (
          <div className="mt-6">
            <UsersTable 
              users={users}
              sorting={sorting}
              onSortingChange={handleSortChange}
              onDelete={handleDeleteUser}
            />
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No users found. Adjust your filters or add a new user.</p>
          </div>
        )}
        
        {/* Pagination */}
        {users.length > 0 && (
          <div className="mt-4">
            <Pagination
              page={page}
              limit={limit}
              total={pagination.total}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
