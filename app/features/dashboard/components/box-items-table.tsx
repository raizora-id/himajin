import { Link } from "@remix-run/react";
import { Package2 } from "lucide-react";

interface BoxItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage?: string;
  productCategory?: string;
  productPrice?: number;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

interface BoxItemsTableProps {
  items: BoxItem[];
  formatDateTime: (dateString: string) => string;
}

export function BoxItemsTable({ items, formatDateTime }: BoxItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50">
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
  );
}
