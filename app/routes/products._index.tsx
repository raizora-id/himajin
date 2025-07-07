import { Link } from "@remix-run/react";

// Mock data for products
const products = [
  { id: 1, name: "Product 1", description: "Description of product 1", price: 19.99 },
  { id: 2, name: "Product 2", description: "Description of product 2", price: 29.99 },
  { id: 3, name: "Product 3", description: "Description of product 3", price: 39.99 },
  { id: 4, name: "Product 4", description: "Description of product 4", price: 49.99 },
  { id: 5, name: "Product 5", description: "Description of product 5", price: 59.99 },
];

export default function ProductIndex() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              <Link 
                to={`/products/${product.id}`} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
