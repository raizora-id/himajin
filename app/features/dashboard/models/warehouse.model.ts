export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email?: string;
  capacity: number;
  usedCapacity: number;
  isActive: boolean;
  managerId?: string;
  managerName?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data for development
export const mockWarehouses: Warehouse[] = [
  {
    id: "w1",
    name: "Jakarta Main Store",
    code: "JKT-MAIN",
    address: "Jl. Sudirman No. 123",
    city: "Jakarta",
    province: "DKI Jakarta",
    postalCode: "10220",
    phone: "+62-21-5551234",
    email: "jakarta@example.com",
    capacity: 10000,
    usedCapacity: 6500,
    isActive: true,
    managerId: "u2",
    managerName: "Manager One",
    latitude: -6.2088,
    longitude: 106.8456,
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2023-06-15T08:30:00Z"
  },
  {
    id: "w2",
    name: "Bandung Branch",
    code: "BDG-BR1",
    address: "Jl. Asia Afrika No. 45",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40112",
    phone: "+62-22-4445678",
    email: "bandung@example.com",
    capacity: 5000,
    usedCapacity: 2800,
    isActive: true,
    managerId: "u5",
    managerName: "Manager Two",
    latitude: -6.9175,
    longitude: 107.6191,
    createdAt: "2022-03-15T00:00:00Z",
    updatedAt: "2023-05-20T10:15:00Z"
  },
  {
    id: "w3",
    name: "Surabaya Branch",
    code: "SBY-BR1",
    address: "Jl. Pemuda No. 78",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60271",
    phone: "+62-31-3334567",
    email: "surabaya@example.com",
    capacity: 7500,
    usedCapacity: 4200,
    isActive: true,
    managerId: "u7",
    managerName: "Manager Three",
    latitude: -7.2575,
    longitude: 112.7521,
    createdAt: "2022-05-10T00:00:00Z",
    updatedAt: "2023-07-05T09:45:00Z"
  },
  {
    id: "w4",
    name: "Medan Branch",
    code: "MDN-BR1",
    address: "Jl. Diponegoro No. 56",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20152",
    phone: "+62-61-7778899",
    email: "medan@example.com",
    capacity: 4000,
    usedCapacity: 1200,
    isActive: false,
    createdAt: "2022-08-22T00:00:00Z",
    updatedAt: "2023-04-10T14:20:00Z"
  },
  {
    id: "w5",
    name: "Makassar Branch",
    code: "MKS-BR1",
    address: "Jl. Urip Sumoharjo No. 89",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90232",
    phone: "+62-411-2223344",
    capacity: 3500,
    usedCapacity: 2100,
    isActive: true,
    managerId: "u9",
    managerName: "Manager Four",
    latitude: -5.1477,
    longitude: 119.4327,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-06-28T11:30:00Z"
  },
  {
    id: "w6",
    name: "Denpasar Branch",
    code: "DPS-BR1",
    address: "Jl. Raya Kuta No. 123",
    city: "Denpasar",
    province: "Bali",
    postalCode: "80361",
    phone: "+62-361-5556677",
    email: "bali@example.com",
    capacity: 2500,
    usedCapacity: 1800,
    isActive: true,
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-07-01T13:15:00Z"
  },
  {
    id: "w7",
    name: "Jakarta Distribution Center",
    code: "JKT-DC1",
    address: "Jl. Industri Selatan Blok B5",
    city: "Jakarta",
    province: "DKI Jakarta",
    postalCode: "13930",
    phone: "+62-21-8889900",
    email: "distribution.jkt@example.com",
    capacity: 25000,
    usedCapacity: 18000,
    isActive: true,
    managerId: "u4",
    managerName: "Manager Five",
    latitude: -6.2885,
    longitude: 106.7731,
    createdAt: "2022-04-01T00:00:00Z",
    updatedAt: "2023-07-12T16:45:00Z"
  }
];

// Helper function to calculate capacity percentage
export function calculateCapacityPercentage(warehouse: Warehouse): number {
  return Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);
}

// Helper function to get capacity color based on percentage
export function getCapacityColorClass(percentage: number): string {
  if (percentage < 50) return "text-green-600 dark:text-green-400";
  if (percentage < 80) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

// Helper function to get a list of all cities from warehouses
export function getCitiesFromWarehouses(): string[] {
  return Array.from(
    new Set(mockWarehouses.map(warehouse => warehouse.city))
  ).sort();
}

// Helper function to get a list of all provinces from warehouses
export function getProvincesFromWarehouses(): string[] {
  return Array.from(
    new Set(mockWarehouses.map(warehouse => warehouse.province))
  ).sort();
}

// Helper to format address
export function formatFullAddress(warehouse: Warehouse): string {
  return `${warehouse.address}, ${warehouse.city}, ${warehouse.province} ${warehouse.postalCode}`;
}
