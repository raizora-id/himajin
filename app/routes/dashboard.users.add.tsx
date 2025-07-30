import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft, Plus } from "lucide-react";
import { UserRole, getRoleLabel, getWarehousesFromUsers, mockUsers } from "~/features/dashboard/models/user.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Add New User - POS System" },
    { name: "description", content: "Create a new system user" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const warehouses = getWarehousesFromUsers();
  const roles = Object.values(UserRole);
  
  return json({ options: { warehouses, roles } });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Extract form data
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const passwordConfirm = formData.get("passwordConfirm")?.toString();
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
  
  // Check for duplicate email
  if (email) {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      errors.email = "Email is already in use by another user";
    }
  }
  
  // Password validation
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  
  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, we would save to the database here
  // For this mock version, we'll just redirect as if save was successful
  
  // Generate a mock ID for the new user
  const newId = `u${Math.floor(Math.random() * 10000)}`;
  
  // Redirect to users list
  return redirect("/dashboard/users");
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

export default function AddUser() {
  const { options } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // Generate a random password suggestion
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/dashboard/users"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Users
        </Link>
        <h2 className="text-2xl font-bold">Add New User</h2>
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
                  required
                  placeholder="Enter full name"
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
                  required
                  placeholder="email@example.com"
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
                  placeholder="+62-812-3456-7890"
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
                    placeholder="Enter address (optional)"
                  />
                </FormField>
              </div>
            </div>
          </div>
          
          {/* Account & Authentication */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Account & Authentication</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="password" 
                label="Password" 
                error={actionData?.errors?.password}
                required
              >
                <div className="flex gap-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const password = generatePassword();
                      const passwordInput = document.getElementById("password") as HTMLInputElement;
                      const confirmInput = document.getElementById("passwordConfirm") as HTMLInputElement;
                      if (passwordInput) passwordInput.value = password;
                      if (confirmInput) confirmInput.value = password;
                      
                      // Create a temporary textarea element to copy to clipboard
                      const textArea = document.createElement('textarea');
                      textArea.value = password;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                      
                      // Show copied notification (in a real app)
                      alert("Generated password copied to clipboard: " + password);
                    }}
                    className="bg-muted text-foreground hover:bg-muted/80 px-3 py-2 rounded-md text-sm whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters
                </p>
              </FormField>
              
              <FormField 
                id="passwordConfirm" 
                label="Confirm Password" 
                error={actionData?.errors?.passwordConfirm}
                required
              >
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                  placeholder="Confirm password"
                />
              </FormField>
              
              <div className="flex items-center col-span-2 mt-2">
                <input
                  id="sendEmail"
                  name="sendEmail"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  defaultChecked
                />
                <label htmlFor="sendEmail" className="ml-2 text-sm">
                  Send welcome email with login instructions
                </label>
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
                  required
                  defaultValue=""
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
                  defaultValue=""
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
            
            <div className="mt-6 p-4 bg-muted/50 border border-border rounded-md">
              <h4 className="text-sm font-medium mb-2">Permission Summary</h4>
              <p className="text-sm text-muted-foreground">
                Permissions will be automatically assigned based on the selected role.
                You can customize individual permissions after creating the user.
              </p>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Profile Image</h3>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
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
            <p className="text-xs text-muted-foreground mt-2">
              Note: Image upload is not functional in this demo
            </p>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/dashboard/users"
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
                Create User
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
