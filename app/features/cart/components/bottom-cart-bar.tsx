import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../stores/cart-store";

interface BottomCartBarProps {
  onCartClick?: () => void;
}

export function BottomCartBar({ onCartClick }: BottomCartBarProps) {
  const { items, totalPrice } = useCart();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Don't show the bar if cart is empty
  if (totalItems === 0) {
    return null;
  }

  const handleCartClick = () => {
    onCartClick?.();
  };

  return (
    <button
      onClick={handleCartClick}
      className="fixed bottom-4 left-4 right-4 max-w-[480px] mx-auto z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-3 flex items-center justify-between transition-colors shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          <div className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">Lihat Keranjang</span>
          <span className="text-xs opacity-90">
            {totalItems} Barang
          </span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-bold text-lg">
          Rp{totalPrice.toLocaleString('id-ID')}
        </div>
      </div>
    </button>
  );
}