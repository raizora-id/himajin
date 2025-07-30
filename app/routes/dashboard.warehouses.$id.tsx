import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Edit, 
  Mail, 
  MapPin, 
  Package, 
  Percent, 
  Phone, 
  Trash2, 
  User
} from "lucide-react";
import { 
  mockWarehouses, 
  calculateCapacityPercentage, 
  getCapacityColorClass, 
  formatFullAddress 
} from "~/features/dashboard/models/warehouse.model";
import { mockUsers } from "~/features/dashboard/models/user.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Warehouse Details - POS System" },
    { name: "description", content: "View warehouse details" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const warehouseId = params.id;
  
  // Find warehouse by ID
  const warehouse = mockWarehouses.find(w => w.id === warehouseId);
  
  if (!warehouse) {
    throw new Response("Warehouse not found", { status: 404 });
  }
  
  // Get warehouse manager if available
  let manager = null;
  if (warehouse.managerId) {
    manager = mockUsers.find(u => u.id === warehouse.managerId);
  }
  
  // Get assigned staff
  const assignedStaff = mockUsers
    .filter(u => u.warehouseId === warehouse.id)
    .map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      email: u.email,
      phone: u.phoneNumber,
    }));
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return json({
    warehouse,
    manager,
    assignedStaff,
    capacityPercentage: calculateCapacityPercentage(warehouse),
    dates: {
      created: formatDate(warehouse.createdAt),
      updated: formatDate(warehouse.updatedAt),
    }
  });
};

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode; }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-muted rounded-md text-foreground">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function WarehouseDetail() {
  const { warehouse, manager, assignedStaff, capacityPercentage, dates } = useLoaderData<typeof loader>();
  const capacityColorClass = getCapacityColorClass(capacityPercentage);
  
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{warehouse.name}</h2>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                warehouse.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {warehouse.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-muted-foreground">{warehouse.code}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/dashboard/warehouses/${warehouse.id}/edit`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this warehouse? This action cannot be undone.")) {
                  // In a real app, we'd send a DELETE request here
                  console.log("Delete warehouse:", warehouse.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Warehouse Details */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Warehouse Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={<Building2 className="h-4 w-4" />}
                label="Warehouse Code"
                value={warehouse.code}
              />
              
              <DetailItem
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={formatFullAddress(warehouse)}
              />
              
              {warehouse.phone && (
                <DetailItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={warehouse.phone}
                />
              )}
              
              {warehouse.email && (
                <DetailItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={warehouse.email}
                />
              )}
              
              <DetailItem
                icon={<Calendar className="h-4 w-4" />}
                label="Created At"
                value={dates.created}
              />
              
              <DetailItem
                icon={<Calendar className="h-4 w-4" />}
                label="Updated At"
                value={dates.updated}
              />
              
              {manager && (
                <DetailItem
                  icon={<User className="h-4 w-4" />}
                  label="Manager"
                  value={
                    <Link 
                      to={`/dashboard/users/${manager.id}`}
                      className="text-primary hover:underline"
                    >
                      {manager.name}
                    </Link>
                  }
                />
              )}
              
              <DetailItem
                icon={<Package className="h-4 w-4" />}
                label="Capacity"
                value={new Intl.NumberFormat().format(warehouse.capacity) + " units"}
              />
              
              <DetailItem
                icon={<Package className="h-4 w-4" />}
                label="Used Capacity"
                value={new Intl.NumberFormat().format(warehouse.usedCapacity) + " units"}
              />
              
              <DetailItem
                icon={<Percent className="h-4 w-4" />}
                label="Capacity Usage"
                value={
                  <div className="flex items-center gap-2">
                    <div className="w-full max-w-[150px] h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${capacityPercentage < 50 ? 'bg-green-500' : capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${capacityPercentage}%` }}
                      />
                    </div>
                    <span className={capacityColorClass}>{capacityPercentage}%</span>
                  </div>
                }
              />
            </div>
          </div>
          
          {/* Location Map (Placeholder) */}
          {(warehouse.latitude && warehouse.longitude) && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-6">Location Map</h3>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">
                  Map placeholder for location at {warehouse.latitude}, {warehouse.longitude}
                </p>
              </div>
            </div>
          )}
          
          {/* Assigned Staff */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Assigned Staff</h3>
            
            {assignedStaff.length === 0 ? (
              <p className="text-muted-foreground">No staff assigned to this warehouse.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="font-semibold text-left p-3">Name</th>
                      <th className="font-semibold text-left p-3">Role</th>
                      <th className="font-semibold text-left p-3">Contact</th>
                      <th className="font-semibold text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedStaff.map((staff) => (
                      <tr key={staff.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-3">
                          <Link 
                            to={`/dashboard/users/${staff.id}`} 
                            className="font-medium hover:underline"
                          >
                            {staff.name}
                          </Link>
                        </td>
                        <td className="p-3 capitalize">{staff.role}</td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span>{staff.email}</span>
                            <span className="text-muted-foreground text-xs">{staff.phone}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            to={`/dashboard/users/${staff.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats/Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-base font-semibold mb-4">Warehouse Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  warehouse.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {warehouse.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Capacity</span>
                <span>{new Intl.NumberFormat().format(warehouse.capacity)} units</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Used Space</span>
                <span>{new Intl.NumberFormat().format(warehouse.usedCapacity)} units</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Available Space</span>
                <span>{new Intl.NumberFormat().format(warehouse.capacity - warehouse.usedCapacity)} units</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Usage Percentage</span>
                <span className={capacityColorClass}>{capacityPercentage}%</span>
              </div>
              
              <div className="pt-2">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${capacityPercentage < 50 ? 'bg-green-500' : capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/dashboard/warehouses/${warehouse.id}/edit`}
                className="bg-muted hover:bg-muted/80 w-full h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 justify-center"
              >
                <Edit className="h-4 w-4" />
                Edit Warehouse
              </Link>
              
              <Link
                to={`/dashboard/warehouses/${warehouse.id}/inventory`}
                className="bg-muted hover:bg-muted/80 w-full h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 justify-center"
              >
                <Package className="h-4 w-4" />
                View Inventory
              </Link>
              
              <button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 justify-center"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this warehouse? This action cannot be undone.")) {
                    // In a real app, we'd send a DELETE request here
                    console.log("Delete warehouse:", warehouse.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete Warehouse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
