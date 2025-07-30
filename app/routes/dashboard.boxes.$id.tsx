import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { 
  ArrowLeft, 
  Building2, 
  Edit, 
  Package2, 
  Trash2, 
  Boxes, 
  Calendar, 
  Check, 
  X,
  MapPin,
  Grid3x3,
  Layers
} from "lucide-react";
import { mockBoxes, calculateBoxCapacity, formatBoxLocation, getBoxCapacityColorClass } from "~/features/dashboard/models/box.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";
import { mockProducts } from "~/features/dashboard/models/product.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Box Details - POS System" },
    { name: "description", content: "View box details and inventory" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const boxId = params.id;
  
  // Find the box by ID
  const box = mockBoxes.find((box) => box.id === boxId);
  
  if (!box) {
    throw new Response("Box not found", { status: 404 });
  }
  
  // Find the warehouse for this box
  const warehouse = mockWarehouses.find((w) => w.id === box.warehouseId);
  
  if (!warehouse) {
    throw new Response("Warehouse not found", { status: 404 });
  }
  
  // Enhance box items with complete product details
  const itemsWithProductDetails = box.items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    return {
      ...item,
      productImage: product?.imageUrl || "",
      productCategory: product?.category || "",
      productPrice: product?.price || 0,
    };
  });
  
  return json({ 
    box, 
    warehouse,
    items: itemsWithProductDetails,
    capacityPercentage: calculateBoxCapacity(box),
    locationFormatted: formatBoxLocation(box)
  });
};

export default function BoxDetail() {
  const { 
    box, 
    warehouse,
    items,
    capacityPercentage,
    locationFormatted
  } = useLoaderData<typeof loader>();
  
  // Get capacity color class
  const capacityColorClass = getBoxCapacityColorClass(capacityPercentage);
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/dashboard/boxes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Boxes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package2 className="h-5 w-5 text-muted-foreground" />
              {box.code}
              {box.name && <span className="text-muted-foreground">({box.name})</span>}
            </h2>
            <div className="flex items-center gap-2">
              <Link 
                to={`/dashboard/warehouses/${warehouse.id}`}
                className="text-primary hover:underline font-medium flex items-center gap-1"
              >
                <Building2 className="h-4 w-4" />
                {warehouse.name}
              </Link>
              <span className="text-muted-foreground">•</span>
              <span 
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  box.isActive 
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                }`}
              >
                {box.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/dashboard/boxes/${box.id}/edit`}
              className="bg-muted text-foreground hover:bg-muted/80 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Box Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Box Information */}
        <div className="bg-card rounded-lg border border-border p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Box Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box Location */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-medium">{locationFormatted}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Section</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{box.section}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Row</h4>
                    <p className="text-base">{box.row}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Column</h4>
                    <p className="text-base">{box.column}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Level</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{box.level}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Box Status */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Capacity</h4>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base">
                        {box.usedCapacity} / {box.capacity} units
                      </span>
                      <span className={capacityColorClass}>
                        {capacityPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          capacityPercentage < 50
                            ? "bg-green-500"
                            : capacityPercentage < 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${capacityPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {box.isActive ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <p className="text-base text-green-600 dark:text-green-400">Active</p>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-500" />
                        <p className="text-base text-red-600 dark:text-red-400">Inactive</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{formatDate(box.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{formatDate(box.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Warehouse Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6">Warehouse</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Link 
                  to={`/dashboard/warehouses/${warehouse.id}`}
                  className="text-base font-medium text-primary hover:underline"
                >
                  {warehouse.name}
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Code</h4>
              <p className="text-base">{warehouse.code}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
              <p className="text-base">{warehouse.address}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">City</h4>
                <p className="text-base">{warehouse.city}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Province</h4>
                <p className="text-base">{warehouse.province}</p>
              </div>
            </div>
            
            <div>
              <Link
                to={`/dashboard/warehouses/${warehouse.id}`}
                className="block w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2 transition-colors"
              >
                View Warehouse
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Box Inventory */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Box Inventory</h3>
          
          <Link
            to={`/dashboard/boxes/${box.id}/items`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2 rounded-md inline-flex items-center gap-2 text-sm transition-colors"
          >
            <Boxes className="h-4 w-4" />
            Manage Items
          </Link>
        </div>
        
        {items.length > 0 ? (
          <div className="rounded-md border">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Product</th>
                    <th className="px-6 py-3 text-left font-medium">SKU</th>
                    <th className="px-6 py-3 text-left font-medium">Category</th>
                    <th className="px-6 py-3 text-left font-medium">Price</th>
                    <th className="px-6 py-3 text-left font-medium">Quantity</th>
                    <th className="px-6 py-3 text-left font-medium">Added At</th>
                    <th className="px-6 py-3 text-left font-medium">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.productImage ? (
                            <div className="h-8 w-8 rounded-md bg-muted/50 overflow-hidden">
                              <img 
                                src={item.productImage} 
                                alt={item.productName} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-muted/50 flex items-center justify-center">
                              <Package2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <Link 
                            to={`/dashboard/products/${item.productId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {item.productName}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                          {item.productSku}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.productCategory || <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        {item.productPrice ? (
                          <span>Rp {item.productPrice.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {item.quantity} units
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDateTime(item.addedAt)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDateTime(item.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed rounded-md">
            <div className="flex flex-col items-center gap-2">
              <Package2 className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No items in this box</h3>
              <p className="text-muted-foreground">
                Add items to this box to track inventory
              </p>
              <Link
                to={`/dashboard/boxes/${box.id}/items`}
                className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
              >
                <Boxes className="h-4 w-4" />
                Add Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
