import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { ArrowLeft, Save } from "lucide-react";
import { UserRole, getRoleLabel, getWarehousesFromUsers, mockUsers } from "~/features/dashboard/models/user.model";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { Input } from "~/shared/ui/input/input";
import { Textarea } from "~/shared/ui/textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui/select/select";
import { Button } from "~/shared/ui/button/button";
import { Label } from "~/shared/ui/label/label";

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

// Define user schema using Zod for validation
const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Valid email address is required" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string().min(1, { message: "Role is required" }),
  warehouseId: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

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
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  
  // Set up form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      role: user.role,
      warehouseId: user.warehouseId || "",
      isActive: user.isActive,
    },
  });
  
  // Handle form submission
  const onSubmit = (data: UserFormValues) => {
    const formData = new FormData();
    
    // Add all form fields to FormData
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber || '');
    formData.append('address', data.address || '');
    formData.append('role', data.role);
    formData.append('warehouseId', data.warehouseId || '');
    formData.append('isActive', data.isActive.toString());
    
    submit(formData, { method: 'post' });
  };
  
  // Handle validation errors and scroll to the first error field
  const onError = (errors: FieldErrors<UserFormValues>) => {
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
      
      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} method="post" className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {/* User Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">User Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                id="name" 
                label="Full Name" 
                error={errors?.name?.message}
                required
              >
                <Input
                  id="name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                <input type="hidden" name="name" value={user.name} />
              </FormField>
              
              <FormField 
                id="email" 
                label="Email Address" 
                error={errors?.email?.message}
                required
              >
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                <input type="hidden" name="email" value={user.email} />
              </FormField>
              
              <FormField 
                id="phoneNumber" 
                label="Phone Number" 
                error={errors?.phoneNumber?.message}
              >
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber")}
                  aria-invalid={!!errors.phoneNumber}
                />
                <input type="hidden" name="phoneNumber" value={user.phoneNumber || ""} />
              </FormField>
              
              <FormField 
                id="isActive" 
                label="Status" 
                error={errors?.isActive?.message}
              >
                <Select 
                  onValueChange={(value) => setValue('isActive', value === 'true')}
                  defaultValue={user.isActive ? 'true' : 'false'}
                >
                  <SelectTrigger id="isActive" aria-invalid={!!errors.isActive}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="isActive" value={user.isActive ? 'true' : 'false'} />
              </FormField>
              
              <div className="col-span-1 md:col-span-2">
                <FormField 
                  id="address" 
                  label="Address" 
                  error={errors?.address?.message}
                >
                  <Textarea
                    id="address"
                    rows={3}
                    {...register("address")}
                    aria-invalid={!!errors.address}
                  />
                  <input type="hidden" name="address" value={user.address || ""} />
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
                error={errors?.role?.message}
                required
              >
                <Select 
                  onValueChange={(value) => setValue('role', value)}
                  defaultValue={user.role}
                >
                  <SelectTrigger id="role" aria-invalid={!!errors.role}>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.roles.map(role => (
                      <SelectItem key={role} value={role}>
                        {getRoleLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="role" value={user.role} />
                <p className="text-xs text-muted-foreground mt-1">
                  The role defines what permissions the user will have in the system
                </p>
              </FormField>
              
              <FormField 
                id="warehouseId" 
                label="Warehouse Assignment" 
                error={errors?.warehouseId?.message}
              >
                <Select 
                  onValueChange={(value) => setValue('warehouseId', value)}
                  defaultValue={user.warehouseId || ""}
                >
                  <SelectTrigger id="warehouseId" aria-invalid={!!errors.warehouseId}>
                    <SelectValue placeholder="Select Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Global Access (All Warehouses)</SelectItem>
                    {options.warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="warehouseId" value={user.warehouseId || ""} />
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
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  Select Image
                </Button>
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
            
            <Button
              variant="secondary"
              size="sm"
              asChild
            >
              <Link to={`/dashboard/users/${user.id}/reset-password`}>
                Send Password Reset Email
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            asChild
          >
            <Link to={`/dashboard/users/${user.id}`}>
              Cancel
            </Link>
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2"
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
