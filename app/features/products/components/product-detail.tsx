import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { Button } from "../../../ui/button/button";
import { Badge } from "../../../ui/badge/badge";
import { Separator } from "../../../ui/separator/separator";
import { useDataFetching } from "../hooks/use-data-fetching";
import { ProductDetailSkeleton } from "./product-detail-skeleton";
import { useCart } from "../../../stores/cart-store";
import { toast } from "sonner";

const images = {
  img9Jpg: "https://github.com/user-attachments/assets/16f5772a-9343-4669-a355-42d528d07886",
  img10Jpg: "https://github.com/user-attachments/assets/8f74fe92-8217-4a56-8f77-3b25d984f023",
  img11Jpg: "https://github.com/user-attachments/assets/970aff25-a79f-4ba2-b543-42eada120aca",
  img12Jpg: "https://github.com/user-attachments/assets/404ddd64-72c1-4004-9310-2c8292978dc1",
  img13Jpg: "https://github.com/user-attachments/assets/d084302c-ea90-4e3e-8ae2-9c37950ea885",
}

interface ProductDetailInfo {
  id: number;
  name: string;
  description: string;
  brand: string;
  flavour: string;
  dietType: string;
  weight: string;
  speciality: string;
  info: string;
  items: string;
  currentPrice: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  images: string[];
  sizes: Array<{
    label: string;
    value: string;
    selected?: boolean;
  }>;
}

const productDetailData: ProductDetailInfo = {
  id: 1,
  name: "Seeds Of Change Organic Quinoa, Brown",
  description: "Premium organic quinoa sourced from sustainable farms. Rich in protein and perfect for healthy meals.",
  brand: "ESTA BETTERU CO",
  flavour: "Super Saver Pack",
  dietType: "Vegetarian",
  weight: "200 Grams",
  speciality: "Gluten Free, Sugar Free",
  info: "Egg Free, Allergen-Free",
  items: "1",
  currentPrice: 120.25,
  originalPrice: 123.25,
  rating: 4.5,
  reviews: 128,
  images: [images.img9Jpg, images.img10Jpg, images.img11Jpg, images.img12Jpg, images.img13Jpg],
  sizes: [
    { label: "50kg", value: "50", selected: true },
    { label: "80kg", value: "80" },
    { label: "120kg", value: "120" },
    { label: "200kg", value: "200" },
  ]
};

function ProductImageCarousel({ images }: { images: string[] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToImage = (index: number) => {
    if (isAnimating || index === selectedImageIndex) return;
    setIsAnimating(true);
    setSelectedImageIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (distance > threshold) {
      nextImage();
    } else if (distance < -threshold) {
      prevImage();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="w-full">
      {/* Desktop Layout - Thumbnail vertical, Main image with carousel on right */}
      <div className="hidden md:flex gap-4">
        {/* Thumbnail Gallery - Vertical (Desktop) */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-[80px] h-[80px] rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                index === selectedImageIndex 
                  ? "border-primary" 
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <div
                className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-200 hover:scale-105"
                style={{ backgroundImage: `url('${image}')` }}
              />
            </button>
          ))}
        </div>

        {/* Main Image with Carousel (Desktop) */}
        <div className="flex-1">
          <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden aspect-square group">
            {/* Main Image */}
            <div
              className={`absolute inset-0 bg-center bg-contain bg-no-repeat transition-all duration-300 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{ backgroundImage: `url('${images[selectedImageIndex]}')` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedImageIndex
                      ? "bg-primary w-6"
                      : "bg-white/70 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Main image with carousel on top, Thumbnail horizontal below */}
      <div className="md:hidden">
        {/* Main Image with Carousel (Mobile) */}
        <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-4 aspect-square">
          {/* Main Image */}
          <div
            className={`absolute inset-0 bg-center bg-contain bg-no-repeat transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ backgroundImage: `url('${images[selectedImageIndex]}')` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-50"
          >
            <ChevronLeft size={16} className="text-gray-700" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-50"
          >
            <ChevronRight size={16} className="text-gray-700" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === selectedImageIndex
                    ? "bg-primary w-4"
                    : "bg-white/70 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Gallery - Horizontal (Mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-[60px] h-[60px] rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                index === selectedImageIndex 
                  ? "border-primary" 
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <div
                className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-200 hover:scale-105"
                style={{ backgroundImage: `url('${image}')` }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductInfo({ product }: { product: ProductDetailInfo }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes.find(s => s.selected)?.value || product.sizes[0].value);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    const selectedSizeLabel = product.sizes.find(s => s.value === selectedSize)?.label || '';
    
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedSize}`,
        name: product.name,
        image: product.images[0],
        price: product.currentPrice,
        originalPrice: product.originalPrice,
        category: "Organic Foods",
        size: selectedSizeLabel,
      });
    }

    toast.success(`${quantity} × ${product.name} (${selectedSizeLabel}) ditambahkan ke keranjang!`, {
      duration: 3000,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const discount = product.originalPrice > product.currentPrice 
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {product.brand}
          </Badge>
          {discount > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discount}%
            </Badge>
          )}
        </div>
        
        <div>
          <h1 className="text-gray-900 mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : i < product.rating
                      ? "fill-yellow-400/50 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                {product.rating} ({product.reviews} ulasan)
              </span>
            </div>
          </div>

          <p className="text-gray-600">
            {product.description}
          </p>
        </div>
      </div>

      <Separator />

      {/* Product Specifications */}
      <div className="space-y-4">
        <h3 className="text-gray-900">Spesifikasi Produk</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: "Rasa", value: product.flavour },
            { label: "Jenis Diet", value: product.dietType },
            { label: "Berat", value: product.weight },
            { label: "Keunggulan", value: product.speciality },
            { label: "Informasi", value: product.info },
          ].map((spec, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">
                {spec.label}
              </span>
              <span className="text-sm text-gray-700">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-primary">
            Rp {(product.currentPrice * 15000).toLocaleString('id-ID')}
          </span>
          {product.originalPrice > product.currentPrice && (
            <span className="text-lg text-gray-400 line-through">
              Rp {(product.originalPrice * 15000).toLocaleString('id-ID')}
            </span>
          )}
        </div>
        {discount > 0 && (
          <p className="text-sm text-green-600">
            Hemat Rp {((product.originalPrice - product.currentPrice) * 15000).toLocaleString('id-ID')}
          </p>
        )}
      </div>

      <Separator />

      {/* Size Selection */}
      <div className="space-y-3">
        <h3 className="text-gray-900">Ukuran/Berat</h3>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size) => (
            <Button
              key={size.value}
              variant={selectedSize === size.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize(size.value)}
              className="min-w-[60px]"
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="h-10 w-10 p-0 hover:bg-gray-50 rounded-none"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="h-10 w-12 flex items-center justify-center text-sm border-x border-gray-200">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              className="h-10 w-10 p-0 hover:bg-gray-50 rounded-none"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Total: Rp {(product.currentPrice * quantity * 15000).toLocaleString('id-ID')}
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full h-12"
          size="lg"
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Menambahkan...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Tambah ke Keranjang
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ProductDescription() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mt-8 p-6">
      <div className="space-y-4">
        <h3 className="text-gray-900">Deskripsi Produk</h3>
        
        <p className="text-gray-600 leading-relaxed">
          Seeds of Change Organic Quinoa adalah pilihan sempurna untuk gaya hidup sehat Anda. Diproduksi dari biji quinoa organik berkualitas tinggi yang ditanam secara berkelanjutan, produk ini kaya akan protein lengkap, serat, dan nutrisi penting lainnya.
        </p>
        
        <div className="space-y-3">
          <h4 className="text-gray-900">Keunggulan Produk</h4>
          <ul className="space-y-2 text-gray-600">
            <li>• 100% organik dan bebas pestisida</li>
            <li>• Sumber protein lengkap dengan 9 asam amino esensial</li>
            <li>• Bebas gluten dan cocok untuk vegetarian</li>
            <li>• Kaya serat dan rendah indeks glikemik</li>
            <li>• Dikemas dengan teknologi modern untuk menjaga kesegaran</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-gray-900">Cara Penyajian</h4>
          <p className="text-gray-600 leading-relaxed">
            Cuci quinoa hingga bersih, kemudian masak dengan perbandingan 1:2 (1 cangkir quinoa : 2 cangkir air). 
            Didihkan air, masukkan quinoa, kecilkan api dan masak selama 15-20 menit hingga air terserap sempurna.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProductDetail() {
  const { data: product, loading, error } = useDataFetching({
    data: productDetailData,
    delay: 2000
  });

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full max-w-[720px] mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-gray-900 mb-2">
              Gagal memuat detail produk
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-8">
          {/* Product Images */}
          <ProductImageCarousel images={product.images} />

          {/* Product Information */}
          <ProductInfo product={product} />
        </div>

        {/* Product Description */}
        <ProductDescription />
      </div>
    </div>
  );
}