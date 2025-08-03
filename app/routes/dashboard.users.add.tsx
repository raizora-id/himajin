import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { ArrowLeft, Plus } from "lucide-react";
import { UserRole, getRoleLabel, getWarehousesFromUsers, mockUsers } from "~/features/dashboard/models/user.model";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";

// Shadcn UI Components
import { Input } from "~/shared/ui/input/input";
import { Textarea } from "~/shared/ui/textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/ui/select/select";
import { Button } from "~/shared/ui/button/button";
import { Label } from "~/shared/ui/label/label";

// Define user schema using Zod for validation
const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Valid email address is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  passwordConfirm: z.string(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string().min(1, { message: "Role is required" }),
  warehouseId: z.string().optional(),
  isActive: z.boolean(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"], // Path of the error
});

type UserFormValues = z.infer<typeof userSchema>;

// FormField component for consistent form field styling and error display
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

export default function AddUser() {
  const { options } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();
  
  // Form refs for scroll-to-error functionality
  const formRef = useRef<HTMLFormElement>(null);
  
  // Set up form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      phoneNumber: "",
      address: "",
      role: "",
      warehouseId: "",
      isActive: true
    }
  });

  // Handle form submission
  const onSubmit = (data: UserFormValues) => {
    // Create FormData object for Remix action
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Submit the form
    submit(formData, { method: "post" });
  };

  // Handle validation errors and scroll to the first error field
  const onError = (errors: FieldErrors<UserFormValues>) => {
    console.error("Form validation errors:", errors);
    
    // Get first error field
    const errorKeys = Object.keys(errors) as Array<keyof UserFormValues>;
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const errorElement = document.getElementById(firstErrorKey.toString());
      
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus({ preventScroll: true });
      }
    }
  };
  
  // Check for server-side errors from action
  useEffect(() => {
    if (actionData?.errors) {
      // Loop through server-side errors and set them in react-hook-form
      Object.entries(actionData.errors).forEach(([key, value]) => {
        // This will show server-side errors in the UI
        setValue(key as any, getValues(key as any), { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      });
      
      // Scroll to first error
      const firstErrorKey = Object.keys(actionData.errors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus({ preventScroll: true });
      }
    }
  }, [actionData, setValue, getValues]);
  
  // Generate a random password suggestion
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Set both password fields
    setValue("password", password, { shouldValidate: true });
    setValue("passwordConfirm", password, { shouldValidate: true });
    
    return password;
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link to="/dashboard/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New User</h1>
        </div>
      </div>

      <Form ref={formRef} method="post" className="space-y-8" onSubmit={handleSubmit(onSubmit, onError)}>
        {/* User Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">User Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <FormField
              id="name"
              label="Name"
              error={errors.name?.message || actionData?.errors?.name}
              required
            >
              <Input
                id="name"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
              <input type="hidden" name="name" value={getValues("name")} />
            </FormField>
            
            {/* Email */}
            <FormField
              id="email"
              label="Email"
              error={errors.email?.message || actionData?.errors?.email}
              required
            >
              <Input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <input type="hidden" name="email" value={getValues("email")} />
            </FormField>
            
            {/* Phone Number */}
            <FormField
              id="phoneNumber"
              label="Phone Number"
              error={errors.phoneNumber?.message || actionData?.errors?.phoneNumber}
            >
              <Input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                aria-invalid={errors.phoneNumber ? "true" : "false"}
              />
              <input type="hidden" name="phoneNumber" value={getValues("phoneNumber") || ""} />
            </FormField>
            
            {/* Address */}
            <FormField
              id="address"
              label="Address"
              error={errors.address?.message || actionData?.errors?.address}
            >
              <Textarea
                id="address"
                rows={2}
                {...register("address")}
                aria-invalid={errors.address ? "true" : "false"}
              />
              <input type="hidden" name="address" value={getValues("address") || ""} />
            </FormField>
          </div>
        </div>
        
        {/* Access Control */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Access Control</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <FormField
              id="role"
              label="Role"
              error={errors.role?.message || actionData?.errors?.role}
              required
            >
              <Select 
                onValueChange={(value) => setValue("role", value, { shouldValidate: true })}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {options.roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="role" value={getValues("role")} />
            </FormField>
            
            {/* Warehouse */}
            <FormField
              id="warehouseId"
              label="Assigned Warehouse"
              error={errors.warehouseId?.message || actionData?.errors?.warehouseId}
            >
              <Select 
                onValueChange={(value) => setValue("warehouseId", value, { shouldValidate: true })}
              >
                <SelectTrigger id="warehouseId" className="w-full">
                  <SelectValue placeholder="No warehouse restriction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No warehouse restriction</SelectItem>
                  {options.warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="warehouseId" value={getValues("warehouseId") || ""} />
              <p className="text-xs text-muted-foreground mt-1">
                Restrict user access to a specific warehouse location
              </p>
            </FormField>
            
            {/* Status */}
            <FormField
              id="isActive"
              label="Status"
              error={errors.isActive?.message || actionData?.errors?.isActive}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="active" 
                    className="h-4 w-4"
                    {...register("isActive")}
                    value="true"
                    defaultChecked
                  />
                  <Label htmlFor="active" className="cursor-pointer">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="inactive" 
                    className="h-4 w-4"
                    {...register("isActive")}
                    value="false"
                  />
                  <Label htmlFor="inactive" className="cursor-pointer">Inactive</Label>
                </div>
                <input type="hidden" name="isActive" value={getValues("isActive").toString()} />
              </div>
            </FormField>
          </div>
        </div>
        
        {/* Password */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Set Password</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <FormField
              id="password"
              label="Password"
              error={errors.password?.message || actionData?.errors?.password}
              required
            >
              <Input
                type="password"
                id="password"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <input type="hidden" name="password" value={getValues("password")} />
            </FormField>
            
            {/* Password Confirmation */}
            <FormField
              id="passwordConfirm"
              label="Confirm Password"
              error={errors.passwordConfirm?.message || actionData?.errors?.passwordConfirm}
              required
            >
              <Input
                type="password"
                id="passwordConfirm"
                {...register("passwordConfirm")}
                aria-invalid={errors.passwordConfirm ? "true" : "false"}
              />
              <input type="hidden" name="passwordConfirm" value={getValues("passwordConfirm")} />
            </FormField>
          </div>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => generatePassword()}
            >
              Generate Secure Password
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
            <Link to="/dashboard/users">
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
                Creating User...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create User
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}