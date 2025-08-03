import { useState, useEffect } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/input/input";
import { Label } from "../../../shared/ui/label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../shared/ui/accordion/accordion";
import { ImageWithFallback } from "../../../shared/ui/image-with-fallback/image-with-fallback";
import { useDataFetching } from "../../../shared/hooks/use-data-fetching";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { Check, Plus, Minus, Trash2, ShoppingCart, ChevronRight, ChevronLeft, Lock, CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import { useCart, type CartItem } from "../../../shared/stores/cart-store";
import { toast } from "sonner";

interface CheckoutWizardProps {
  onBack?: () => void;
  onNavigateToSuccess?: () => void;
  onNavigateToHome?: () => void;
  showSuccessPage?: boolean;
}

interface BillingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
}

const provinces = [
  { value: "aceh", label: "Aceh" },
  { value: "bali", label: "Bali" },
  { value: "banten", label: "Banten" },
  { value: "bengkulu", label: "Bengkulu" },
  { value: "diy", label: "DI Yogyakarta" },
  { value: "dki", label: "DKI Jakarta" },
  { value: "gorontalo", label: "Gorontalo" },
  { value: "jambi", label: "Jambi" },
  { value: "jabar", label: "Jawa Barat" },
  { value: "jateng", label: "Jawa Tengah" },
  { value: "jatim", label: "Jawa Timur" },
  { value: "kalbar", label: "Kalimantan Barat" },
  { value: "kalsel", label: "Kalimantan Selatan" },
  { value: "kaltara", label: "Kalimantan Utara" },
  { value: "kalteng", label: "Kalimantan Tengah" },
  { value: "kaltim", label: "Kalimantan Timur" },
  { value: "kepri", label: "Kepulauan Riau" },
  { value: "lampung", label: "Lampung" },
  { value: "maluku", label: "Maluku" },
  { value: "malut", label: "Maluku Utara" },
  { value: "ntb", label: "Nusa Tenggara Barat" },
  { value: "ntt", label: "Nusa Tenggara Timur" },
  { value: "papua", label: "Papua" },
  { value: "papbar", label: "Papua Barat" },
  { value: "riau", label: "Riau" },
  { value: "sulbar", label: "Sulawesi Barat" },
  { value: "sulsel", label: "Sulawesi Selatan" },
  { value: "sulteng", label: "Sulawesi Tengah" },
  { value: "sultra", label: "Sulawesi Tenggara" },
  { value: "sulut", label: "Sulawesi Utara" },
  { value: "sumbar", label: "Sumatera Barat" },
  { value: "sumsel", label: "Sumatera Selatan" },
  { value: "sumut", label: "Sumatera Utara" },
];

// Step definitions
const STEPS = [
  { id: "cart", title: "Keranjang Belanja", description: "Review dan edit item dalam keranjang Anda" },
  { id: "personal-info", title: "Data Diri", description: "Informasi pengiriman dan kontak" },
  { id: "review", title: "Review Pesanan", description: "Periksa detail pesanan sebelum checkout" }
];

// Success Page Component
function CheckoutSuccessPage({ 
  orderDetails, 
  onContinueShopping, 
  onOpenWhatsApp 
}: { 
  orderDetails: any; 
  onContinueShopping: () => void;
  onOpenWhatsApp: () => void;
}) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onOpenWhatsApp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onOpenWhatsApp]);

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">
            Pesanan Berhasil!
          </h1>
          <p className="text-gray-600 text-sm">
            Terima kasih telah berbelanja di PawsCare
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="text-gray-900 mb-3">
            Ringkasan Pesanan
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nama Pemesan:</span>
              <span className="text-gray-900">{orderDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Item:</span>
              <span className="text-gray-900">{orderDetails.totalItems} produk</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Pembayaran:</span>
              <span className="text-green-600 font-semibold">Rp {orderDetails.totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Metode Pembayaran:</span>
              <span className="text-gray-900">Cash on Delivery</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Konfirmasi via WhatsApp</span>
          </div>
          <p className="text-green-700 text-sm text-left">
            Anda akan diarahkan ke WhatsApp dalam <span className="font-semibold">{countdown} detik</span> untuk konfirmasi pesanan dengan tim kami.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onOpenWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Buka WhatsApp Sekarang
          </Button>
          
          <Button
            onClick={onContinueShopping}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            Lanjut Belanja
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Tim kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi pengiriman
          </p>
        </div>
      </div>
    </div>
  );
}

// WhatsApp message generator
function generateWhatsAppMessage(billingInfo: BillingInfo, cartItems: CartItem[], totalPrice: number): string {
  const getProvinceName = (provinceValue: string) => {
    const province = provinces.find(p => p.value === provinceValue);
    return province ? province.label : provinceValue;
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let message = `🛒 *PESANAN BARU - PawsCare*\\n`;
  message += `📅 ${currentDate}\\n\\n`;
  
  message += `👤 *DATA PELANGGAN*\\n`;
  message += `Nama: ${billingInfo.fullName}\\n`;
  message += `Telepon: ${billingInfo.phone}\\n`;
  message += `Alamat: ${billingInfo.address}\\n`;
  message += `Kota: ${billingInfo.city}\\n`;
  message += `Provinsi: ${getProvinceName(billingInfo.province)}\\n`;
  message += `Kode Pos: ${billingInfo.zipCode}\\n\\n`;
  
  message += `📦 *DETAIL PESANAN*\\n`;
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\\n`;
    message += `   Size: ${item.size}\\n`;
    message += `   Qty: ${item.quantity}x\\n`;
    message += `   Harga: Rp ${(item.price * item.quantity * 15000).toLocaleString('id-ID')}\\n\\n`;
  });
  
  message += `💰 *TOTAL PEMBAYARAN*\\n`;
  message += `Rp ${totalPrice.toLocaleString('id-ID')}\\n\\n`;
  
  message += `💳 *METODE PEMBAYARAN*\\n`;
  message += `Cash on Delivery (COD)\\n`;
  message += `💡 *Pembayaran dilakukan saat barang diterima*\\n\\n`;
  
  message += `✅ Mohon konfirmasi pesanan ini.\\n`;
  message += `📞 Kami akan menghubungi Anda untuk konfirmasi pengiriman.\\n\\n`;
  message += `Terima kasih telah berbelanja di PawsCare! 🐾`;

  return message;
}

// Cart Step Component
function CartStep() {
  const { items: cartItems, updateQuantity, removeItem, totalPrice } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast.success("Item dihapus dari keranjang");
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success("Item dihapus dari keranjang");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-900 mb-2">
          Keranjang Kosong
        </h3>
        <p className="text-gray-600 text-sm">
          Silakan tambahkan produk ke keranjang
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cartItems.map((item) => (
        <div key={item.id} className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-gray-900 text-sm leading-tight mb-1">
                {item.name}
              </h4>
              <p className="text-xs text-gray-500 mb-2">
                Size: {item.size}
              </p>
              <p className="text-primary text-sm font-medium">
                Rp {(item.price * 15000).toLocaleString('id-ID')}
              </p>
              
              {/* Mobile-optimized quantity controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-7 h-7 p-0 border-gray-300"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-7 h-7 p-0 border-gray-300"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="w-7 h-7 p-0 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Cart Summary */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total Pembayaran</span>
          <span className="text-lg text-primary font-semibold">Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
}

// Personal Information Step Component
function PersonalInfoStep({ 
  billingInfo, 
  setBillingInfo, 
  errors,
  clearError
}: { 
  billingInfo: BillingInfo; 
  setBillingInfo: (info: BillingInfo) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}) {
  const handleInputChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo({ ...billingInfo, [field]: value });
    // Clear the error for this field when user starts typing
    if (errors[field] && value.trim()) {
      clearError(field);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-900 text-sm">
          Nama Lengkap *
        </Label>
        <Input
          value={billingInfo.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className={`mt-1 bg-white border-gray-200 focus:border-primary ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Masukkan nama lengkap"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <Label className="text-gray-900 text-sm">
          Nomor Telepon *
        </Label>
        <Input
          type="tel"
          value={billingInfo.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`mt-1 bg-white border-gray-200 focus:border-primary ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Masukkan nomor telepon"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label className="text-gray-900 text-sm">
          Alamat Lengkap *
        </Label>
        <Input
          value={billingInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`mt-1 bg-white border-gray-200 focus:border-primary ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Masukkan alamat lengkap"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="text-gray-900 text-sm">
            Kota *
          </Label>
          <Input
            value={billingInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`mt-1 bg-white border-gray-200 focus:border-primary ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="Masukkan kota"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <Label className="text-gray-900 text-sm">
            Provinsi *
          </Label>
          <Select 
            value={billingInfo.province} 
            onValueChange={(value) => handleInputChange('province', value)}
          >
            <SelectTrigger className={`mt-1 bg-white border-gray-200 focus:border-primary ${errors.province ? 'border-red-500 focus:border-red-500' : ''}`}>
              <SelectValue placeholder="Pilih provinsi" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.value} value={province.value}>
                  {province.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.province && (
            <p className="text-red-500 text-xs mt-1">{errors.province}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-gray-900 text-sm">
          Kode Pos *
        </Label>
        <Input
          value={billingInfo.zipCode}
          onChange={(e) => handleInputChange('zipCode', e.target.value)}
          className={`mt-1 bg-white border-gray-200 focus:border-primary ${errors.zipCode ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Masukkan kode pos"
        />
        {errors.zipCode && (
          <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
        )}
      </div>
    </div>
  );
}

// Order Review Step Component
function OrderReviewStep({ 
  billingInfo, 
  cartItems 
}: { 
  billingInfo: BillingInfo; 
  cartItems: CartItem[];
}) {
  const { totalPrice } = useCart();

  const getProvinceName = (provinceValue: string) => {
    const province = provinces.find(p => p.value === provinceValue);
    return province ? province.label : provinceValue;
  };

  return (
    <div className="space-y-4">
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-gray-900 mb-3">
          Ringkasan Pesanan
        </h4>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.size} × {item.quantity}
                </p>
              </div>
              <p className="text-primary text-sm font-medium">
                Rp {(item.price * item.quantity * 15000).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Pembayaran</span>
            <span className="text-lg text-primary font-semibold">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-gray-900 mb-3">
          Alamat Pengiriman
        </h4>
        <div className="space-y-1 text-gray-700 text-sm">
          <p className="text-gray-900 font-medium">{billingInfo.fullName}</p>
          <p>{billingInfo.address}</p>
          <p>{billingInfo.city}, {getProvinceName(billingInfo.province)} {billingInfo.zipCode}</p>
          <p>Indonesia</p>
          <p className="text-primary">{billingInfo.phone}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-gray-900 mb-3">
          Metode Pembayaran
        </h4>
        <div className="flex items-center gap-3">
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center">
            COD
          </div>
          <div>
            <p className="text-gray-900 text-sm">Cash on Delivery</p>
            <p className="text-xs text-gray-500">Bayar tunai saat pesanan diterima</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Controls Component
function NavigationControls({ 
  currentStepIndex, 
  canGoNext, 
  canGoPrev, 
  onNext, 
  onPrev, 
  isLastStep,
  onComplete
}: {
  currentStepIndex: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={!canGoPrev}
        className="flex items-center gap-2 text-sm"
        size="sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Sebelumnya
      </Button>

      <div className="flex items-center gap-1">
        {STEPS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentStepIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {isLastStep ? (
        <Button
          onClick={onComplete}
          disabled={!canGoNext}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm"
          size="sm"
        >
          <Check className="w-4 h-4" />
          Pesan Sekarang
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 text-sm"
          size="sm"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// Custom Accordion Step Component
function AccordionStep({ 
  value, 
  isCompleted, 
  isActive, 
  stepNumber, 
  title, 
  description, 
  children,
  nextStepExists = true,
  isDisabled = false
}: {
  value: string;
  isCompleted: boolean;
  isActive: boolean;
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
  nextStepExists?: boolean;
  isDisabled?: boolean;
}) {
  return (
    <AccordionItem value={value} className="border-none">
      <div className="flex min-h-0">
        {/* Step Indicator Column */}
        <div className="flex flex-col items-center mr-3 w-6">
          {/* Step Circle */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all relative z-20 flex-shrink-0 ${
            isCompleted 
              ? "bg-green-500 text-white" 
              : isActive 
              ? "bg-primary text-white" 
              : isDisabled
              ? "bg-gray-100 text-gray-400"
              : "bg-gray-200 text-gray-500"
          }`}>
            {isCompleted ? (
              <Check className="w-3 h-3" />
            ) : isDisabled ? (
              <Lock className="w-2 h-2" />
            ) : (
              stepNumber
            )}
          </div>
          
          {/* Connecting line to next step */}
          {nextStepExists && (
            <div className="w-0.5 flex-1 relative mt-1 min-h-[40px]">
              {/* Gray background line */}
              <div className="absolute inset-0 bg-gray-200" />
              {/* Green overlay line - only if this step is completed */}
              {isCompleted && (
                <div className="absolute inset-0 bg-green-500" />
              )}
            </div>
          )}
        </div>
        
        {/* Content Column */}
        <div className="flex-1 pb-6 min-h-0">
          <div className={`border border-gray-200 rounded-xl bg-white ${isDisabled ? 'opacity-60' : ''}`}>
            <AccordionTrigger 
              className={`hover:no-underline py-3 px-4 transition-colors rounded-t-xl ${
                isDisabled 
                  ? 'cursor-not-allowed hover:bg-transparent' 
                  : 'hover:bg-gray-50/50'
              }`}
              disabled={isDisabled}
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm transition-colors ${
                    isCompleted ? "text-green-600" : isActive ? "text-primary" : isDisabled ? "text-gray-400" : "text-gray-900"
                  }`}>
                    {title}
                  </h3>
                  {isDisabled && (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <p className={`text-xs mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDisabled ? "Selesaikan langkah sebelumnya untuk melanjutkan" : description}
                </p>
              </div>
            </AccordionTrigger>
            {!isDisabled && (
              <AccordionContent className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-3">
                  {children}
                </div>
              </AccordionContent>
            )}
          </div>
        </div>
      </div>
    </AccordionItem>
  );
}

export function CheckoutWizard({ 
  onBack, 
  onNavigateToSuccess, 
  onNavigateToHome, 
  showSuccessPage = false 
}: CheckoutWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { items: cartItems, clearCart, totalPrice } = useCart();

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
  });

  // Simulate loading for consistency with other components
  const { data: isReady, loading, error } = useDataFetching({
    data: true,
    delay: 500,
  });

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validatePersonalInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!billingInfo.fullName.trim()) newErrors.fullName = 'Nama lengkap harus diisi';
    if (!billingInfo.phone.trim()) newErrors.phone = 'Nomor telepon harus diisi';
    if (!billingInfo.address.trim()) newErrors.address = 'Alamat harus diisi';
    if (!billingInfo.city.trim()) newErrors.city = 'Kota harus diisi';
    if (!billingInfo.province) newErrors.province = 'Provinsi harus diisi';
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = 'Kode pos harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepCompleted = (stepId: string): boolean => {
    switch (stepId) {
      case "cart":
        return cartItems.length > 0;
      case "personal-info":
        return completedSteps.includes("personal-info") || !!(
          billingInfo.fullName.trim() && 
          billingInfo.phone.trim() && 
          billingInfo.address.trim() && 
          billingInfo.city.trim() && 
          billingInfo.province && 
          billingInfo.zipCode.trim()
        );
      case "review":
        return false;
      default:
        return false;
    }
  };

  const canGoToStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) return true; // Cart is always accessible
    if (stepIndex === 1) return isStepCompleted("cart"); // Personal info requires cart items
    if (stepIndex === 2) return isStepCompleted("cart") && isStepCompleted("personal-info"); // Review requires both
    return false;
  };

  const canGoNext = (): boolean => {
    const currentStep = STEPS[currentStepIndex];
    if (!currentStep) return false;
    
    // Check if current step is completed and next step exists
    if (currentStepIndex >= STEPS.length - 1) return true; // Last step
    
    return isStepCompleted(currentStep.id) && canGoToStep(currentStepIndex + 1);
  };

  const canGoPrev = (): boolean => {
    return currentStepIndex > 0;
  };

  const goNext = () => {
    if (currentStepIndex === 1) { // Validate personal info before going to review
      if (!validatePersonalInfo()) {
        toast.error("Mohon lengkapi semua data yang diperlukan");
        return;
      }
      setCompletedSteps(prev => [...prev.filter(s => s !== "personal-info"), "personal-info"]);
    }
    
    if (canGoNext() && currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (canGoPrev()) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (!validatePersonalInfo()) {
      toast.error("Mohon lengkapi semua data yang diperlukan");
      setCurrentStepIndex(1); // Go back to personal info step
      return;
    }

    // Prepare order details for success page
    const orderData = {
      customerName: billingInfo.fullName,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: totalPrice,
      whatsappMessage: generateWhatsAppMessage(billingInfo, cartItems, totalPrice)
    };

    setOrderDetails(orderData);

    // Clear cart after generating message
    clearCart();
    
    // Navigate to success page
    onNavigateToSuccess?.();
  };

  const handleOpenWhatsApp = () => {
    if (orderDetails?.whatsappMessage) {
      const encodedMessage = encodeURIComponent(orderDetails.whatsappMessage);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Navigate back to home after opening WhatsApp
      setTimeout(() => {
        onNavigateToHome?.();
      }, 1000);
    }
  };

  // Single accordion behavior - only current step is open
  const openItems = [STEPS[currentStepIndex]?.id].filter(Boolean);

  const handleAccordionChange = (values: string[]) => {
    // Find which step was clicked
    const clickedStepId = values.find(value => !openItems.includes(value));
    if (clickedStepId) {
      const stepIndex = STEPS.findIndex(step => step.id === clickedStepId);
      if (stepIndex !== -1 && canGoToStep(stepIndex)) {
        setCurrentStepIndex(stepIndex);
      } else {
        // Show appropriate error message
        const stepIndexFromId = STEPS.findIndex(step => step.id === clickedStepId);
        if (stepIndexFromId === 1 && !isStepCompleted("cart")) {
          toast.error("Silakan tambahkan produk ke keranjang terlebih dahulu");
        } else if (stepIndexFromId === 2) {
          if (!isStepCompleted("cart")) {
            toast.error("Silakan tambahkan produk ke keranjang terlebih dahulu");
          } else if (!isStepCompleted("personal-info")) {
            toast.error("Silakan lengkapi data diri terlebih dahulu");
          }
        }
      }
    }
  };

  // Show success page if specified
  if (showSuccessPage && orderDetails) {
    return (
      <CheckoutSuccessPage
        orderDetails={orderDetails}
        onContinueShopping={() => onNavigateToHome?.()}
        onOpenWhatsApp={handleOpenWhatsApp}
      />
    );
  }

  // Check if cart is empty
  if (!loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">
              Keranjang Belanja Kosong
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Silakan tambahkan produk ke keranjang sebelum melakukan checkout
            </p>
            <Button 
              onClick={() => {
                const event = new CustomEvent('navigate-to-home');
                window.dispatchEvent(event);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl"
            >
              Lanjutkan Belanja
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <CheckoutSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h3 className="text-lg text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-red-600 mb-4 text-sm">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Mobile-optimized container */}
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl text-gray-900 mb-2">Checkout</h1>
          <p className="text-sm text-gray-600">
            Selesaikan pesanan Anda dalam 3 langkah mudah
          </p>
          
          {/* Step Progress Header */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Langkah {currentStepIndex + 1} dari {STEPS.length}</span>
            <span>{STEPS[currentStepIndex]?.title}</span>
          </div>
        </div>

        {/* Checkout Steps */}
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={handleAccordionChange}
          className="space-y-4"
        >
          {STEPS.map((step, index) => (
            <AccordionStep
              key={step.id}
              value={step.id}
              isCompleted={isStepCompleted(step.id)}
              isActive={currentStepIndex === index}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              nextStepExists={index < STEPS.length - 1}
              isDisabled={!canGoToStep(index)}
            >
              {step.id === "cart" && <CartStep />}
              {step.id === "personal-info" && (
                <PersonalInfoStep
                  billingInfo={billingInfo}
                  setBillingInfo={setBillingInfo}
                  errors={errors}
                  clearError={clearError}
                />
              )}
              {step.id === "review" && (
                <OrderReviewStep
                  billingInfo={billingInfo}
                  cartItems={cartItems}
                />
              )}
            </AccordionStep>
          ))}
        </Accordion>

        {/* Navigation Controls */}
        <div className="mt-6">
          <NavigationControls
            currentStepIndex={currentStepIndex}
            canGoNext={canGoNext()}
            canGoPrev={canGoPrev()}
            onNext={goNext}
            onPrev={goPrev}
            isLastStep={currentStepIndex === STEPS.length - 1}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}