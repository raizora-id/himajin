import { useState, useEffect, useRef } from "react";
import { Button } from "../../ui/button/button";
import { ImageWithFallback } from "../../ui/image-with-fallback/image-with-fallback";
import { useCart } from "../../stores/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "../../ui/sheet/sheet";
import { Badge } from "../../ui/badge/badge";
import { Trash2, Plus, Minus, ShoppingCart, X, Check } from "lucide-react";

export function CartButton() {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOpenCart = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          ref={triggerRef}
          variant="outline" 
          size="sm" 
          className="relative font-medium border-border hover:bg-accent"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[440px] p-0 bg-white">
        <CartContent onClose={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function CartContent({ onClose }: { onClose?: () => void }) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectAll, setSelectAll] = useState(true);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const event = new CustomEvent('navigate-to-checkout');
      window.dispatchEvent(event);
      setIsCheckingOut(false);
      onClose?.();
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="px-4 py-5">
          <h2 className="text-lg font-semibold text-foreground">
            Keranjang Belanja
          </h2>
        </div>
        
        <SheetHeader className="sr-only">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            View and manage items in your shopping cart
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-2">
              Keranjang Anda kosong
            </h3>
            <p className="text-sm text-muted-foreground">
              Tambahkan produk untuk memulai belanja
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-5">
        <h2 className="text-lg font-semibold text-foreground">
          Keranjang Belanja
        </h2>
      </div>

      <SheetHeader className="sr-only">
        <SheetTitle>Shopping Cart</SheetTitle>
        <SheetDescription>
          Review and manage items in your shopping cart before checkout
        </SheetDescription>
      </SheetHeader>

      {/* Select All */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div 
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              selectAll ? 'bg-primary' : 'border-2 border-border'
            }`}
            onClick={() => setSelectAll(!selectAll)}
          >
            {selectAll && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <span className="text-base font-medium text-foreground">
            Pilih Semua
          </span>
          <span className="text-sm text-primary ml-auto font-medium">
            Checkout
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {items.map((item, index) => (
            <div key={item.id} className={`px-4 py-4 ${index !== items.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer mt-1 flex-shrink-0 ${
                    selectAll ? 'bg-primary' : 'border-2 border-border'
                  }`}
                >
                  {selectAll && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                
                {/* Product Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-foreground leading-tight pr-2 flex-1">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-primary text-xs font-medium">
                        Sisa {Math.floor(Math.random() * 20) + 5}
                      </span>
                    )}
                  </div>
                  
                  {/* Price and Discount */}
                  <div className="flex items-center gap-2 mb-3">
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </span>
                    )}
                    <div className="flex flex-col">
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-[11px] text-muted-foreground line-through leading-none">
                          Rp{(item.originalPrice * 15000).toLocaleString('id-ID')}
                        </div>
                      )}
                      <div className="text-sm font-bold text-foreground">
                        Rp{(item.price * 15000).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total and Checkout */}
      <div className="border-t border-border px-4 py-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-semibold text-foreground">
            Total:
          </span>
          <span className="text-xl font-bold text-foreground">
            Rp {(total * 15000).toLocaleString('id-ID')}
          </span>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 rounded-lg transition-colors text-base"
        >
          {isCheckingOut ? 'Memproses...' : 'Lanjutkan ke Checkout'}
        </button>
      </div>
    </div>
  );
}

export function Cart() {
  return <CartContent />;
}