import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { 
  Package2, 
  Boxes
} from "lucide-react";
import { mockBoxes, calculateBoxCapacity, formatBoxLocation, getBoxCapacityColorClass } from "~/features/dashboard/models/box.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";
import { mockProducts } from "~/features/dashboard/models/product.model";
import {
  BackNavigation,
  BoxHeader,
  BoxDetailCard,
  BoxItemsTable,
  EmptyState
} from "~/features/dashboard/components";

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
      <BackNavigation to="/dashboard/boxes" label="Back to Boxes" />
      
      {/* Box Header */}
      <BoxHeader 
        code={box.code} 
        name={box.name} 
        isActive={box.isActive} 
        warehouse={warehouse} 
      />
      
      {/* Box Detail Card */}
      <BoxDetailCard 
        box={box}
        capacityPercentage={capacityPercentage}
        capacityColorClass={capacityColorClass}
        locationFormatted={locationFormatted}
        formatDate={formatDate}
      />
      
      {/* Box Items */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Box Contents</h3>
        
        {items.length > 0 ? (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <BoxItemsTable items={items} formatDateTime={formatDateTime} />
          </div>
        ) : (
          <EmptyState 
            icon={Package2} 
            title="No items in this box" 
            description="Add items to this box to track inventory"
            actionLink={`/dashboard/boxes/${box.id}/items`}
            actionLabel="Add Items"
            actionIcon={Boxes}
          />
        )}
      </div>
    </div>
  );
}
