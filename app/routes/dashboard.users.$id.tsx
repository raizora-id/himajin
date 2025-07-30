import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Pencil } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { UserRole, getRoleLabel, mockUsers } from "~/features/dashboard/models/user.model";

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
          <Link
            to="/dashboard/users"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Users
          </Link>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        
        <Link
          to={`/dashboard/users/${user.id}/edit`}
          className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md gap-2 transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit User
        </Link>
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
            
            <div className="inline-block rounded-full px-3 py-1 text-xs mb-4 font-medium border border-border">
              <span className={`inline-block rounded-full w-2 h-2 ${user.isActive ? "bg-green-500" : "bg-red-500"} mr-1.5`}></span>
              {user.isActive ? "Active" : "Inactive"}
            </div>
            
            <div className={`inline-block rounded-full px-3 py-1 text-xs ${getRoleBadgeStyles(user.role as UserRole)}`}>
              {getRoleLabel(user.role as UserRole)}
            </div>
          </div>
          
          <div className="border-t border-border p-6 space-y-4">
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
              label="Created On" 
              value={formatDate(user.createdAt)}
              icon={<Calendar className="h-3.5 w-3.5" />}
            />
            
            <DetailItem 
              label="Last Updated" 
              value={formatDate(user.updatedAt)}
              icon={<Calendar className="h-3.5 w-3.5" />}
            />
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
                    <span className={`inline-block rounded-full px-2 py-1 text-xs ${getRoleBadgeStyles(user.role as UserRole)}`}>
                      {getRoleLabel(user.role as UserRole)}
                    </span>
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
                    <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  }
                />
              </div>
            </div>
          </div>
          
          {/* Permission Summary */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Permission Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {getPermissionsByRole(user.role as UserRole).map((permission, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-5 h-5 rounded-full ${permission.granted ? "bg-green-100" : "bg-red-100"} flex items-center justify-center mr-3 mt-0.5`}>
                      <span className={`text-sm ${permission.granted ? "text-green-600" : "text-red-600"}`}>
                        {permission.granted ? "✓" : "✕"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{permission.name}</p>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Activity */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Link 
                  to={`/dashboard/users/${user.id}/activity`} 
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {/* This would be real activity data in a real app */}
                {[
                  {
                    action: "Logged in",
                    date: user.lastLoginAt || new Date().toISOString(),
                    details: "Successful login from 192.168.1.1"
                  },
                  {
                    action: "Updated profile",
                    date: user.updatedAt,
                    details: "Changed contact information"
                  },
                  {
                    action: "Created invoice",
                    date: new Date(Date.now() - 86400000 * 2).toISOString(),
                    details: "Invoice #INV-2023-001"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex gap-4 p-3 rounded-md hover:bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Empty state if no activity */}
                {user.lastLoginAt === undefined && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity found for this user.</p>
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
