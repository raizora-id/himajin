import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, CalendarClock, FileEdit, Map, Receipt, ShoppingBag, Ticket, User } from "lucide-react";
import { TransactionStatus, getPaymentMethodLabel, getStatusLabel, mockTransactions } from "~/features/dashboard/models/transaction.model";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.transaction.invoiceNumber || 'Transaction Detail'} - POS System` },
    { name: "description", content: "Transaction details" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  // In a real app, this would fetch data from your database
  const transaction = mockTransactions.find(t => t.id === id);
  
  if (!transaction) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Transaction not found",
    });
  }
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  return json({ 
    transaction,
    formatCurrency
  });
};

// Helper to format dates
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper to get status badge styles
function getStatusBadgeStyles(status: TransactionStatus): string {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case TransactionStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case TransactionStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case TransactionStatus.REFUNDED:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

// Component to display detail item
function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="bg-muted rounded-full p-2">
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function TransactionDetail() {
  const { transaction, formatCurrency } = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/dashboard/transactions"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Transactions
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {transaction.invoiceNumber}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyles(transaction.status)}`}>
              {getStatusLabel(transaction.status)}
            </span>
            <Link
              to={`/dashboard/transactions/${transaction.id}/edit`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md inline-flex items-center gap-2"
            >
              <FileEdit className="h-4 w-4" />
              Edit Transaction
            </Link>
          </div>
        </div>
      </div>
      
      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem 
                icon={<Receipt className="h-4 w-4 text-primary" />}
                label="Invoice Number"
                value={transaction.invoiceNumber}
              />
              
              <DetailItem 
                icon={<CalendarClock className="h-4 w-4 text-primary" />}
                label="Transaction Date"
                value={formatDate(transaction.transactionDate)}
              />
              
              <DetailItem 
                icon={<User className="h-4 w-4 text-primary" />}
                label="Customer"
                value={transaction.customerName || "Walk-in Customer"}
              />
              
              <DetailItem 
                icon={<User className="h-4 w-4 text-primary" />}
                label="Cashier"
                value={transaction.userName}
              />
              
              <DetailItem 
                icon={<Map className="h-4 w-4 text-primary" />}
                label="Warehouse"
                value={transaction.warehouseName}
              />
              
              <DetailItem 
                icon={<Ticket className="h-4 w-4 text-primary" />}
                label="Payment Method"
                value={getPaymentMethodLabel(transaction.paymentMethod)}
              />
            </div>
            
            {transaction.note && (
              <div className="mt-6">
                <div className="text-sm text-muted-foreground mb-1">Note</div>
                <div className="bg-muted p-3 rounded-md text-sm">{transaction.note}</div>
              </div>
            )}
          </div>
          
          {/* Items */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-semibold mb-2">Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Discount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {transaction.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/dashboard/products/${item.productId}`}
                          className="text-primary hover:text-primary/90"
                        >
                          {item.productName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.productSku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {item.discount > 0 ? formatCurrency(item.discount) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(transaction.total)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(transaction.tax)}</span>
              </div>
              
              {transaction.discount > 0 && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span className="text-sm">Discount</span>
                  <span className="font-medium">-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Grand Total</span>
                  <span className="text-lg font-bold">{formatCurrency(transaction.grandTotal)}</span>
                </div>
              </div>
            </div>
            
            {/* Receipt Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full bg-muted text-foreground hover:bg-muted/80 h-9 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Print Receipt
              </button>
              
              <button
                type="button"
                className="w-full bg-muted text-foreground hover:bg-muted/80 h-9 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Email Receipt
              </button>
            </div>
            
            {/* Metadata */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(transaction.createdAt).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(transaction.updatedAt).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{transaction.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
