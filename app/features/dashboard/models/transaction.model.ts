export interface Transaction {
  id: string;
  invoiceNumber: string;
  transactionDate: string;
  customerId?: string;
  customerName?: string;
  userId: string;
  userName: string;
  warehouseId: string;
  warehouseName: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  total: number;
  tax: number;
  discount: number;
  grandTotal: number;
  note?: string;
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  CANCELLED = "cancelled",
  REFUNDED = "refunded"
}

export enum PaymentMethod {
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  DIGITAL_WALLET = "digital_wallet",
  STORE_CREDIT = "store_credit"
}

// Helper to get status label with proper capitalization
export function getStatusLabel(status: TransactionStatus): string {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Helper to get payment method label with proper formatting
export function getPaymentMethodLabel(method: PaymentMethod): string {
  return method.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Mock data for development
export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    invoiceNumber: "INV-2023-0001",
    transactionDate: "2023-07-28T09:30:00Z",
    customerId: "c1",
    customerName: "John Smith",
    userId: "u3",
    userName: "Cashier One",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.CASH,
    total: 250000,
    tax: 25000,
    discount: 0,
    grandTotal: 275000,
    items: [
      {
        id: "ti1",
        productId: "p1",
        productName: "Classic T-Shirt",
        productSku: "TSH-BLK-L",
        quantity: 2,
        price: 125000,
        discount: 0,
        total: 250000
      }
    ],
    createdAt: "2023-07-28T09:30:00Z",
    updatedAt: "2023-07-28T09:35:00Z"
  },
  {
    id: "t2",
    invoiceNumber: "INV-2023-0002",
    transactionDate: "2023-07-28T14:15:00Z",
    customerId: "c2",
    customerName: "Sarah Johnson",
    userId: "u3",
    userName: "Cashier One",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    total: 350000,
    tax: 35000,
    discount: 50000,
    grandTotal: 335000,
    note: "Birthday discount applied",
    items: [
      {
        id: "ti2",
        productId: "p2",
        productName: "Premium Hoodie",
        productSku: "HOD-GRY-XL",
        quantity: 1,
        price: 350000,
        discount: 50000,
        total: 300000
      }
    ],
    createdAt: "2023-07-28T14:15:00Z",
    updatedAt: "2023-07-28T14:20:00Z"
  },
  {
    id: "t3",
    invoiceNumber: "INV-2023-0003",
    transactionDate: "2023-07-29T10:45:00Z",
    userId: "u6",
    userName: "Cashier Two",
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.DIGITAL_WALLET,
    total: 450000,
    tax: 45000,
    discount: 0,
    grandTotal: 495000,
    items: [
      {
        id: "ti3",
        productId: "p3",
        productName: "Designer Jeans",
        productSku: "JNS-BLU-32",
        quantity: 1,
        price: 299000,
        discount: 0,
        total: 299000
      },
      {
        id: "ti4",
        productId: "p4",
        productName: "Casual Belt",
        productSku: "BLT-BRN-M",
        quantity: 1,
        price: 151000,
        discount: 0,
        total: 151000
      }
    ],
    createdAt: "2023-07-29T10:45:00Z",
    updatedAt: "2023-07-29T10:50:00Z"
  },
  {
    id: "t4",
    invoiceNumber: "INV-2023-0004",
    transactionDate: "2023-07-30T16:20:00Z",
    customerId: "c3",
    customerName: "Robert Chen",
    userId: "u3",
    userName: "Cashier One",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    status: TransactionStatus.CANCELLED,
    paymentMethod: PaymentMethod.DEBIT_CARD,
    total: 125000,
    tax: 12500,
    discount: 0,
    grandTotal: 137500,
    note: "Customer changed mind",
    items: [
      {
        id: "ti5",
        productId: "p1",
        productName: "Classic T-Shirt",
        productSku: "TSH-BLK-L",
        quantity: 1,
        price: 125000,
        discount: 0,
        total: 125000
      }
    ],
    createdAt: "2023-07-30T16:20:00Z",
    updatedAt: "2023-07-30T16:25:00Z"
  },
  {
    id: "t5",
    invoiceNumber: "INV-2023-0005",
    transactionDate: "2023-08-01T11:10:00Z",
    userId: "u8",
    userName: "Surabaya Manager",
    warehouseId: "w3",
    warehouseName: "Surabaya Branch",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.CASH,
    total: 599000,
    tax: 59900,
    discount: 0,
    grandTotal: 658900,
    items: [
      {
        id: "ti6",
        productId: "p5",
        productName: "Leather Jacket",
        productSku: "JKT-BLK-L",
        quantity: 1,
        price: 599000,
        discount: 0,
        total: 599000
      }
    ],
    createdAt: "2023-08-01T11:10:00Z",
    updatedAt: "2023-08-01T11:15:00Z"
  },
  {
    id: "t6",
    invoiceNumber: "INV-2023-0006",
    transactionDate: "2023-08-02T13:45:00Z",
    customerId: "c4",
    customerName: "Amanda Lopez",
    userId: "u6",
    userName: "Cashier Two",
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    status: TransactionStatus.REFUNDED,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    total: 350000,
    tax: 35000,
    discount: 0,
    grandTotal: 385000,
    note: "Wrong size, full refund",
    items: [
      {
        id: "ti7",
        productId: "p2",
        productName: "Premium Hoodie",
        productSku: "HOD-GRY-XL",
        quantity: 1,
        price: 350000,
        discount: 0,
        total: 350000
      }
    ],
    createdAt: "2023-08-02T13:45:00Z",
    updatedAt: "2023-08-03T10:20:00Z"
  },
  {
    id: "t7",
    invoiceNumber: "INV-2023-0007",
    transactionDate: "2023-08-03T09:15:00Z",
    userId: "u3",
    userName: "Cashier One",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    status: TransactionStatus.PENDING,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    total: 750000,
    tax: 75000,
    discount: 100000,
    grandTotal: 725000,
    note: "Awaiting payment confirmation",
    items: [
      {
        id: "ti8",
        productId: "p6",
        productName: "Formal Suit",
        productSku: "SUT-NVY-40",
        quantity: 1,
        price: 750000,
        discount: 100000,
        total: 650000
      }
    ],
    createdAt: "2023-08-03T09:15:00Z",
    updatedAt: "2023-08-03T09:20:00Z"
  },
  {
    id: "t8",
    invoiceNumber: "INV-2023-0008",
    transactionDate: "2023-08-04T15:30:00Z",
    customerId: "c5",
    customerName: "David Wilson",
    userId: "u8",
    userName: "Surabaya Manager",
    warehouseId: "w3",
    warehouseName: "Surabaya Branch",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.DIGITAL_WALLET,
    total: 425000,
    tax: 42500,
    discount: 40000,
    grandTotal: 427500,
    note: "Loyal customer discount",
    items: [
      {
        id: "ti9",
        productId: "p7",
        productName: "Running Shoes",
        productSku: "SHO-WHT-42",
        quantity: 1,
        price: 425000,
        discount: 40000,
        total: 385000
      }
    ],
    createdAt: "2023-08-04T15:30:00Z",
    updatedAt: "2023-08-04T15:35:00Z"
  },
  {
    id: "t9",
    invoiceNumber: "INV-2023-0009",
    transactionDate: "2023-08-05T12:00:00Z",
    userId: "u3",
    userName: "Cashier One",
    warehouseId: "w1",
    warehouseName: "Jakarta Main Store",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.CASH,
    total: 200000,
    tax: 20000,
    discount: 0,
    grandTotal: 220000,
    items: [
      {
        id: "ti10",
        productId: "p8",
        productName: "Baseball Cap",
        productSku: "CAP-RED-OS",
        quantity: 2,
        price: 100000,
        discount: 0,
        total: 200000
      }
    ],
    createdAt: "2023-08-05T12:00:00Z",
    updatedAt: "2023-08-05T12:05:00Z"
  },
  {
    id: "t10",
    invoiceNumber: "INV-2023-0010",
    transactionDate: "2023-08-06T10:15:00Z",
    customerId: "c1",
    customerName: "John Smith",
    userId: "u6",
    userName: "Cashier Two",
    warehouseId: "w2",
    warehouseName: "Bandung Branch",
    status: TransactionStatus.COMPLETED,
    paymentMethod: PaymentMethod.STORE_CREDIT,
    total: 299000,
    tax: 29900,
    discount: 29900,
    grandTotal: 299000,
    note: "Store credit used, no tax charged",
    items: [
      {
        id: "ti11",
        productId: "p3",
        productName: "Designer Jeans",
        productSku: "JNS-BLU-32",
        quantity: 1,
        price: 299000,
        discount: 0,
        total: 299000
      }
    ],
    createdAt: "2023-08-06T10:15:00Z",
    updatedAt: "2023-08-06T10:20:00Z"
  }
];

// Helper function to get warehouses from transaction data
export function getWarehousesFromTransactions(): { id: string; name: string }[] {
  return Array.from(
    new Set(
      mockTransactions.map(transaction => JSON.stringify({ id: transaction.warehouseId, name: transaction.warehouseName }))
    )
  )
    .map(item => JSON.parse(item))
    .sort((a, b) => a.name.localeCompare(b.name));
}
