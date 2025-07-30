export interface Box {
  id: string;
  code: string;
  name?: string;
  warehouseId: string;
  warehouseName: string;
  section: string;
  row: string;
  column: string;
  level: number;
  capacity: number;
  usedCapacity: number;
  isActive: boolean;
  items: BoxItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BoxItem {
  id: string;
  boxId: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

// Helper function to calculate capacity percentage
export function calculateBoxCapacity(box: Box): number {
  return Math.round((box.usedCapacity / box.capacity) * 100);
}

// Helper function to get capacity color based on percentage
export function getBoxCapacityColorClass(percentage: number): string {
  if (percentage < 50) return "text-green-600 dark:text-green-400";
  if (percentage < 80) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

// Helper function to format box location
export function formatBoxLocation(box: Box): string {
  return `${box.section}-${box.row}-${box.column}-${box.level}`;
}

// Mock data for development
export const mockBoxes: Box[] = [
  {
    id: "b1",
    code: "JKT-A1-001",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    section: "A",
    row: "1",
    column: "1",
    level: 1,
    capacity: 100,
    usedCapacity: 65,
    isActive: true,
    items: [
      {
        id: "bi1",
        boxId: "b1",
        productId: "p1",
        productName: "Smartphone X1",
        productSku: "SP-X1-BLK",
        quantity: 15,
        addedAt: "2023-05-10T08:30:00Z",
        updatedAt: "2023-05-10T08:30:00Z"
      },
      {
        id: "bi2",
        boxId: "b1",
        productId: "p2",
        productName: "Tablet Pro",
        productSku: "TB-PRO-SLV",
        quantity: 10,
        addedAt: "2023-05-12T10:15:00Z",
        updatedAt: "2023-06-01T14:25:00Z"
      },
      {
        id: "bi3",
        boxId: "b1",
        productId: "p5",
        productName: "Wireless Earbuds",
        productSku: "WE-TWS-BLK",
        quantity: 40,
        addedAt: "2023-05-15T11:45:00Z",
        updatedAt: "2023-05-15T11:45:00Z"
      }
    ],
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-06-01T14:25:00Z"
  },
  {
    id: "b2",
    code: "JKT-A1-002",
    name: "Accessories Box",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    section: "A",
    row: "1",
    column: "2",
    level: 1,
    capacity: 200,
    usedCapacity: 180,
    isActive: true,
    items: [
      {
        id: "bi4",
        boxId: "b2",
        productId: "p6",
        productName: "USB-C Cable",
        productSku: "ACC-USB-C",
        quantity: 80,
        addedAt: "2023-04-20T09:30:00Z",
        updatedAt: "2023-04-20T09:30:00Z"
      },
      {
        id: "bi5",
        boxId: "b2",
        productId: "p7",
        productName: "Power Adapter",
        productSku: "ACC-PA-20W",
        quantity: 100,
        addedAt: "2023-04-22T13:45:00Z",
        updatedAt: "2023-04-22T13:45:00Z"
      }
    ],
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-04-22T13:45:00Z"
  },
  {
    id: "b3",
    code: "JKT-B2-003",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    section: "B",
    row: "2",
    column: "3",
    level: 2,
    capacity: 50,
    usedCapacity: 10,
    isActive: true,
    items: [
      {
        id: "bi6",
        boxId: "b3",
        productId: "p3",
        productName: "Laptop Ultra",
        productSku: "LT-ULTRA-13",
        quantity: 10,
        addedAt: "2023-07-05T16:20:00Z",
        updatedAt: "2023-07-05T16:20:00Z"
      }
    ],
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-07-05T16:20:00Z"
  },
  {
    id: "b4",
    code: "JKT-C3-001",
    name: "Display Models",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    section: "C",
    row: "3",
    column: "1",
    level: 1,
    capacity: 30,
    usedCapacity: 30,
    isActive: true,
    items: [
      {
        id: "bi7",
        boxId: "b4",
        productId: "p1",
        productName: "Smartphone X1",
        productSku: "SP-X1-BLK",
        quantity: 5,
        addedAt: "2023-03-01T10:00:00Z",
        updatedAt: "2023-03-01T10:00:00Z"
      },
      {
        id: "bi8",
        boxId: "b4",
        productId: "p2",
        productName: "Tablet Pro",
        productSku: "TB-PRO-SLV",
        quantity: 5,
        addedAt: "2023-03-01T10:05:00Z",
        updatedAt: "2023-03-01T10:05:00Z"
      },
      {
        id: "bi9",
        boxId: "b4",
        productId: "p3",
        productName: "Laptop Ultra",
        productSku: "LT-ULTRA-13",
        quantity: 5,
        addedAt: "2023-03-01T10:10:00Z",
        updatedAt: "2023-03-01T10:10:00Z"
      },
      {
        id: "bi10",
        boxId: "b4",
        productId: "p4",
        productName: "Smartwatch Series 2",
        productSku: "SW-S2-BLK",
        quantity: 15,
        addedAt: "2023-03-01T10:15:00Z",
        updatedAt: "2023-03-01T10:15:00Z"
      }
    ],
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-03-01T10:15:00Z"
  },
  {
    id: "b5",
    code: "BDG-A1-001",
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    section: "A",
    row: "1",
    column: "1",
    level: 1,
    capacity: 100,
    usedCapacity: 40,
    isActive: true,
    items: [
      {
        id: "bi11",
        boxId: "b5",
        productId: "p1",
        productName: "Smartphone X1",
        productSku: "SP-X1-BLK",
        quantity: 20,
        addedAt: "2023-04-15T09:30:00Z",
        updatedAt: "2023-04-15T09:30:00Z"
      },
      {
        id: "bi12",
        boxId: "b5",
        productId: "p5",
        productName: "Wireless Earbuds",
        productSku: "WE-TWS-BLK",
        quantity: 20,
        addedAt: "2023-04-15T09:35:00Z",
        updatedAt: "2023-04-15T09:35:00Z"
      }
    ],
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-04-15T09:35:00Z"
  },
  {
    id: "b6",
    code: "BDG-B1-001",
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    section: "B",
    row: "1",
    column: "1",
    level: 1,
    capacity: 150,
    usedCapacity: 0,
    isActive: false,
    items: [],
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2023-05-10T11:20:00Z"
  },
  {
    id: "b7",
    code: "SBY-A1-001",
    name: "Phones and Tablets",
    warehouseId: "w3",
    warehouseName: "Surabaya Branch",
    section: "A",
    row: "1",
    column: "1",
    level: 1,
    capacity: 120,
    usedCapacity: 95,
    isActive: true,
    items: [
      {
        id: "bi13",
        boxId: "b7",
        productId: "p1",
        productName: "Smartphone X1",
        productSku: "SP-X1-BLK",
        quantity: 35,
        addedAt: "2023-05-20T08:30:00Z",
        updatedAt: "2023-05-20T08:30:00Z"
      },
      {
        id: "bi14",
        boxId: "b7",
        productId: "p2",
        productName: "Tablet Pro",
        productSku: "TB-PRO-SLV",
        quantity: 25,
        addedAt: "2023-05-20T08:35:00Z",
        updatedAt: "2023-05-20T08:35:00Z"
      },
      {
        id: "bi15",
        boxId: "b7",
        productId: "p8",
        productName: "Tablet Mini",
        productSku: "TB-MINI-GLD",
        quantity: 35,
        addedAt: "2023-05-20T08:40:00Z",
        updatedAt: "2023-05-20T08:40:00Z"
      }
    ],
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: "2023-05-20T08:40:00Z"
  },
  {
    id: "b8",
    code: "SBY-A2-001",
    name: "Accessories and Peripherals",
    warehouseId: "w3",
    warehouseName: "Surabaya Branch",
    section: "A",
    row: "2",
    column: "1",
    level: 1,
    capacity: 200,
    usedCapacity: 150,
    isActive: true,
    items: [
      {
        id: "bi16",
        boxId: "b8",
        productId: "p6",
        productName: "USB-C Cable",
        productSku: "ACC-USB-C",
        quantity: 75,
        addedAt: "2023-05-25T10:30:00Z",
        updatedAt: "2023-05-25T10:30:00Z"
      },
      {
        id: "bi17",
        boxId: "b8",
        productId: "p7",
        productName: "Power Adapter",
        productSku: "ACC-PA-20W",
        quantity: 75,
        addedAt: "2023-05-25T10:35:00Z",
        updatedAt: "2023-05-25T10:35:00Z"
      }
    ],
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: "2023-05-25T10:35:00Z"
  }
];

// Helper functions to get unique sections, rows, columns, and levels
export function getSectionsFromBoxes(): string[] {
  return Array.from(
    new Set(mockBoxes.map(box => box.section))
  ).sort();
}

export function getRowsFromBoxes(): string[] {
  return Array.from(
    new Set(mockBoxes.map(box => box.row))
  ).sort();
}

export function getColumnsFromBoxes(): string[] {
  return Array.from(
    new Set(mockBoxes.map(box => box.column))
  ).sort();
}

export function getLevelsFromBoxes(): number[] {
  return Array.from(
    new Set(mockBoxes.map(box => box.level))
  ).sort((a, b) => a - b);
}

// Generate a unique box code based on warehouse and location
export function generateBoxCode(warehouseCode: string, section: string, row: string, column: string, level: number): string {
  // Extract first 3 letters of warehouse code
  const prefix = warehouseCode.split('-')[0];
  return `${prefix}-${section}${row}-${column.padStart(3, '0')}`;
}
