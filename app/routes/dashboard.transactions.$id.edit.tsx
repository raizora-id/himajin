import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft, MinusCircle, PlusCircle, Save, Trash } from "lucide-react";
import { useState } from "react";
import { PaymentMethod, TransactionStatus, getPaymentMethodLabel, getStatusLabel, mockTransactions } from "~/features/dashboard/models/transaction.model";
import { mockUsers } from "~/features/dashboard/models/user.model";
import { mockProducts } from "~/features/dashboard/models/product.model";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Edit ${data?.transaction.invoiceNumber || 'Transaction'} - POS System` },
    { name: "description", content: "Edit transaction information" },
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
  
  // Get all products for product selection
  const products = mockProducts;
  
  // Get all cashiers (users) for cashier selection
  const users = mockUsers.filter(user => 
    user.role === "cashier" || user.role === "admin" || user.role === "manager"
  );
  
  // Get statuses and payment methods for dropdowns
  const statuses = Object.values(TransactionStatus);
  const paymentMethods = Object.values(PaymentMethod);
  
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
    options: {
      products,
      users,
      statuses,
      paymentMethods
    },
    formatCurrency
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { id } = params;
  const formData = await request.formData();
  
  // Extract form data
  const status = formData.get("status")?.toString() || "";
  const paymentMethod = formData.get("paymentMethod")?.toString() || "";
  const note = formData.get("note")?.toString() || "";
  
  // In a real app, we'd validate and update the database
  // For this example, we'll do minimal validation
  
  const errors: Record<string, string> = {};
  
  if (!status) {
    errors.status = "Status is required";
  }
  
  if (!paymentMethod) {
    errors.paymentMethod = "Payment method is required";
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, we would update the database here
  // For now, we just redirect back to the transaction detail
  return redirect(`/dashboard/transactions/${id}`);
};

function FormField({ 
  id, 
  label, 
  error, 
  children,
  required = false
}: { 
  id: string; 
  label: string; 
  error?: string; 
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default function EditTransaction() {
  const { transaction, options, formatCurrency } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // State for transaction items
  const [items, setItems] = useState(transaction.items);
  const [totals, setTotals] = useState({
    subtotal: transaction.total,
    tax: transaction.tax,
    discount: transaction.discount,
    grandTotal: transaction.grandTotal
  });
  
  // Handle adding a new item
  const addItem = () => {
    const newItem = {
      id: `new-item-${Date.now()}`,
      productId: "",
      productName: "",
      productSku: "",
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };
  
  // Handle removing an item
  const removeItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Recalculate totals
    calculateTotals(updatedItems);
  };
  
  // Handle item field changes
  const updateItem = (itemId: string, field: string, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // If updating product, also update related fields
        if (field === "productId" && typeof value === "string") {
          const product = options.products.find(p => p.id === value);
          if (product) {
            updatedItem.productName = product.name;
            updatedItem.productSku = product.sku;
            updatedItem.price = product.price;
            updatedItem.total = product.price * updatedItem.quantity;
          }
        }
        
        // If updating quantity or price, recalculate total
        if (field === "quantity" || field === "price" || field === "discount") {
          updatedItem.total = (updatedItem.price * updatedItem.quantity) - (updatedItem.discount || 0);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Recalculate totals
    calculateTotals(updatedItems);
  };
  
  // Calculate transaction totals
  const calculateTotals = (currentItems = items) => {
    const subtotal = currentItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax rate
    const discount = transaction.discount; // Keep original discount
    const grandTotal = subtotal + tax - discount;
    
    setTotals({
      subtotal,
      tax,
      discount,
      grandTotal
    });
  };
  
  // Format date for the date input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/dashboard/transactions/${transaction.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Transaction Details
        </Link>
        <h2 className="text-2xl font-bold">Edit Transaction: {transaction.invoiceNumber}</h2>
      </div>
      
      <Form method="post" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transaction Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-6">Transaction Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  id="invoiceNumber" 
                  label="Invoice Number" 
                  error={actionData?.errors?.invoiceNumber}
                >
                  <input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={transaction.invoiceNumber}
                    readOnly
                  />
                </FormField>
                
                <FormField 
                  id="transactionDate" 
                  label="Transaction Date" 
                  error={actionData?.errors?.transactionDate}
                >
                  <input
                    id="transactionDate"
                    name="transactionDate"
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={formatDateForInput(transaction.transactionDate)}
                  />
                </FormField>
                
                <FormField 
                  id="customerName" 
                  label="Customer Name" 
                  error={actionData?.errors?.customerName}
                >
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={transaction.customerName || ""}
                  />
                </FormField>
                
                <FormField 
                  id="userId" 
                  label="Cashier" 
                  error={actionData?.errors?.userId}
                  required
                >
                  <select
                    id="userId"
                    name="userId"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={transaction.userId}
                    required
                  >
                    {options.users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                
                <FormField 
                  id="status" 
                  label="Status" 
                  error={actionData?.errors?.status}
                  required
                >
                  <select
                    id="status"
                    name="status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={transaction.status}
                    required
                  >
                    {options.statuses.map(status => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </FormField>
                
                <FormField 
                  id="paymentMethod" 
                  label="Payment Method" 
                  error={actionData?.errors?.paymentMethod}
                  required
                >
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={transaction.paymentMethod}
                    required
                  >
                    {options.paymentMethods.map(method => (
                      <option key={method} value={method}>
                        {getPaymentMethodLabel(method)}
                      </option>
                    ))}
                  </select>
                </FormField>
                
                <div className="md:col-span-2">
                  <FormField 
                    id="note" 
                    label="Note" 
                    error={actionData?.errors?.note}
                  >
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue={transaction.note || ""}
                    />
                  </FormField>
                </div>
              </div>
            </div>
            
            {/* Transaction Items */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Transaction Items</h3>
                <button 
                  type="button"
                  onClick={addItem}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 py-1 rounded-md text-sm inline-flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No items in this transaction. Add some items above.
                  </p>
                ) : (
                  <>
                    {/* Header row */}
                    <div className="grid grid-cols-12 gap-3 pb-2 border-b border-border text-xs font-medium text-muted-foreground">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2">Price</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Discount</div>
                      <div className="col-span-1">Total</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {/* Item rows */}
                    {items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-4">
                          <select
                            name={`items[${index}].productId`}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={item.productId}
                            onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                          >
                            <option value="">Select Product</option>
                            {options.products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} ({product.sku})
                              </option>
                            ))}
                          </select>
                          <input 
                            type="hidden" 
                            name={`items[${index}].id`} 
                            value={item.id} 
                          />
                          <input 
                            type="hidden" 
                            name={`items[${index}].productName`} 
                            value={item.productName} 
                          />
                          <input 
                            type="hidden" 
                            name={`items[${index}].productSku`} 
                            value={item.productSku} 
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <input
                            type="number"
                            name={`items[${index}].price`}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <input
                            type="number"
                            name={`items[${index}].quantity`}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <input
                            type="number"
                            name={`items[${index}].discount`}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            min="0"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="col-span-1 font-medium">
                          {formatCurrency(item.total)}
                          <input 
                            type="hidden" 
                            name={`items[${index}].total`} 
                            value={item.total} 
                          />
                        </div>
                        
                        <div className="col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                            title="Remove Item"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">{formatCurrency(totals.tax)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
                      value={totals.discount}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        setTotals({
                          ...totals,
                          discount,
                          grandTotal: totals.subtotal + totals.tax - discount
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Grand Total</span>
                    <span className="text-lg font-bold">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>
              
              <input type="hidden" name="total" value={totals.subtotal} />
              <input type="hidden" name="tax" value={totals.tax} />
              <input type="hidden" name="grandTotal" value={totals.grandTotal} />
              
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
            
            {transaction.status !== TransactionStatus.CANCELLED && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-2">
                  <Trash className="h-4 w-4" /> 
                  Cancel Transaction
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1 mb-3">
                  Canceling a transaction may affect inventory and reporting. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this transaction? This action cannot be undone.")) {
                      // In a real app, we'd handle the cancellation here
                      alert("Transaction cancellation would be processed here in a real app");
                    }
                  }}
                  className="bg-white text-red-700 hover:bg-red-50 border border-red-300 h-8 px-3 py-1 rounded-md text-sm"
                >
                  Cancel Transaction
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to={`/dashboard/transactions/${transaction.id}`}
            className="bg-muted text-foreground hover:bg-muted/80 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
