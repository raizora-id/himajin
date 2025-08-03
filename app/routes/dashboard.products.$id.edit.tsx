import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { mockProducts } from "~/features/dashboard/models/product.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/shared/ui/input/input";
import { Label } from "~/shared/ui/label/label";
import { Checkbox } from "~/shared/ui/checkbox/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui/select/select";
import { Textarea } from "~/shared/ui/textarea/textarea";


export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Edit ${data?.product.name || 'Product'} - POS System` },
    { name: "description", content: "Edit product information" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  // In a real app, this would fetch data from your database
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Product not found",
    });
  }
  
  // Get warehouses and box options
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
    product,
    options: {
      warehouses,
      boxes,
      categories
    }
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { id } = params;
  const formData = await request.formData();
  
  // In a real app, this would update the database
  // Here we just validate and return
  
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
  
  const errors: Record<string, string> = {};
  
  if (!name || name.length < 3) {
    errors.name = "Product name must be at least 3 characters";
  }
  
  if (!sku) {
    errors.sku = "SKU is required";
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
  
  // In a real app, we would update the database here
  
  // Redirect to product detail page
  return redirect(`/dashboard/products/${id}`);
};

function FormField({ 
  id, 
  label, 
  error, 
  children 
}: { 
  id: string; 
  label: string; 
  error?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

// Product form schema using Zod for validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  barcode: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: "Price must be greater than zero" }),
  cost: z.coerce.number().nonnegative({ message: "Cost cannot be negative" }),
  stockQuantity: z.coerce.number().nonnegative({ message: "Stock quantity cannot be negative" }),
  category: z.string().min(1, { message: "Category is required" }),
  brand: z.string().optional(),
  warehouseId: z.string().min(1, { message: "Warehouse is required" }),
  boxId: z.string().optional(),
  isActive: z.boolean(),
  weight: z.coerce.number().nonnegative().optional(),
  dimensions: z.object({
    length: z.coerce.number().nonnegative().optional(),
    width: z.coerce.number().nonnegative().optional(),
    height: z.coerce.number().nonnegative().optional(),
  }).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProduct() {
  const { product, options } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  
  // Create form default values from product data
  const defaultValues: Partial<ProductFormValues> = {
    name: product.name,
    sku: product.sku,
    barcode: product.barcode || "",
    description: product.description || "",
    price: product.price,
    cost: product.cost,
    stockQuantity: product.stockQuantity,
    category: product.category,
    brand: product.brand || "",
    warehouseId: product.warehouseId,
    boxId: product.boxId || "",
    isActive: product.isActive,
    weight: product.weight || 0,
    dimensions: product.dimensions || {
      length: 0,
      width: 0,
      height: 0
    }
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    setValue,
    control,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any, // Type cast to fix TS error
    defaultValues,
  });
  
  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    // Create FormData to submit
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'dimensions' && showDimensionsFields && value) {
        // Handle dimensions object
        Object.entries(value).forEach(([dimKey, dimValue]) => {
          if (dimValue !== undefined) {
            formData.append(dimKey, dimValue.toString());
          }
        });
      } else if (key !== 'dimensions') {
        // Handle all other fields
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Submit the form
    submit(formData, { method: 'post' });
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
  
  const [showDimensionsFields, setShowDimensionsFields] = useState(!!product.dimensions);
  const [enableBarcode, setEnableBarcode] = useState(!!product.barcode);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/dashboard/products/${product.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Product Details
        </Link>
        <h2 className="text-2xl font-bold">Edit Product</h2>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="name" 
                label="Product Name" 
                error={errors.name?.message?.toString() || actionData?.errors?.name}
              >
                <Input
                  id="name"
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
              </FormField>
              
              <FormField 
                id="sku" 
                label="SKU" 
                error={errors.sku?.message?.toString() || actionData?.errors?.sku}
              >
                <Input
                  id="sku"
                  {...register("sku")}
                  className="font-mono"
                  aria-invalid={errors.sku ? "true" : "false"}
                />
              </FormField>
              
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  id="barcode-toggle" 
                  label="Barcode" 
                  error={errors.barcode?.message?.toString() || actionData?.errors?.barcode}
                >
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="barcode-toggle"
                        checked={enableBarcode}
                        onCheckedChange={(checked) => {
                          setEnableBarcode(checked === true);
                          if (!checked) {
                            setValue('barcode', '');
                          }
                        }}
                      />
                      <Label htmlFor="barcode-toggle" className="text-sm text-muted-foreground">
                        Enable barcode
                      </Label>
                    </div>
                  </div>
                  
                  {enableBarcode && (
                    <Input
                      id="barcode"
                      {...register("barcode")}
                      className="font-mono"
                      aria-invalid={errors.barcode ? "true" : "false"}
                    />
                  )}
                </FormField>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  id="description" 
                  label="Description" 
                  error={errors.description?.message?.toString() || actionData?.errors?.description}
                >
                  <Textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                    aria-invalid={errors.description ? "true" : "false"}
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
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="price"
                    {...register("price")}
                    type="number"
                    step="100"
                    min="0"
                    className="pl-9"
                    aria-invalid={errors.price ? "true" : "false"}
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
                  <Input
                    id="cost"
                    {...register("cost")}
                    type="number"
                    step="100"
                    min="0"
                    className="pl-9"
                    aria-invalid={errors.cost ? "true" : "false"}
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
                label="Stock Quantity" 
                error={actionData?.errors?.stockQuantity}
              >
                <Input
                  id="stockQuantity"
                  {...register("stockQuantity")}
                  type="number"
                  min="0"
                  aria-invalid={errors.stockQuantity ? "true" : "false"}
                />
              </FormField>
              
              <FormField 
                id="warehouseId" 
                label="Warehouse" 
                error={actionData?.errors?.warehouseId}
              >
                <Select
                  defaultValue={product.warehouseId}
                  onValueChange={(value) => setValue("warehouseId", value)}
                >
                  <SelectTrigger
                    id="warehouseId"
                    aria-invalid={errors.warehouseId ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              
              <FormField 
                id="boxId" 
                label="Box / Location" 
                error={actionData?.errors?.boxId}
              >
                <Select
                  defaultValue={product.boxId || ""}
                  onValueChange={(value) => setValue("boxId", value)}
                >
                  <SelectTrigger
                    id="boxId"
                    aria-invalid={errors.boxId ? "true" : "false"}
                  >
                    <SelectValue placeholder="No Box Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Box Assigned</SelectItem>
                    {options.boxes.map(box => (
                      <SelectItem key={box.id} value={box.id || ""}>
                        {box.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              
              <FormField 
                id="isActive" 
                label="Status" 
                error={actionData?.errors?.isActive}
              >
                <Select
                  defaultValue={product.isActive ? "true" : "false"}
                  onValueChange={(value) => setValue("isActive", value === "true")}
                >
                  <SelectTrigger id="isActive">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
              >
                <Select
                  defaultValue={product.category}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger
                    id="category"
                    aria-invalid={errors.category ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              
              <FormField 
                id="brand" 
                label="Brand" 
                error={actionData?.errors?.brand}
              >
                <Input
                  id="brand"
                  {...register("brand")}
                  aria-invalid={errors.brand ? "true" : "false"}
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
                <Input
                  id="weight"
                  {...register("weight")}
                  type="number"
                  min="0"
                  step="0.01"
                  aria-invalid={errors.weight ? "true" : "false"}
                />
              </FormField>
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dimensions-toggle"
                      checked={showDimensionsFields}
                      onCheckedChange={(checked) => {
                        setShowDimensionsFields(checked === true);
                        if (!checked) {
                          setValue('dimensions.length', 0);
                          setValue('dimensions.width', 0);
                          setValue('dimensions.height', 0);
                        }
                      }}
                    />
                    <Label htmlFor="dimensions-toggle">
                      Specify Dimensions
                    </Label>
                  </div>
                </div>
                
                {showDimensionsFields && (
                  <div className="grid grid-cols-3 gap-4">
                    <FormField 
                      id="length" 
                      label="Length (cm)" 
                      error={actionData?.errors?.length}
                    >
                      <Input
                        id="length"
                        {...register("dimensions.length")}
                        type="number"
                        min="0"
                        step="0.1"
                        aria-invalid={errors.dimensions?.length ? "true" : "false"}
                      />
                    </FormField>
                    
                    <FormField 
                      id="width" 
                      label="Width (cm)" 
                      error={actionData?.errors?.width}
                    >
                      <Input
                        id="width"
                        {...register("dimensions.width")}
                        type="number"
                        min="0"
                        step="0.1"
                        aria-invalid={errors.dimensions?.width ? "true" : "false"}
                      />
                    </FormField>
                    
                    <FormField 
                      id="height" 
                      label="Height (cm)" 
                      error={actionData?.errors?.height}
                    >
                      <Input
                        id="height"
                        {...register("dimensions.height")}
                        type="number"
                        min="0"
                        step="0.1"
                        aria-invalid={errors.dimensions?.height ? "true" : "false"}
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to={`/dashboard/products/${product.id}`}
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
      </form>
    </div>
  );
}
