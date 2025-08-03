import { useState } from "react";
import { Button } from "../../shared/ui/button/button";
import { Input } from "../../shared/ui/input/input";
import { Label } from "../../shared/ui/label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select/select";
import { Checkbox } from "../../shared/ui/checkbox/checkbox";
import { ImageWithFallback } from "../../shared/ui/image-with-fallback/image-with-fallback";
import { useDataFetching } from "../../shared/hooks/use-data-fetching";
import { CheckoutSkeleton } from "./checkout-skeleton";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  size: string;
  quantity: number;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingInfo extends BillingInfo {
  sameAsBilling: boolean;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Seeds Of Change Oraganic Quinoa, Brown",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop",
    price: 120.25,
    originalPrice: 123.25,
    size: "50kg",
    quantity: 1,
  },
  {
    id: "2",
    name: "Organic Almond Butter Natural",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
    price: 85.50,
    originalPrice: 90.00,
    size: "500g",
    quantity: 2,
  },
];

function CartSummary({ items }: { items: CartItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-4">
      <h3 className="font-['Segoe_UI:Semibold',_sans-serif] text-[18px] text-[#2b2b2d] mb-4">
        Order Summary
      </h3>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 border border-[#e9e9e9] rounded-[5px]">
            <div className="w-16 h-16 rounded-[5px] overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-['Segoe_UI:Regular',_sans-serif] text-[14px] text-[#2b2b2d] truncate">
                {item.name}
              </p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#7a7a7a]">
                Size: {item.size}
              </p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#7a7a7a]">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-['Poppins:SemiBold',_sans-serif] text-[16px] text-[#f53e32]">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              {item.originalPrice > item.price && (
                <p className="font-['Poppins:Regular',_sans-serif] text-[12px] text-[#7a7a7a] line-through">
                  ${(item.originalPrice * item.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#e9e9e9] pt-4 space-y-2">
        <div className="flex justify-between font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]">
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-['Poppins:SemiBold',_sans-serif] text-[18px] text-[#2b2b2d] border-t border-[#e9e9e9] pt-2">
          <span>Total:</span>
          <span className="text-[#f53e32]">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function BillingForm({ billingInfo, setBillingInfo }: { 
  billingInfo: BillingInfo; 
  setBillingInfo: (info: BillingInfo) => void;
}) {
  const handleInputChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo({ ...billingInfo, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-['Segoe_UI:Semibold',_sans-serif] text-[18px] text-[#2b2b2d] mb-4">
        Billing Information
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
            First Name
          </Label>
          <Input
            value={billingInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="mt-1 border-[#e9e9e9] rounded-[5px]"
            placeholder="Enter first name"
          />
        </div>
        <div>
          <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
            Last Name
          </Label>
          <Input
            value={billingInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="mt-1 border-[#e9e9e9] rounded-[5px]"
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div>
        <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
          Email Address
        </Label>
        <Input
          type="email"
          value={billingInfo.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="mt-1 border-[#e9e9e9] rounded-[5px]"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
          Phone Number
        </Label>
        <Input
          type="tel"
          value={billingInfo.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="mt-1 border-[#e9e9e9] rounded-[5px]"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
          Address
        </Label>
        <Input
          value={billingInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="mt-1 border-[#e9e9e9] rounded-[5px]"
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
            City
          </Label>
          <Input
            value={billingInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="mt-1 border-[#e9e9e9] rounded-[5px]"
            placeholder="Enter city"
          />
        </div>
        <div>
          <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
            State
          </Label>
          <Select value={billingInfo.state} onValueChange={(value: string) => handleInputChange('state', value)}>
            <SelectTrigger className="mt-1 border-[#e9e9e9] rounded-[5px]">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
              <SelectItem value="fl">Florida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
            ZIP Code
          </Label>
          <Input
            value={billingInfo.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className="mt-1 border-[#e9e9e9] rounded-[5px]"
            placeholder="Enter ZIP code"
          />
        </div>
        <div>
          <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
            Country
          </Label>
          <Select value={billingInfo.country} onValueChange={(value: string) => handleInputChange('country', value)}>
            <SelectTrigger className="mt-1 border-[#e9e9e9] rounded-[5px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function ShippingForm({ shippingInfo, setShippingInfo, billingInfo }: { 
  shippingInfo: ShippingInfo; 
  setShippingInfo: (info: ShippingInfo) => void;
  billingInfo: BillingInfo;
}) {
  const handleInputChange = (field: keyof ShippingInfo, value: string | boolean) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  const handleSameAsBilling = (checked: boolean) => {
    if (checked) {
      setShippingInfo({ ...billingInfo, sameAsBilling: true });
    } else {
      setShippingInfo({ ...shippingInfo, sameAsBilling: false });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-['Segoe_UI:Semibold',_sans-serif] text-[18px] text-[#2b2b2d] mb-4">
        Shipping Information
      </h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAsBilling"
          checked={shippingInfo.sameAsBilling}
          onCheckedChange={handleSameAsBilling}
        />
        <Label 
          htmlFor="sameAsBilling" 
          className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]"
        >
          Same as billing address
        </Label>
      </div>

      {!shippingInfo.sameAsBilling && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                First Name
              </Label>
              <Input
                value={shippingInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mt-1 border-[#e9e9e9] rounded-[5px]"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                Last Name
              </Label>
              <Input
                value={shippingInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="mt-1 border-[#e9e9e9] rounded-[5px]"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
              Address
            </Label>
            <Input
              value={shippingInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-1 border-[#e9e9e9] rounded-[5px]"
              placeholder="Enter street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                City
              </Label>
              <Input
                value={shippingInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="mt-1 border-[#e9e9e9] rounded-[5px]"
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                State
              </Label>
              <Select value={shippingInfo.state} onValueChange={(value: string) => handleInputChange('state', value)}>
                <SelectTrigger className="mt-1 border-[#e9e9e9] rounded-[5px]">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                ZIP Code
              </Label>
              <Input
                value={shippingInfo.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="mt-1 border-[#e9e9e9] rounded-[5px]"
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                Country
              </Label>
              <Select value={shippingInfo.country} onValueChange={(value: string) => handleInputChange('country', value)}>
                <SelectTrigger className="mt-1 border-[#e9e9e9] rounded-[5px]">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PaymentForm({ paymentMethod, setPaymentMethod }: { 
  paymentMethod: string; 
  setPaymentMethod: (method: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-['Segoe_UI:Semibold',_sans-serif] text-[18px] text-[#2b2b2d] mb-4">
        Payment Method
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            value="creditCard"
            checked={paymentMethod === 'creditCard'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-4 h-4 text-[#f53e32] border-[#e9e9e9] rounded-full"
          />
          <Label 
            htmlFor="creditCard" 
            className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]"
          >
            Credit Card
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="paypal"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-4 h-4 text-[#f53e32] border-[#e9e9e9] rounded-full"
          />
          <Label 
            htmlFor="paypal" 
            className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]"
          >
            PayPal
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="cashOnDelivery"
            name="paymentMethod"
            value="cashOnDelivery"
            checked={paymentMethod === 'cashOnDelivery'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-4 h-4 text-[#f53e32] border-[#e9e9e9] rounded-full"
          />
          <Label 
            htmlFor="cashOnDelivery" 
            className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#2b2b2d]"
          >
            Cash on Delivery
          </Label>
        </div>
      </div>

      {paymentMethod === 'creditCard' && (
        <div className="space-y-4 mt-4 p-4 border border-[#e9e9e9] rounded-[5px] bg-[#f8f8f8]">
          <div>
            <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
              Card Number
            </Label>
            <Input
              placeholder="1234 5678 9012 3456"
              className="mt-1 border-[#e9e9e9] rounded-[5px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                Expiry Date
              </Label>
              <Input
                placeholder="MM/YY"
                className="mt-1 border-[#e9e9e9] rounded-[5px]"
              />
            </div>
            <div>
              <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
                CVV
              </Label>
              <Input
                placeholder="123"
                className="mt-1 border-[#e9e9e9] rounded-[5px]"
              />
            </div>
          </div>
          <div>
            <Label className="font-['Segoe_UI:Semibold',_sans-serif] text-[14px] text-[#2b2b2d]">
              Cardholder Name
            </Label>
            <Input
              placeholder="John Doe"
              className="mt-1 border-[#e9e9e9] rounded-[5px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Checkout() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    ...billingInfo,
    sameAsBilling: true,
  });

  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const { data: cartItems, loading, error } = useDataFetching({
    data: mockCartItems,
    delay: 1000,
  });

  const handlePlaceOrder = () => {
    // Simulate order placement
    alert('Order placed successfully!');
  };

  if (loading) {
    return <CheckoutSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full max-w-[720px] mx-auto px-4 py-8">
        <div className="bg-white rounded-[8px] shadow-sm border border-[#e9e9e9] p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#253d4e] text-[20px] mb-2">
              Failed to load checkout
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-[#3bb77e] text-white rounded-lg hover:bg-[#2a9d63] transition-colors font-['Quicksand:SemiBold',_sans-serif] font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="bg-white rounded-[8px] shadow-sm border border-[#e9e9e9] p-6">
        <h1 className="font-['Segoe_UI:Semibold',_sans-serif] text-[24px] text-[#2b2b2d] mb-8">
          Checkout
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            <BillingForm 
              billingInfo={billingInfo} 
              setBillingInfo={setBillingInfo} 
            />
            
            <ShippingForm 
              shippingInfo={shippingInfo} 
              setShippingInfo={setShippingInfo}
              billingInfo={billingInfo}
            />
            
            <PaymentForm 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod}
            />
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <CartSummary items={cartItems || []} />
            
            <Button 
              onClick={handlePlaceOrder}
              className="w-full bg-[#f53e32] hover:bg-[#e02d20] text-white font-['Manrope:Bold',_sans-serif] font-bold text-[16px] py-3 rounded-[5px] transition-colors"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}