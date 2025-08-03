import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, Pencil } from "lucide-react";
import { formatCurrency, formatDate } from "~/shared/lib/utils";
import { mockProducts } from "~/features/dashboard/models/product.model";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.name || 'Product Details'} - POS System` },
    { name: "description", content: "View product details" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  // In a real app, this would fetch data from your database
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Product not found",
    });
  }
  
  return json({ product });
};

function DetailItem({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default function ProductDetail() {
  const { product } = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Link
            to="/dashboard/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Products
          </Link>
          <h2 className="text-2xl font-bold">{product.name}</h2>
        </div>
        
        <Link
          to={`/dashboard/products/${product.id}/edit`}
          className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md gap-2 transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit Product
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="bg-card rounded-lg border border-border overflow-hidden lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Product Name" value={product.name} />
              <DetailItem label="SKU" value={<span className="font-mono">{product.sku}</span>} />
              <DetailItem label="Price" value={formatCurrency(product.price)} />
              <DetailItem label="Cost" value={formatCurrency(product.cost)} />
              <DetailItem label="Profit" value={formatCurrency(product.price - product.cost)} />
              <DetailItem label="Category" value={product.category} />
              <DetailItem label="Brand" value={product.brand || "N/A"} />
              <DetailItem 
                label="Status" 
                value={
                  <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                } 
              />
              <div className="md:col-span-2">
                <DetailItem 
                  label="Description" 
                  value={product.description || "No description available"}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="object-contain w-full h-full p-4"
                />
              ) : (
                <div className="text-muted-foreground">No image</div>
              )}
            </div>
          </div>
          
          {/* Inventory */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory</h3>
              
              <div className="space-y-4">
                <DetailItem 
                  label="Stock Quantity" 
                  value={
                    <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                      product.stockQuantity > 20 
                        ? "bg-green-100 text-green-800" 
                        : product.stockQuantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {product.stockQuantity}
                    </span>
                  } 
                />
                <DetailItem label="Warehouse" value={product.warehouseName} />
                <DetailItem 
                  label="Box / Location" 
                  value={product.boxName || "Not assigned"} 
                />
                {product.barcode && (
                  <DetailItem 
                    label="Barcode" 
                    value={<span className="font-mono">{product.barcode}</span>} 
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Product Dimensions */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              
              <div className="space-y-4">
                {product.weight && (
                  <DetailItem 
                    label="Weight" 
                    value={`${product.weight} grams`} 
                  />
                )}
                
                {product.dimensions && (
                  <>
                    <DetailItem 
                      label="Dimensions" 
                      value={`${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              
              <div className="space-y-4">
                <DetailItem label="Created On" value={formatDate(product.createdAt)} />
                <DetailItem label="Last Updated" value={formatDate(product.updatedAt)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
