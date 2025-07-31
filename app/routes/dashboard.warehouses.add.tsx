import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors } from "react-hook-form";
import { Button } from "~/ui/button/button";
import { Input } from "~/ui/input/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/ui/select/select";
import { Textarea } from "~/ui/textarea/textarea";
import { mockUsers } from "~/features/dashboard/models/user.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";

// Define Zod schema for form validation
const warehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  capacity: z.number().positive("Capacity must be a positive number"),
  isActive: z.boolean(),
  managerId: z.string().optional().or(z.literal("")),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90")
    .optional().nullable(),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180")
    .optional().nullable()
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

export const meta: MetaFunction = () => {
  return [
    { title: "Add New Warehouse - POS System" },
    { name: "description", content: "Create a new warehouse or branch" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get potential managers (users with manager or admin role)
  const potentialManagers = mockUsers.filter(user => 
    user.role === "manager" || user.role === "admin"
  ).map(user => ({
    id: user.id,
    name: user.name,
  }));
  
  return json({ potentialManagers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Extract form data
  const name = formData.get("name")?.toString();
  const code = formData.get("code")?.toString();
  const address = formData.get("address")?.toString();
  const city = formData.get("city")?.toString();
  const province = formData.get("province")?.toString();
  const postalCode = formData.get("postalCode")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();
  const capacity = Number(formData.get("capacity"));
  const isActive = formData.get("isActive") === "true";
  const managerId = formData.get("managerId")?.toString();
  const latitude = formData.get("latitude") ? Number(formData.get("latitude")) : undefined;
  const longitude = formData.get("longitude") ? Number(formData.get("longitude")) : undefined;
  
  // Validate the form data
  const errors: Record<string, string> = {};
  
  if (!name || name.trim() === "") {
    errors.name = "Name is required";
  }
  
  if (!code || code.trim() === "") {
    errors.code = "Code is required";
  } else if (
    mockWarehouses.some(w => w.code === code)
  ) {
    // Check for duplicate code (in a real app, this would be a DB query)
    errors.code = "Code is already in use by another warehouse";
  }
  
  if (!address || address.trim() === "") {
    errors.address = "Address is required";
  }
  
  if (!city || city.trim() === "") {
    errors.city = "City is required";
  }
  
  if (!province || province.trim() === "") {
    errors.province = "Province is required";
  }
  
  if (!postalCode || postalCode.trim() === "") {
    errors.postalCode = "Postal code is required";
  }
  
  if (!phone || phone.trim() === "") {
    errors.phone = "Phone number is required";
  }
  
  if (isNaN(capacity) || capacity <= 0) {
    errors.capacity = "Capacity must be a positive number";
  }
  
  if (email && !email.includes("@")) {
    errors.email = "Invalid email address";
  }
  
  if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
    errors.latitude = "Latitude must be between -90 and 90";
  }
  
  if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
    errors.longitude = "Longitude must be between -180 and 180";
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, create the warehouse in the database and get its new ID
  // For demo purposes, we'll just redirect back to the warehouses list
  
  return redirect("/dashboard/warehouses");
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

// Helper to generate unique warehouse code based on city
function generateWarehouseCode(city: string): string {
  if (!city) return "";
  
  // Take first 3 letters of the city, convert to uppercase
  const prefix = city.substring(0, 3).toUpperCase();
  
  // Find existing warehouses with this prefix
  const existingCodes = mockWarehouses
    .filter(w => w.code.startsWith(`${prefix}-`))
    .map(w => w.code);
  
  // Find the next available number
  let counter = 1;
  let newCode = `${prefix}-${String(counter).padStart(2, '0')}`;
  
  while (existingCodes.includes(newCode)) {
    counter++;
    newCode = `${prefix}-${String(counter).padStart(2, '0')}`;
  }
  
  return newCode;
}

export default function AddWarehouse() {
  const { potentialManagers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isNavigationSubmitting = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  
  const [hasLocationData, setHasLocationData] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [code, setCode] = useState<string>("");
  
  // Set up form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      phone: "",
      email: "",
      capacity: 1000,
      isActive: true,
      managerId: "",
      latitude: undefined,
      longitude: undefined
    }
  });
  
  // Handle form submission
  const onSubmit = (data: WarehouseFormValues) => {
    console.log("Form submitted with data:", data);
    
    // Create FormData to submit through Remix
    const formData = new FormData();
    
    // Add all form fields to FormData
    formData.append("name", data.name);
    formData.append("code", data.code);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("province", data.province);
    formData.append("postalCode", data.postalCode);
    formData.append("phone", data.phone);
    
    // Optional fields
    if (data.email) formData.append("email", data.email);
    
    formData.append("capacity", String(data.capacity));
    formData.append("isActive", String(data.isActive));
    
    if (data.managerId) formData.append("managerId", data.managerId);
    
    if (hasLocationData && data.latitude !== undefined && data.latitude !== null) {
      formData.append('latitude', data.latitude.toString());
    }
    
    if (hasLocationData && data.longitude !== undefined && data.longitude !== null) {
      formData.append('longitude', data.longitude.toString());
    }
    
    submit(formData, { method: 'post' });
  };
  
  // Handle validation errors and scroll to the first error field
  const onError = (errors: FieldErrors<WarehouseFormValues>) => {
    console.log("Form validation errors:", errors);
    
    // Get the first field with an error
    const firstError = Object.keys(errors)[0] as keyof WarehouseFormValues;
    
    // Find the element by ID and scroll to it
    if (firstError) {
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        // Scroll the element into view with smooth behavior
        setTimeout(() => {
          errorElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
          // Add focus for accessibility
          errorElement.focus({ preventScroll: true });
        }, 100);
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
  
  // Generate warehouse code based on city
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (newCity.trim() !== "") {
      setCode(generateWarehouseCode(newCity));
    } else {
      setCode("");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/dashboard/warehouses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Warehouses
        </Link>
        <h2 className="text-2xl font-bold">Add New Warehouse</h2>
        <p className="text-muted-foreground">Create a new warehouse or branch location</p>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} method="post" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
            <div className="space-y-4">
              <FormField 
                id="name" 
                label="Warehouse Name" 
                error={errors?.name?.message}
                required
              >
                <Input
                  id="name"
                  placeholder="Main Warehouse"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                <input type="hidden" name="name" />
              </FormField>
              
              <FormField 
                id="city" 
                label="City" 
                error={errors?.city?.message}
                required
              >
                <Input
                  id="city"
                  placeholder="Jakarta"
                  value={city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleCityChange(e.target.value);
                    setValue('city', e.target.value);
                    if (e.target.value.trim() !== "") {
                      const generatedCode = generateWarehouseCode(e.target.value);
                      setCode(generatedCode);
                      setValue('code', generatedCode);
                    } else {
                      setCode("");
                      setValue('code', "");
                    }
                  }}
                  aria-invalid={!!errors.city}
                />
                <input type="hidden" name="city" value={city} />
              </FormField>
              
              <FormField 
                id="code" 
                label="Warehouse Code" 
                error={errors?.code?.message}
                required
              >
                <Input
                  id="code"
                  placeholder="JAK-01"
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCode(e.target.value);
                    setValue('code', e.target.value);
                  }}
                  aria-invalid={!!errors.code}
                />
                <input type="hidden" name="code" value={code} />
                {city && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Code is auto-generated based on the city name. You can modify it if needed.
                  </p>
                )}
              </FormField>
              
              <FormField 
                id="capacity" 
                label="Capacity (units)" 
                error={errors?.capacity?.message}
                required
              >
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  {...register("capacity", { valueAsNumber: true })}
                  aria-invalid={!!errors.capacity}
                />
                <input type="hidden" name="capacity" value="1000" />
              </FormField>
              
              <FormField 
                id="isActive" 
                label="Status" 
                error={errors?.isActive?.message}
              >
                <Select 
                  onValueChange={(value: string) => setValue('isActive', value === 'true')}
                  defaultValue="true"
                >
                  <SelectTrigger id="isActive" aria-invalid={!!errors.isActive}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="isActive" value="true" />
              </FormField>
              
              <FormField 
                id="managerId" 
                label="Warehouse Manager" 
                error={errors?.managerId?.message}
              >
                <Select 
                  onValueChange={(value: string) => setValue('managerId', value)}
                  defaultValue=""
                >
                  <SelectTrigger id="managerId" aria-invalid={!!errors.managerId}>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Unassigned)</SelectItem>
                    {potentialManagers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="managerId" value="" />
              </FormField>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Location & Contact</h3>
            <div className="space-y-4">
              <FormField 
                id="address" 
                label="Address" 
                error={errors?.address?.message}
                required
              >
                <Textarea
                  id="address"
                  rows={3}
                  placeholder="Jl. Sudirman No. 123"
                  {...register("address")}
                  aria-invalid={!!errors.address}
                />
                <input type="hidden" name="address" />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  id="province" 
                  label="Province" 
                  error={errors?.province?.message}
                  required
                >
                  <Input
                    id="province"
                    placeholder="DKI Jakarta"
                    {...register("province")}
                    aria-invalid={!!errors.province}
                  />
                  <input type="hidden" name="province" />
                </FormField>
                
                <FormField 
                  id="postalCode" 
                  label="Postal Code" 
                  error={errors?.postalCode?.message}
                  required
                >
                  <Input
                    id="postalCode"
                    placeholder="10220"
                    {...register("postalCode")}
                    aria-invalid={!!errors.postalCode}
                  />
                  <input type="hidden" name="postalCode" />
                </FormField>
              </div>
              
              <FormField 
                id="phone" 
                label="Phone Number" 
                error={errors?.phone?.message}
                required
              >
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62-21-5551234"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
                <input type="hidden" name="phone" />
              </FormField>
              
              <FormField 
                id="email" 
                label="Email" 
                error={errors?.email?.message}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="warehouse@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                <input type="hidden" name="email" />
              </FormField>
            </div>
          </div>
        </div>
        
        {/* Location Data */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Location Coordinates</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={hasLocationData}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setHasLocationData(e.target.checked);
                    if (!e.target.checked) {
                      setValue('latitude', undefined);
                      setValue('longitude', undefined);
                    } else {
                      setValue('latitude', null);
                      setValue('longitude', null);
                    }
                  }}
                />
                Enable location data
              </label>
            </div>
          </div>
          
          {hasLocationData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="latitude" 
                label="Latitude" 
                error={errors?.latitude?.message}
              >
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="-6.2088"
                  min="-90"
                  max="90"
                  {...register("latitude", { valueAsNumber: true })}
                  aria-invalid={!!errors.latitude}
                />
                <input type="hidden" name="latitude" />
              </FormField>
              
              <FormField 
                id="longitude" 
                label="Longitude" 
                error={errors?.longitude?.message}
              >
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="106.8456"
                  min="-180"
                  max="180"
                  {...register("longitude", { valueAsNumber: true })}
                  aria-invalid={!!errors.longitude}
                />
                <input type="hidden" name="longitude" />
              </FormField>
              
              {/* Map selection placeholder */}
              <div className="md:col-span-2">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-3">
                      Map selection would appear here in the full implementation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      In a full implementation, you would be able to select a location on the map to automatically fill in the latitude and longitude.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!hasLocationData && (
            <div className="text-muted-foreground text-sm">
              Location data is not enabled. Enable it to add latitude and longitude coordinates for this warehouse.
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            asChild
          >
            <Link to="/dashboard/warehouses">
              Cancel
            </Link>
          </Button>
          
          <Button
            type="submit"
            disabled={isNavigationSubmitting}
            className="inline-flex items-center gap-2"
          >
            {isNavigationSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Warehouse
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
