import { Link, useParams } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";

// Mock data for products - in a real app, this would come from a database
const products = [
  { id: 1, name: "Product 1", description: "Description of product 1", price: 19.99, longDescription: "This is a detailed description of product 1. It contains all the features, specifications, and other important information that a customer might want to know before making a purchase." },
  { id: 2, name: "Product 2", description: "Description of product 2", price: 29.99, longDescription: "This is a detailed description of product 2. It contains all the features, specifications, and other important information that a customer might want to know before making a purchase." },
  { id: 3, name: "Product 3", description: "Description of product 3", price: 39.99, longDescription: "This is a detailed description of product 3. It contains all the features, specifications, and other important information that a customer might want to know before making a purchase." },
  { id: 4, name: "Product 4", description: "Description of product 4", price: 49.99, longDescription: "This is a detailed description of product 4. It contains all the features, specifications, and other important information that a customer might want to know before making a purchase." },
  { id: 5, name: "Product 5", description: "Description of product 5", price: 59.99, longDescription: "This is a detailed description of product 5. It contains all the features, specifications, and other important information that a customer might want to know before making a purchase." },
];

// Loader function to get product data based on ID
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { productId } = params;
  
  // Find the product with the matching ID
  const product = products.find(p => p.id === Number(productId));
  
  // If product not found, throw a 404 response
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  // Return the product data
  return json({ product });
};

export default function ProductDetail() {
  const { product } = useParams();
  const productId = Number(useParams().productId);
  
  // Find the product with the matching ID from our mock data
  // In a real app, this would use data from the loader
  const productData = products.find(p => p.id === productId);
  
  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Product not found</h1>
        <p>Sorry, the product you are looking for does not exist.</p>
        <Link 
          to="/products" 
          className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/products" 
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        ← Back to Products
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
        <div className="text-2xl font-bold text-blue-600 mb-4">
          ${productData.price.toFixed(2)}
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{productData.longDescription}</p>
        </div>
        
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors font-bold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
