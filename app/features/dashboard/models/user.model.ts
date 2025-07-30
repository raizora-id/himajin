export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  warehouseId?: string;  // For branch/warehouse-specific employees
  warehouseName?: string;
  isActive: boolean;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  CASHIER = "cashier",
  INVENTORY = "inventory",
  STAFF = "staff"
}

// Mock data for development
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    role: UserRole.ADMIN,
    isActive: true,
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff",
    phoneNumber: "+62-812-3456-7890",
    address: "Jl. Raya Jakarta No. 123, Jakarta",
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-06-22T14:15:00Z",
    lastLoginAt: "2023-08-10T09:45:00Z",
  },
  {
    id: "u2",
    name: "Store Manager",
    email: "manager@example.com",
    role: UserRole.MANAGER,
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    isActive: true,
    avatar: "https://ui-avatars.com/api/?name=Store+Manager&background=10B981&color=fff",
    phoneNumber: "+62-812-2233-4455",
    createdAt: "2023-02-01T10:00:00Z",
    updatedAt: "2023-06-15T11:30:00Z",
    lastLoginAt: "2023-08-11T08:20:00Z",
  },
  {
    id: "u3",
    name: "Cashier One",
    email: "cashier1@example.com",
    role: UserRole.CASHIER,
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    isActive: true,
    phoneNumber: "+62-813-5566-7788",
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-05-20T16:45:00Z",
    lastLoginAt: "2023-08-11T10:15:00Z",
  },
  {
    id: "u4",
    name: "Inventory Staff",
    email: "inventory@example.com",
    role: UserRole.INVENTORY,
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    isActive: true,
    avatar: "https://ui-avatars.com/api/?name=Inventory+Staff&background=F59E0B&color=fff",
    phoneNumber: "+62-812-9876-5432",
    createdAt: "2023-02-15T11:20:00Z",
    updatedAt: "2023-07-05T13:40:00Z",
    lastLoginAt: "2023-08-10T16:30:00Z",
  },
  {
    id: "u5",
    name: "Branch Manager",
    email: "branch@example.com",
    role: UserRole.MANAGER,
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    isActive: true,
    avatar: "https://ui-avatars.com/api/?name=Branch+Manager&background=EC4899&color=fff",
    phoneNumber: "+62-817-3344-5566",
    address: "Jl. Raya Bandung No. 45, Bandung",
    createdAt: "2023-01-20T08:00:00Z",
    updatedAt: "2023-06-30T15:10:00Z",
    lastLoginAt: "2023-08-11T09:05:00Z",
  },
  {
    id: "u6",
    name: "Cashier Two",
    email: "cashier2@example.com",
    role: UserRole.CASHIER,
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    isActive: false,  // Inactive user
    phoneNumber: "+62-819-1122-3344",
    createdAt: "2023-04-05T10:15:00Z",
    updatedAt: "2023-07-10T09:20:00Z",
    lastLoginAt: "2023-06-30T14:25:00Z",
  },
  {
    id: "u7",
    name: "General Staff",
    email: "staff@example.com",
    role: UserRole.STAFF,
    isActive: true,
    phoneNumber: "+62-812-2299-8877",
    createdAt: "2023-03-25T13:40:00Z",
    updatedAt: "2023-05-15T11:50:00Z",
    lastLoginAt: "2023-08-10T13:10:00Z",
  },
  {
    id: "u8",
    name: "Surabaya Manager",
    email: "surabaya@example.com",
    role: UserRole.MANAGER,
    warehouseId: "w3",
    warehouseName: "Surabaya Branch",
    isActive: true,
    avatar: "https://ui-avatars.com/api/?name=Surabaya+Manager&background=8B5CF6&color=fff",
    phoneNumber: "+62-812-3311-2233",
    address: "Jl. Raya Surabaya No. 78, Surabaya",
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-07-12T10:45:00Z",
    lastLoginAt: "2023-08-11T08:50:00Z",
  },
  {
    id: "u9",
    name: "Inventory Assistant",
    email: "inventory2@example.com",
    role: UserRole.INVENTORY,
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    isActive: true,
    phoneNumber: "+62-812-4455-6677",
    createdAt: "2023-05-05T14:20:00Z",
    updatedAt: "2023-07-20T16:15:00Z",
    lastLoginAt: "2023-08-10T15:40:00Z",
  },
  {
    id: "u10",
    name: "Inactive Admin",
    email: "inactive@example.com",
    role: UserRole.ADMIN,
    isActive: false,  // Inactive user
    avatar: "https://ui-avatars.com/api/?name=Inactive+Admin&background=EF4444&color=fff",
    phoneNumber: "+62-812-8899-0011",
    createdAt: "2022-12-10T10:00:00Z",
    updatedAt: "2023-03-15T09:30:00Z",
    lastLoginAt: "2023-03-14T16:20:00Z",
  }
];

// Helper to get role label with proper capitalization
export function getRoleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// Helper function to get warehouses from user data
export function getWarehousesFromUsers(): { id: string; name: string }[] {
  return Array.from(
    new Set(
      mockUsers
        .filter(user => user.warehouseId && user.warehouseName)
        .map(user => JSON.stringify({ id: user.warehouseId, name: user.warehouseName }))
    )
  )
    .map(item => JSON.parse(item))
    .sort((a, b) => a.name.localeCompare(b.name));
}
