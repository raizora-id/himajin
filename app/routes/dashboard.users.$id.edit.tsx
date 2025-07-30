import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft, Save } from "lucide-react";
import { UserRole, getRoleLabel, getWarehousesFromUsers, mockUsers } from "~/features/dashboard/models/user.model";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Edit ${data?.user.name || 'User'} - POS System` },
    { name: "description", content: "Edit user information" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  // In a real app, this would fetch data from your database
  const user = mockUsers.find(u => u.id === id);
  
  if (!user) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "User not found",
    });
  }
  
  const warehouses = getWarehousesFromUsers();
  const roles = Object.values(UserRole);
  
  return json({ user, options: { warehouses, roles } });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { id } = params;
  const formData = await request.formData();
  
  // Extract form data
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phoneNumber = formData.get("phoneNumber")?.toString();
  const address = formData.get("address")?.toString();
  const role = formData.get("role")?.toString();
  const warehouseId = formData.get("warehouseId")?.toString() || undefined;
  const isActive = formData.get("isActive") === "true";
  
  // In a real app, this would validate and update the database
  // Here we'll just do basic validation
  const errors: Record<string, string> = {};
  
  if (!name || name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  
  if (!email || !email.includes("@")) {
    errors.email = "Valid email is required";
  }
  
  if (!role) {
    errors.role = "Role is required";
  }
  
  // Check for duplicate email (excluding current user)
  if (email) {
    const existingUser = mockUsers.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      errors.email = "Email is already in use by another user";
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, we would update the database here
  // Redirect to user detail page
  return redirect(`/dashboard/users/${id}`);
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

export default function EditUser() {
  const { user, options } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/dashboard/users/${user.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to User Details
        </Link>
        <h2 className="text-2xl font-bold">Edit User</h2>
      </div>
      
      <Form method="post" className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {/* User Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">User Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="name" 
                label="Full Name" 
                error={actionData?.errors?.name}
                required
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={user.name}
                  required
                />
              </FormField>
              
              <FormField 
                id="email" 
                label="Email Address" 
                error={actionData?.errors?.email}
                required
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={user.email}
                  required
                />
              </FormField>
              
              <FormField 
                id="phoneNumber" 
                label="Phone Number" 
                error={actionData?.errors?.phoneNumber}
              >
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={user.phoneNumber || ""}
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
                  defaultValue={user.isActive ? "true" : "false"}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </FormField>
              
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  id="address" 
                  label="Address" 
                  error={actionData?.errors?.address}
                >
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={user.address || ""}
                  />
                </FormField>
              </div>
            </div>
          </div>
          
          {/* Role & Permissions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Role & Permissions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="role" 
                label="User Role" 
                error={actionData?.errors?.role}
                required
              >
                <select
                  id="role"
                  name="role"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={user.role}
                  required
                >
                  <option value="">Select Role</option>
                  {options.roles.map(role => (
                    <option key={role} value={role}>
                      {getRoleLabel(role)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  The role defines what permissions the user will have in the system
                </p>
              </FormField>
              
              <FormField 
                id="warehouseId" 
                label="Warehouse Assignment" 
                error={actionData?.errors?.warehouseId}
              >
                <select
                  id="warehouseId"
                  name="warehouseId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={user.warehouseId || ""}
                >
                  <option value="">Global Access (All Warehouses)</option>
                  {options.warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Restrict user access to a specific warehouse location
                </p>
              </FormField>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Profile Image</h3>
            
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-24 h-24">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-24 w-24 rounded-full object-cover border border-border" 
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex-1">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    Drag and drop your image here, or click to select a file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP up to 1MB
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
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Note: Image upload is not functional in this demo
            </p>
          </div>
          
          {/* Password Management */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Password Management</h3>
            <p className="text-muted-foreground mb-4">
              Passwords can be reset from the user detail page by sending a password reset email
            </p>
            
            <Link
              to={`/dashboard/users/${user.id}/reset-password`}
              className="bg-muted text-foreground hover:bg-muted/80 h-9 px-4 py-2 rounded-md text-sm inline-flex items-center"
            >
              Send Password Reset Email
            </Link>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to={`/dashboard/users/${user.id}`}
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
