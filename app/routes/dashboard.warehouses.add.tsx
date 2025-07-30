import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { mockUsers } from "~/features/dashboard/models/user.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";

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
  const isSubmitting = navigation.state === "submitting";
  
  const [hasLocationData, setHasLocationData] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [code, setCode] = useState<string>("");
  
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
      
      <Form method="post" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
            <div className="space-y-4">
              <FormField 
                id="name" 
                label="Warehouse Name" 
                error={actionData?.errors?.name}
                required
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                  placeholder="Main Warehouse"
                />
              </FormField>
              
              <FormField 
                id="city" 
                label="City" 
                error={actionData?.errors?.city}
                required
              >
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                  placeholder="Jakarta"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                />
              </FormField>
              
              <FormField 
                id="code" 
                label="Warehouse Code" 
                error={actionData?.errors?.code}
                required
              >
                <input
                  id="code"
                  name="code"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="JAK-01"
                />
                {city && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Code is auto-generated based on the city name. You can modify it if needed.
                  </p>
                )}
              </FormField>
              
              <FormField 
                id="capacity" 
                label="Capacity (units)" 
                error={actionData?.errors?.capacity}
                required
              >
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="1000"
                  required
                />
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
              
              <FormField 
                id="managerId" 
                label="Warehouse Manager" 
                error={actionData?.errors?.managerId}
              >
                <select
                  id="managerId"
                  name="managerId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue=""
                >
                  <option value="">None (Unassigned)</option>
                  {potentialManagers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
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
                error={actionData?.errors?.address}
                required
              >
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                  placeholder="Jl. Sudirman No. 123"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  id="province" 
                  label="Province" 
                  error={actionData?.errors?.province}
                  required
                >
                  <input
                    id="province"
                    name="province"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                    placeholder="DKI Jakarta"
                  />
                </FormField>
                
                <FormField 
                  id="postalCode" 
                  label="Postal Code" 
                  error={actionData?.errors?.postalCode}
                  required
                >
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                    placeholder="10220"
                  />
                </FormField>
              </div>
              
              <FormField 
                id="phone" 
                label="Phone Number" 
                error={actionData?.errors?.phone}
                required
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                  placeholder="+62-21-5551234"
                />
              </FormField>
              
              <FormField 
                id="email" 
                label="Email" 
                error={actionData?.errors?.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="warehouse@example.com"
                />
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
                  onChange={(e) => setHasLocationData(e.target.checked)}
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
                error={actionData?.errors?.latitude}
              >
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="-6.2088"
                  min="-90"
                  max="90"
                />
              </FormField>
              
              <FormField 
                id="longitude" 
                label="Longitude" 
                error={actionData?.errors?.longitude}
              >
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="106.8456"
                  min="-180"
                  max="180"
                />
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
          <Link
            to="/dashboard/warehouses"
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
                <Save className="w-4 h-4" />
                Create Warehouse
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
