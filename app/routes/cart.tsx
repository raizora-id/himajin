import { Link } from "@remix-run/react";
import { useState } from "react";

// Mock cart data - in a real application, this would come from a session or context
const initialCartItems = [
  { id: 1, name: "Product 1", price: 19.99, quantity: 2 },
  { id: 3, name: "Product 3", price: 39.99, quantity: 1 },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link 
            to="/products" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-4">Product</th>
                  <th className="text-center py-4">Quantity</th>
                  <th className="text-right py-4">Price</th>
                  <th className="text-right py-4">Total</th>
                  <th className="text-right py-4"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4">
                      <Link to={`/products/${item.id}`} className="font-medium hover:text-blue-600 transition-colors">
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <div className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="md:w-1/2">
              <Link 
                to="/products" 
                className="inline-block text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
            
            <div className="md:w-1/3 bg-gray-50 p-6 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between mb-6 font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <Link 
                to="/checkout" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors text-center font-bold"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
