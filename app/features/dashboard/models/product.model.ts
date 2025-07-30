export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description: string;
  price: number;
  cost: number;
  stockQuantity: number;
  category: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  warehouseId: string;
  warehouseName: string;
  boxId?: string;
  boxName?: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category: string;
  warehouseId: string;
  warehouseName: string;
  isActive: boolean;
  boxId?: string;
  boxName?: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  warehouseId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  boxId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Mock data for development
export const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: `PRD-${1000 + i}`,
  name: `Product ${i + 1}${i % 10 === 0 ? ' (Premium)' : ''}`,
  sku: `SKU-${10000 + i}`,
  barcode: `BARCODE-${9000000 + i}`,
  description: `This is a detailed description for Product ${i + 1}. It contains important information about the product's features and benefits.`,
  price: Math.floor(50000 + Math.random() * 500000) / 100 * 100,
  cost: Math.floor(30000 + Math.random() * 300000) / 100 * 100,
  stockQuantity: Math.floor(Math.random() * 100),
  category: ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Kitchen', 'Health & Beauty'][i % 5],
  brand: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'][i % 5],
  weight: Math.floor(Math.random() * 10000) / 100,
  dimensions: {
    length: Math.floor(Math.random() * 100) + 5,
    width: Math.floor(Math.random() * 50) + 5,
    height: Math.floor(Math.random() * 30) + 2,
  },
  imageUrl: `https://placehold.co/400x300?text=Product+${i + 1}`,
  isActive: Math.random() > 0.1,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  warehouseId: `WRH-${['1001', '1002', '1003', '1004'][i % 4]}`,
  warehouseName: [`Central Warehouse`, `North Branch`, `South Branch`, `East Branch`][i % 4],
  boxId: Math.random() > 0.2 ? `BOX-${['A101', 'B202', 'C303', 'D404', 'E505'][i % 5]}` : undefined,
  boxName: Math.random() > 0.2 ? `${['Section A', 'Section B', 'Section C', 'Section D', 'Section E'][i % 5]}-${Math.floor(Math.random() * 10) + 1}` : undefined,
}));
