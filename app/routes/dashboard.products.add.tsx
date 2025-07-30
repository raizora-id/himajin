import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { mockProducts } from "~/features/dashboard/models/product.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Add New Product - POS System" },
    { name: "description", content: "Add a new product to inventory" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get warehouses and box options from mock data
  const warehouses = Array.from(
    new Set(mockProducts.map(product => product.warehouseId))
  ).map(warehouseId => ({
    id: warehouseId,
    name: mockProducts.find(product => product.warehouseId === warehouseId)?.warehouseName || ""
  }));
  
  const boxes = Array.from(
    new Set(mockProducts.filter(p => p.boxId).map(product => product.boxId))
  ).map(boxId => ({
    id: boxId,
    name: mockProducts.find(product => product.boxId === boxId)?.boxName || ""
  }));
  
  const categories = Array.from(new Set(mockProducts.map(product => product.category)));
  
  return json({
    options: {
      warehouses,
      boxes,
      categories
    }
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Extract form data
  const name = formData.get("name")?.toString();
  const sku = formData.get("sku")?.toString();
  const barcode = formData.get("barcode")?.toString();
  const description = formData.get("description")?.toString();
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const cost = parseFloat(formData.get("cost")?.toString() || "0");
  const stockQuantity = parseInt(formData.get("stockQuantity")?.toString() || "0");
  const category = formData.get("category")?.toString();
  const brand = formData.get("brand")?.toString();
  const warehouseId = formData.get("warehouseId")?.toString();
  const boxId = formData.get("boxId")?.toString() || undefined;
  const isActive = formData.get("isActive") === "true";
  const weight = parseFloat(formData.get("weight")?.toString() || "0");
  
  // Validate form data
  const errors: Record<string, string> = {};
  
  if (!name || name.length < 3) {
    errors.name = "Product name must be at least 3 characters";
  }
  
  if (!sku) {
    errors.sku = "SKU is required";
  } else {
    // Check for duplicate SKU
    const existingSku = mockProducts.find(p => p.sku === sku);
    if (existingSku) {
      errors.sku = "This SKU already exists";
    }
  }
  
  if (isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than zero";
  }
  
  if (isNaN(cost) || cost < 0) {
    errors.cost = "Cost cannot be negative";
  }
  
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    errors.stockQuantity = "Stock quantity cannot be negative";
  }
  
  if (!category) {
    errors.category = "Category is required";
  }
  
  if (!warehouseId) {
    errors.warehouseId = "Warehouse is required";
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, we would save to the database here
  // For this mock version, we'll just redirect as if save was successful
  
  // Generate a mock ID for the new product
  const newId = `p${Math.floor(Math.random() * 10000)}`;
  
  // Redirect to products list
  return redirect("/dashboard/products");
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

export default function AddProduct() {
  const { options } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [showDimensionsFields, setShowDimensionsFields] = useState(false);
  const [enableBarcode, setEnableBarcode] = useState(false);
  
  const generateSku = () => {
    const prefix = "SKU";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const date = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${date}`;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/dashboard/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
        <h2 className="text-2xl font-bold">Add New Product</h2>
      </div>
      
      <Form method="post" className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="name" 
                label="Product Name" 
                error={actionData?.errors?.name}
                required
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                />
              </FormField>
              
              <FormField 
                id="sku" 
                label="SKU" 
                error={actionData?.errors?.sku}
                required
              >
                <div className="flex gap-2">
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono"
                    placeholder="SKU-12345-6789"
                    required
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const skuInput = document.getElementById("sku") as HTMLInputElement;
                      if (skuInput) skuInput.value = generateSku();
                    }}
                    className="bg-muted text-foreground hover:bg-muted/80 px-3 py-2 rounded-md text-sm"
                  >
                    Generate
                  </button>
                </div>
              </FormField>
              
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  id="barcode-toggle" 
                  label="Barcode" 
                  error={actionData?.errors?.barcode}
                >
                  <div className="flex items-center mb-2">
                    <input
                      id="barcode-toggle"
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      checked={enableBarcode}
                      onChange={() => setEnableBarcode(!enableBarcode)}
                    />
                    <label htmlFor="barcode-toggle" className="ml-2 text-sm text-muted-foreground">
                      Enable barcode
                    </label>
                  </div>
                  
                  {enableBarcode && (
                    <input
                      id="barcode"
                      name="barcode"
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono"
                      placeholder="Enter barcode"
                    />
                  )}
                </FormField>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  id="description" 
                  label="Description" 
                  error={actionData?.errors?.description}
                >
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Product description"
                  />
                </FormField>
              </div>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="price" 
                label="Selling Price" 
                error={actionData?.errors?.price}
                required
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="100"
                    min="0"
                    className="w-full rounded-md border border-input bg-background pl-9 py-2"
                    placeholder="0"
                    required
                  />
                </div>
              </FormField>
              
              <FormField 
                id="cost" 
                label="Cost Price" 
                error={actionData?.errors?.cost}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    step="100"
                    min="0"
                    className="w-full rounded-md border border-input bg-background pl-9 py-2"
                    placeholder="0"
                  />
                </div>
              </FormField>
            </div>
          </div>
          
          {/* Inventory */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="stockQuantity" 
                label="Initial Stock Quantity" 
                error={actionData?.errors?.stockQuantity}
              >
                <input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="0"
                />
              </FormField>
              
              <FormField 
                id="warehouseId" 
                label="Warehouse" 
                error={actionData?.errors?.warehouseId}
                required
              >
                <select
                  id="warehouseId"
                  name="warehouseId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {options.warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField 
                id="boxId" 
                label="Box / Location" 
                error={actionData?.errors?.boxId}
              >
                <select
                  id="boxId"
                  name="boxId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">No Box Assigned</option>
                  {options.boxes.map(box => (
                    <option key={box.id} value={box.id}>
                      {box.name}
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField 
                id="isActive" 
                label="Status" 
                error={actionData?.errors?.isActive}
              >
                <select
                  id="isActive"
                  name="isActive"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="true"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </FormField>
            </div>
          </div>
          
          {/* Categorization */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Categorization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="category" 
                label="Category" 
                error={actionData?.errors?.category}
                required
              >
                <select
                  id="category"
                  name="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  {options.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField 
                id="brand" 
                label="Brand" 
                error={actionData?.errors?.brand}
              >
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Brand name (optional)"
                />
              </FormField>
            </div>
          </div>
          
          {/* Physical Attributes */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Physical Attributes</h3>
            
            <div className="space-y-6">
              <FormField 
                id="weight" 
                label="Weight (grams)" 
                error={actionData?.errors?.weight}
              >
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="0"
                />
              </FormField>
              
              <div>
                <div className="flex items-center mb-4">
                  <input
                    id="dimensions-toggle"
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={showDimensionsFields}
                    onChange={() => setShowDimensionsFields(!showDimensionsFields)}
                  />
                  <label htmlFor="dimensions-toggle" className="ml-2 text-sm font-medium">
                    Specify Dimensions
                  </label>
                </div>
                
                {showDimensionsFields && (
                  <div className="grid grid-cols-3 gap-4">
                    <FormField 
                      id="length" 
                      label="Length (cm)" 
                      error={actionData?.errors?.length}
                    >
                      <input
                        id="length"
                        name="length"
                        type="number"
                        min="0"
                        step="0.1"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="0"
                      />
                    </FormField>
                    
                    <FormField 
                      id="width" 
                      label="Width (cm)" 
                      error={actionData?.errors?.width}
                    >
                      <input
                        id="width"
                        name="width"
                        type="number"
                        min="0"
                        step="0.1"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="0"
                      />
                    </FormField>
                    
                    <FormField 
                      id="height" 
                      label="Height (cm)" 
                      error={actionData?.errors?.height}
                    >
                      <input
                        id="height"
                        name="height"
                        type="number"
                        min="0"
                        step="0.1"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="0"
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Product Image</h3>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Drag and drop your image here, or click to select a file
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WEBP up to 5MB
                </p>
              </div>
              <button
                type="button"
                className="mt-4 bg-muted text-foreground hover:bg-muted/80 h-9 px-4 py-2 rounded-md text-sm"
              >
                Select Image
              </button>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Note: Image upload is not functional in this demo
            </p>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/dashboard/products"
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
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
