import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Pencil } from "lucide-react";
import { formatDate } from "~/shared/lib/utils";
import { UserRole, getRoleLabel, mockUsers } from "~/features/dashboard/models/user.model";

// Shadcn UI Components
import { Button } from "~/shared/ui/button/button";
import { Badge } from "~/shared/ui/badge/badge";
import { Separator } from "~/shared/ui/separator/separator";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.user.name || 'User Details'} - POS System` },
    { name: "description", content: "View user details" },
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
  
  return json({ user });
};

function DetailItem({ label, value, icon, className = "" }: { 
  label: string; 
  value: React.ReactNode; 
  icon?: React.ReactNode;
  className?: string 
}) {
  return (
    <div className={`${className}`}>
      <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}

export default function UserDetail() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 pl-0 hover:bg-transparent hover:text-foreground"
            asChild
          >
            <Link to="/dashboard/users" className="inline-flex items-center text-muted-foreground">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        
        <Button asChild className="inline-flex items-center gap-2">
          <Link to={`/dashboard/users/${user.id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit User
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-24 w-24 rounded-full mb-4" 
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
            
            <Badge variant="outline" className="mb-3">
              <span className={`inline-block rounded-full w-2 h-2 ${user.isActive ? "bg-green-500" : "bg-red-500"} mr-1.5`}></span>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
            
            <Badge variant="secondary" className={getRoleBadgeStyles(user.role as UserRole)}>
              {getRoleLabel(user.role as UserRole)}
            </Badge>
          </div>
          
          <div className="p-6 space-y-4">
            <Separator className="mb-4" />
            
            {user.phoneNumber && (
              <DetailItem 
                label="Phone" 
                value={user.phoneNumber}
                icon={<Phone className="h-3.5 w-3.5" />}
              />
            )}
            
            {user.address && (
              <DetailItem 
                label="Address" 
                value={user.address}
                icon={<MapPin className="h-3.5 w-3.5" />}
              />
            )}
            
            <DetailItem 
              label="Joined On" 
              value={formatDate(user.createdAt)}
              icon={<Calendar className="h-3.5 w-3.5" />}
            />
            
            {user.email && (
              <DetailItem 
                label="Email" 
                value={user.email}
                icon={<Mail className="h-3.5 w-3.5" />}
              />
            )}
          </div>
        </div>
        
        {/* User Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Role & Permissions */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Role & Permissions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem 
                  label="Role" 
                  value={
                    <Badge variant="secondary">
                      {getRoleLabel(user.role as UserRole)}
                    </Badge>
                  }
                />
                
                <DetailItem 
                  label="Warehouse Assignment" 
                  value={user.warehouseName || <span className="text-muted-foreground italic">Global Access (No specific warehouse)</span>}
                />
                
                <DetailItem 
                  label="Last Login" 
                  value={user.lastLoginAt ? formatDate(user.lastLoginAt) : <span className="text-muted-foreground italic">Never</span>}
                />
                
                <DetailItem 
                  label="Account Status" 
                  value={
                    <Badge variant={user.isActive ? "outline" : "secondary"} className={user.isActive ? "border-green-500 text-green-700" : "bg-red-100 hover:bg-red-100 text-red-700"}>
                      <span className={`inline-block rounded-full w-2 h-2 ${user.isActive ? "bg-green-500" : "bg-red-500"} mr-1.5`}></span>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  }
                />
              </div>
              
              <Separator className="my-6" />
              
              <h4 className="text-sm font-medium mb-4">Permissions</h4>
              
              <div className="space-y-4">
                {getPermissionsByRole(user.role as UserRole).slice(0, 4).map((permission, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`rounded-full w-5 h-5 flex items-center justify-center mt-0.5 ${permission.granted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {permission.granted ? '✓' : '✗'}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{permission.name}</h4>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/dashboard/users/${user.id}/permissions`}>
                    View All Permissions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Activity */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary hover:no-underline">
                  <Link to={`/dashboard/users/${user.id}/activity`}>
                    View All
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-5">
                {/* This would be real activity data in a real app */}
                {[
                  {
                    action: "Logged in",
                    date: user.lastLoginAt || new Date().toISOString(),
                    details: "Successful login from 192.168.1.1",
                    type: "login"
                  },
                  {
                    action: "Updated profile",
                    date: user.updatedAt,
                    details: "Changed contact information",
                    type: "update"
                  },
                  {
                    action: "Created invoice",
                    date: new Date(Date.now() - 86400000 * 2).toISOString(),
                    details: "Invoice #INV-2023-001",
                    type: "create"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5" 
                      style={{
                        backgroundColor: activity.type === "login" ? "#22c55e" : 
                                        activity.type === "update" ? "#3b82f6" : 
                                        "#8b5cf6"
                      }} 
                    />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <div className="flex items-center mt-1.5">
                        <Badge variant="outline" className="px-1.5 py-0 text-[0.65rem] font-normal border-muted-foreground/30">
                          {formatDate(activity.date)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty state if no activity */}
                {user.lastLoginAt === undefined && (
                  <div className="text-center py-8 border border-dashed rounded-md border-muted-foreground/30">
                    <p className="text-muted-foreground">No recent activity found for this user.</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Refresh Activity
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get role badge styling based on role
function getRoleBadgeStyles(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-purple-100 text-purple-800";
    case UserRole.MANAGER:
      return "bg-blue-100 text-blue-800";
    case UserRole.CASHIER:
      return "bg-green-100 text-green-800";
    case UserRole.INVENTORY:
      return "bg-amber-100 text-amber-800";
    case UserRole.STAFF:
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Helper function to get permission descriptions based on role
function getPermissionsByRole(role: UserRole): { name: string; description: string; granted: boolean }[] {
  const basePermissions = [
    {
      name: "Dashboard Access",
      description: "View main dashboard statistics",
      granted: true
    },
    {
      name: "Products View",
      description: "View product details and inventory",
      granted: true
    }
  ];
  
  switch (role) {
    case UserRole.ADMIN:
      return [
        ...basePermissions,
        {
          name: "User Management",
          description: "Create, edit, and delete system users",
          granted: true
        },
        {
          name: "Role Management",
          description: "Manage user roles and permissions",
          granted: true
        },
        {
          name: "System Settings",
          description: "Modify global system settings",
          granted: true
        },
        {
          name: "Reports & Analytics",
          description: "View and export system reports",
          granted: true
        },
        {
          name: "Financial Management",
          description: "View and manage financial records",
          granted: true
        },
        {
          name: "Warehouse Management",
          description: "Manage warehouses and transfers",
          granted: true
        }
      ];
    case UserRole.MANAGER:
      return [
        ...basePermissions,
        {
          name: "User Management",
          description: "Create, edit, and delete system users",
          granted: true
        },
        {
          name: "Role Management",
          description: "Manage user roles and permissions",
          granted: false
        },
        {
          name: "Reports & Analytics",
          description: "View and export system reports",
          granted: true
        },
        {
          name: "Financial Management",
          description: "View and manage financial records",
          granted: true
        },
        {
          name: "Warehouse Management",
          description: "Manage warehouses and transfers",
          granted: true
        }
      ];
    case UserRole.CASHIER:
      return [
        ...basePermissions,
        {
          name: "Sales Management",
          description: "Create and manage sales transactions",
          granted: true
        },
        {
          name: "Customer Management",
          description: "View and create customer profiles",
          granted: true
        },
        {
          name: "Reports & Analytics",
          description: "View and export system reports",
          granted: false
        },
        {
          name: "Financial Management",
          description: "View and manage financial records",
          granted: false
        }
      ];
    case UserRole.INVENTORY:
      return [
        ...basePermissions,
        {
          name: "Inventory Management",
          description: "Update stock quantities and locations",
          granted: true
        },
        {
          name: "Stock Transfers",
          description: "Create and manage stock transfers",
          granted: true
        },
        {
          name: "Reports & Analytics",
          description: "View and export system reports",
          granted: true
        },
        {
          name: "Product Management",
          description: "Create and edit product information",
          granted: true
        }
      ];
    case UserRole.STAFF:
      return [
        ...basePermissions,
        {
          name: "Sales Management",
          description: "Create and manage sales transactions",
          granted: false
        },
        {
          name: "Inventory Management",
          description: "Update stock quantities and locations",
          granted: false
        },
        {
          name: "Reports & Analytics",
          description: "View and export system reports",
          granted: false
        }
      ];
    default:
      return basePermissions;
  }
}
