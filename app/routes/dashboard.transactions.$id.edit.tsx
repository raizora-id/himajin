import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { ArrowLeft, MinusCircle, PlusCircle, Save, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PaymentMethod, TransactionStatus, getPaymentMethodLabel, getStatusLabel, mockTransactions } from "~/features/dashboard/models/transaction.model";
import { mockUsers } from "~/features/dashboard/models/user.model";
import { mockProducts } from "~/features/dashboard/models/product.model";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/ui/input/input";
import { Label } from "~/ui/label/label";
import { Textarea } from "~/ui/textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/ui/select/select";
import { Button } from "~/ui/button/button";
import { cn } from "~/lib/utils";

// Helper functions
const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

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

// Define transaction schema using Zod for validation
const transactionItemSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, { message: "Product is required" }),
  productName: z.string(),
  productSku: z.string(),
  price: z.coerce.number().positive({ message: "Price must be greater than zero" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be at least 1" }),
  discount: z.coerce.number().nonnegative({ message: "Discount cannot be negative" }),
  total: z.coerce.number()
});

const transactionSchema = z.object({
  invoiceNumber: z.string(),
  transactionDate: z.string().min(1, { message: "Date is required" }),
  dueDate: z.string().optional(),
  customerName: z.string().optional(),
  userId: z.string().min(1, { message: "Cashier is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  note: z.string().optional(),
  items: z.array(transactionItemSchema),
  subtotal: z.coerce.number(),
  tax: z.coerce.number(),
  discount: z.coerce.number().nonnegative(),
  grandTotal: z.coerce.number()
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

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
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default function EditTransaction() {
  const { transaction, options } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // State for transaction items
  const [items, setItems] = useState(transaction.items);
  const [totals, setTotals] = useState({
    subtotal: transaction.total,
    tax: transaction.tax,
    discount: transaction.discount,
    grandTotal: transaction.grandTotal
  });
  
  // Create form default values from transaction data
  const defaultValues: Partial<TransactionFormValues> = {
    invoiceNumber: transaction.invoiceNumber,
    transactionDate: formatDateForInput(transaction.transactionDate),
    customerName: transaction.customerName || "",
    userId: transaction.userId,
    status: transaction.status,
    paymentMethod: transaction.paymentMethod,
    note: transaction.note || "",
    items: transaction.items,
    subtotal: transaction.total,
    tax: transaction.tax,
    discount: transaction.discount,
    grandTotal: transaction.grandTotal
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setValue,
    control,
    watch,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any, // Type cast to fix TS error
    defaultValues,
  });
  
  // Handle form submission
  const onSubmit = (data: TransactionFormValues) => {
    const formData = new FormData();
    
    // Add basic transaction fields
    formData.append('invoiceNumber', data.invoiceNumber);
    formData.append('transactionDate', data.transactionDate);
    formData.append('dueDate', data.dueDate ? data.dueDate : '');
    formData.append('status', data.status);
    formData.append('paymentMethod', data.paymentMethod);
    formData.append('note', data.note || '');
    
    // Add transaction items
    data.items.forEach((item, index) => {
      formData.append(`items[${index}].id`, item.id);
      formData.append(`items[${index}].productId`, item.productId);
      formData.append(`items[${index}].productName`, item.productName);
      formData.append(`items[${index}].productSku`, item.productSku);
      formData.append(`items[${index}].price`, item.price.toString());
      formData.append(`items[${index}].quantity`, item.quantity.toString());
      formData.append(`items[${index}].discount`, item.discount.toString());
      formData.append(`items[${index}].total`, item.total.toString());
    });
    
    // Add summary fields
    formData.append('subtotal', totals.subtotal.toString());
    formData.append('totalDiscount', totals.discount.toString());
    formData.append('tax', totals.tax.toString());
    formData.append('totalAmount', totals.grandTotal.toString());
    
    submit(formData, { method: 'post' });
  };
  
  // Handle validation errors and scroll to the first error field
  const onError = (errors: FieldErrors<TransactionFormValues>) => {
    const errorKeys = Object.keys(errors);
    
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const errorElement = document.getElementById(firstErrorKey);
      
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus({ preventScroll: true });
      }
    }
  };
  
  // Scroll to first error when form is submitted with errors
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus({ preventScroll: true });
      }
    }
  }, [errors]);
  
  // Handle adding a new item
  const addItem = () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 11),
      productId: "",
      productName: "",
      productSku: "",
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Update form values
    const currentItems = [...items, newItem];
    setValue('items', currentItems);
  };
  
  // Handle removing an item
  const removeItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    setValue('items', newItems);
    calculateTotals(newItems);
  };
  
  // Handle item field changes
  const updateItem = (itemId: string, field: string, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id !== itemId) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      // If product ID is updated, update product name and sku as well
      if (field === "productId" && typeof value === "string") {
        const selectedProduct = options.products.find(p => p.id === value);
        if (selectedProduct) {
          updatedItem.productName = selectedProduct.name;
          updatedItem.productSku = selectedProduct.sku;
          updatedItem.price = selectedProduct.price;
        }
      }
      
      // Recalculate item total
      updatedItem.total = (updatedItem.price * updatedItem.quantity) - updatedItem.discount;
      
      return updatedItem;
    });
    
    setItems(updatedItems);
    setValue('items', updatedItems);
    calculateTotals(updatedItems);
  };
  
  // Calculate transaction totals
  const calculateTotals = (currentItems = items) => {
    const subtotal = currentItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const discount = totals.discount; // Keep existing discount
    const grandTotal = subtotal + tax - discount;
    
    setTotals({
      subtotal,
      tax,
      discount,
      grandTotal
    });
    
    // Update form values
    setValue('subtotal', subtotal);
    setValue('tax', tax);
    setValue('grandTotal', grandTotal);
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
      
      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transaction Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-6">Transaction Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  id="invoiceNumber" 
                  label="Invoice Number" 
                  required
                  error={errors.invoiceNumber?.message}
                >
                  <Input
                    id="invoiceNumber"
                    {...register('invoiceNumber')}
                    className="w-full"
                    defaultValue={transaction.invoiceNumber}
                    readOnly
                    aria-invalid={!!errors.invoiceNumber}
                  />
                </FormField>
                
                <FormField 
                  id="transactionDate" 
                  label="Transaction Date"
                  required
                  error={errors.transactionDate?.message}
                >
                  <Input
                    type="date"
                    id="transactionDate"
                    {...register('transactionDate')}
                    className="w-full"
                    defaultValue={formatDateForInput(transaction.transactionDate)}
                    aria-invalid={!!errors.transactionDate}
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
                  required
                  error={errors.status?.message}
                >
                  <Select
                    defaultValue={transaction.status}
                    onValueChange={(value) => setValue('status', value)}
                  >
                    <SelectTrigger 
                      id="status"
                      className="w-full" 
                      aria-invalid={!!errors.status}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField 
                  id="paymentMethod" 
                  label="Payment Method"
                  required
                  error={errors.paymentMethod?.message}
                >
                  <Select
                    defaultValue={transaction.paymentMethod}
                    onValueChange={(value) => setValue('paymentMethod', value)}
                  >
                    <SelectTrigger 
                      id="paymentMethod"
                      className="w-full" 
                      aria-invalid={!!errors.paymentMethod}
                    >
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {getPaymentMethodLabel(method)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <div className="md:col-span-2">
                  <FormField 
                    id="note" 
                    label="Note" 
                    error={errors.note?.message}
                  >
                    <Textarea
                      id="note"
                      {...register('note')}
                      rows={3}
                      className="w-full"
                      placeholder="Add a note about this transaction"
                      defaultValue={transaction.note || ""}
                      aria-invalid={!!errors.note}
                    />
                  </FormField>
                </div>
              </div>
            </div>
            
            {/* Transaction Items */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Transaction Items</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-8">
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
                          <Select
                            value={item.productId}
                            onValueChange={(value) => updateItem(item.id, "productId", value)}
                          >
                            <SelectTrigger 
                              className="w-full text-sm"
                            >
                              <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                              {options.products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <input 
                            type="hidden"
                            name={`items[${index}].productId`}
                            value={item.productId}
                          />
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
                          <Input
                            type="number"
                            className="w-full text-sm"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          />
                          <input
                            type="hidden"
                            name={`items[${index}].price`}
                            value={item.price}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            type="number"
                            className="w-full text-sm"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                          />
                          <input
                            type="hidden"
                            name={`items[${index}].quantity`}
                            value={item.quantity}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            type="number"
                            className="w-full text-sm"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                          />
                          <input
                            type="hidden"
                            name={`items[${index}].discount`}
                            value={item.discount}
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
                          <Button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                            title="Remove Item"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
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
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 w-full"
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
          </Button>
        </div>
      </form>
    </div>
  );
}
