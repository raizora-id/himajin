import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  size?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  total: number;
  totalPrice: number;
  itemCount: number;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

// Constants for calculation
const CURRENCY_MULTIPLIER = 15000; // Convert to Indonesian Rupiah

function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // No shipping or tax
  const totalPrice = total * CURRENCY_MULTIPLIER;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    subtotal,
    total,
    totalPrice,
    itemCount
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      subtotal: 0,
      total: 0,
      totalPrice: 0,
      itemCount: 0,

      // Actions
      addItem: (item: Omit<CartItem, 'quantity'>) => {
        const { items } = get();
        const existingItem = items.find(cartItem => cartItem.id === item.id);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          newItems = [...items, { ...item, quantity: 1 }];
        }
        
        const calculations = calculateTotals(newItems);
        set({ items: newItems, ...calculations });
      },

      removeItem: (id: string) => {
        const { items } = get();
        const newItems = items.filter(item => item.id !== id);
        const calculations = calculateTotals(newItems);
        set({ items: newItems, ...calculations });
      },

      updateQuantity: (id: string, quantity: number) => {
        const { items } = get();
        const newItems = items.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0);
        
        const calculations = calculateTotals(newItems);
        set({ items: newItems, ...calculations });
      },

      clearCart: () => {
        set({ 
          items: [], 
          subtotal: 0, 
          total: 0, 
          totalPrice: 0, 
          itemCount: 0 
        });
      },
    }),
    {
      name: 'cart', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after rehydration
        if (state?.items) {
          const calculations = calculateTotals(state.items);
          state.subtotal = calculations.subtotal;
          state.total = calculations.total;
          state.totalPrice = calculations.totalPrice;
          state.itemCount = calculations.itemCount;
        }
      },
    }
  )
);

// Export constants for use in other components
export { CURRENCY_MULTIPLIER };

// Backward compatibility - create a hook that matches the old useCart interface
export const useCart = () => {
  const store = useCartStore();
  return store;
};