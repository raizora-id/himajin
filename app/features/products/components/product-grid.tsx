import { useState } from "react";

import { useDataFetching } from "../../../shared/hooks/use-data-fetching";
import { ProductGridSkeleton } from "./product-skeleton";
import { useCart } from "../../../shared/stores/cart-store";
import { Button } from "../../../shared/ui/button/button";
import { ShoppingCart, Plus } from "lucide-react";
import { toast } from "sonner";

const images = {
  imgProduct11Jpg: "https://github.com/user-attachments/assets/bb08b99b-b582-4b65-ab7e-360f63cc71f9",
  imgDivProductRate: "https://github.com/user-attachments/assets/dbbb2cbf-8ffa-4b1f-9873-041f9ffe8dcb",
  imgProduct21Jpg: "https://github.com/user-attachments/assets/fec9f2b9-12b5-433e-899b-2c7001dc0376",
  imgProduct31Jpg: "https://github.com/user-attachments/assets/c393ba64-98f0-4e13-b2ec-3543319beebe",
  imgProduct41Jpg: "https://github.com/user-attachments/assets/fffcc00e-a6c7-44a8-a331-0b2254b6becf",
  imgProduct51Jpg: "https://github.com/user-attachments/assets/502ea919-99b2-4e67-b499-8c46b8928c79",
  imgProduct61Jpg: "https://github.com/user-attachments/assets/81d5dae9-12b3-4c95-8f65-8f5ce4acf0f0",
};

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  brand: string;
  image: string;
  filterCategory?: string; // Maps to filter categories
  isNew?: boolean;
  isProtein?: boolean;
  badge?: {
    text: string;
    color: string;
  };
}

const productsData: Product[] = [
  {
    id: 1,
    name: "Fresh organic villa farm lomon 500gm pack",
    category: "Snack",
    filterCategory: "makanan-ringan",
    price: 28.85,
    oldPrice: 32.8,
    rating: 4.0,
    brand: "NestFood",
    image: images.imgProduct11Jpg,
    badge: { text: "Hot", color: "bg-[#f74b81]" }
  },
  {
    id: 2,
    name: "Best snakes with hazel nut pack 200gm",
    category: "Hodo Foods",
    filterCategory: "makanan-ringan",
    price: 52.85,
    oldPrice: 55.8,
    rating: 3.5,
    brand: "Stouffer",
    image: images.imgProduct21Jpg,
    badge: { text: "Sale", color: "bg-[#67bcee]" }
  },
  {
    id: 3,
    name: "Organic fresh venila farm watermelon 5kg",
    category: "Snack",
    filterCategory: "makanan-ringan",
    price: 48.85,
    oldPrice: 52.8,
    rating: 4.0,
    brand: "StarKist",
    image: images.imgProduct31Jpg,
    badge: { text: "New", color: "bg-[#3bb77e]" },
    isNew: true
  },
  {
    id: 4,
    name: "Fresh organic apple 1kg simla marming",
    category: "Vegetables",
    filterCategory: "protein",
    price: 17.85,
    oldPrice: 19.8,
    rating: 4.0,
    brand: "NestFood",
    image: images.imgProduct41Jpg,
    isProtein: true
  },
  {
    id: 5,
    name: "Blue Diamond Almonds Lightly Salted Vegetables",
    category: "Pet Foods",
    filterCategory: "protein",
    price: 23.85,
    oldPrice: 25.8,
    rating: 4.0,
    brand: "NestFood",
    image: images.imgProduct51Jpg,
    badge: { text: "-14%", color: "bg-[#f59758]" },
    isProtein: true
  },
  {
    id: 6,
    name: "Chobani Complete Vanilla Greek Yogurt",
    category: "Hodo Foods",
    filterCategory: "protein",
    price: 54.85,
    oldPrice: 55.8,
    rating: 4.0,
    brand: "NestFood",
    image: images.imgProduct61Jpg,
    isProtein: true
  },
  {
    id: 7,
    name: "Premium Whey Protein Powder 1kg",
    category: "Protein",
    filterCategory: "protein",
    price: 89.99,
    oldPrice: 99.99,
    rating: 4.5,
    brand: "ProteinMax",
    image: images.imgProduct11Jpg,
    badge: { text: "New", color: "bg-[#00B14F]" },
    isNew: true,
    isProtein: true
  },
  {
    id: 8,
    name: "Organic Protein Bar Chocolate 12 Pack",
    category: "Protein",
    filterCategory: "aneka",
    price: 35.99,
    oldPrice: 42.99,
    rating: 4.2,
    brand: "NutriBar",
    image: images.imgProduct21Jpg,
    isProtein: true
  },
  {
    id: 9,
    name: "Natural Protein Smoothie Mix 500g",
    category: "Protein",
    filterCategory: "aneka",
    price: 28.99,
    oldPrice: 32.99,
    rating: 4.3,
    brand: "SmoothieBlend",
    image: images.imgProduct31Jpg,
    badge: { text: "Popular", color: "bg-[#FF7E1D]" },
    isProtein: true
  },
  {
    id: 10,
    name: "Fresh Orange Juice 1L Premium Quality",
    category: "Beverages",
    filterCategory: "minuman",
    price: 8.99,
    oldPrice: 10.99,
    rating: 4.1,
    brand: "FreshJuice",
    image: images.imgProduct41Jpg
  },
  {
    id: 11,
    name: "Coconut Water Natural 500ml",
    category: "Beverages",
    filterCategory: "minuman",
    price: 4.99,
    oldPrice: 6.99,
    rating: 4.4,
    brand: "TropicalFresh",
    image: images.imgProduct51Jpg,
    badge: { text: "Natural", color: "bg-[#3bb77e]" }
  },
  {
    id: 12,
    name: "Energy Drink Sport 250ml",
    category: "Beverages",
    filterCategory: "minuman",
    price: 3.99,
    oldPrice: 4.99,
    rating: 3.9,
    brand: "EnergyBoost",
    image: images.imgProduct61Jpg
  }
];

interface ProductCardProps {
  product: Product;
  onProductClick?: (productId: string) => void;
}

function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    setIsAdding(true);
    
    addItem({
      id: product.id.toString(),
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.oldPrice,
      category: product.category,
    });

    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const handleProductClick = () => {
    onProductClick?.(product.id.toString());
  };

  return (
    <div 
      className="bg-[#ffffff] w-full rounded-[15px] border border-transparent hover:border-[#ececec] transition-colors overflow-hidden flex flex-col group cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image Container */}
      <div className="relative bg-[#ffffff] h-[200px] p-4">
        <div className="w-full h-full rounded-[15px] overflow-hidden">
          <div
            className="w-full h-full bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url('${product.image}')` }}
          />
        </div>
        
        {/* Badge */}
        {product.badge && (
          <div className={`${product.badge.color} h-[28px] rounded-br-[20px] rounded-tl-[15px] w-[68px] flex items-center justify-center absolute top-0 left-0`}>
            <div className="font-['Lato:Regular',_sans-serif] not-italic text-[#ffffff] text-[12px] text-center">
              {product.badge.text}
            </div>
          </div>
        )}

        {/* Add to Cart Button - Hidden by default, shown on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            size="sm"
            className="bg-[#3bb77e] hover:bg-[#2a9d63] text-white w-8 h-8 p-0 rounded-full"
          >
            {isAdding ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col flex-1 px-4 pb-4 gap-2">
        {/* Product Category */}
        <div className="font-['Lato:Regular',_sans-serif] not-italic text-[#adadad] text-[12px]">
          {product.category}
        </div>
        
        {/* Product Name */}
        <div className="font-['Poppins:Medium',_sans-serif] not-italic text-[#2b2b2d] text-[14px] leading-[20px] tracking-[0.4px] line-clamp-2 min-h-[40px]">
          {product.name}
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <div className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#3bb77e] text-[18px]">
              ${product.price}
            </div>
            <div className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#adadad] text-[14px] [text-decoration-line:line-through]">
              ${product.oldPrice}
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            variant="outline"
            size="sm"
            className="border-[#3bb77e] text-[#3bb77e] hover:bg-[#3bb77e] hover:text-white h-8 px-3"
          >
            {isAdding ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProductGridProps {
  searchQuery?: string;
  selectedFilter?: string;
  onProductClick?: (productId: string) => void;
}

export function ProductGrid({ searchQuery = "", selectedFilter = "semua", onProductClick }: ProductGridProps) {
  const [localSelectedCategory, setLocalSelectedCategory] = useState("All");
  const { data: products, loading, error } = useDataFetching({ 
    data: productsData,
    delay: 2500 
  });

  const categories = ["All", "Milks & Dairies", "Coffes & Teas", "Pet Foods", "Meats", "Vegetables", "Fruits"];

  // Filter products based on search query and selected filter
  let filteredProducts = products || [];

  // Filter by search query
  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by header filter selection
  if (selectedFilter && selectedFilter !== "semua" && selectedFilter !== "filter") {
    if (selectedFilter === "protein") {
      filteredProducts = filteredProducts.filter(product => 
        product.isProtein && product.isNew
      );
    } else if (selectedFilter === "aneka") {
      filteredProducts = filteredProducts.filter(product => 
        product.isProtein
      );
    } else {
      filteredProducts = filteredProducts.filter(product =>
        product.filterCategory === selectedFilter
      );
    }
  }

  // Filter by local category selection (from ProductGrid categories)
  if (localSelectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(product =>
      product.category === localSelectedCategory
    );
  }

  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#253d4e] text-[20px] mb-2">
          Failed to load products
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-[#3bb77e] text-white rounded-lg hover:bg-[#2a9d63] transition-colors font-['Quicksand:SemiBold',_sans-serif] font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getFilterDisplayName = (filterId: string) => {
    switch (filterId) {
      case "protein":
        return "Baru di Kategori Protein";
      case "aneka":
        return "Aneka Protein";
      case "makanan-ringan":
        return "Makanan Ringan";
      case "minuman":
        return "Minuman";
      case "semua":
        return "Semua Produk";
      default:
        return "Produk";
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#253d4e] text-[28px] leading-[34px]">
            Popular Products
          </h2>
          {(searchQuery || selectedFilter !== "semua") && (
            <div className="text-sm text-[#7a7a7a]">
              {searchQuery && `"${searchQuery}" • `}
              {filteredProducts.length} produk
            </div>
          )}
        </div>
        
        {/* Category Filter (Local) */}
        <div className="flex flex-wrap gap-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setLocalSelectedCategory(category)}
              className={`font-['Quicksand:SemiBold',_sans-serif] font-semibold text-[15px] leading-[15px] pb-1 transition-colors relative ${
                localSelectedCategory === category
                  ? "text-[#3bb77e]"
                  : "text-[#7a7a7a] hover:text-[#3bb77e]"
              }`}
            >
              {category}
              {localSelectedCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3bb77e] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#7a7a7a] text-lg mb-2">Tidak ada produk ditemukan</div>
          <div className="text-[#adadad] text-sm">
            {searchQuery 
              ? `Coba sesuaikan pencarian untuk "${searchQuery}"` 
              : "Tidak ada produk yang cocok dengan filter yang dipilih"
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}