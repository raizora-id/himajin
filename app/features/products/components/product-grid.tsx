import { useState } from "react";
import imgProduct11Jpg from "../../assets/images/product-1.jpg";
import imgProduct21Jpg from "../../assets/images/product-2.jpg";
import imgProduct31Jpg from "../../assets/images/product-3.jpg";
import imgProduct41Jpg from "../../assets/images/product-4.jpg";
import imgProduct51Jpg from "../../assets/images/product-5.jpg";
import imgProduct61Jpg from "../../assets/images/product-6.jpg";
import { useDataFetching } from "../hooks/use-data-fetching";
import { ProductGridSkeleton } from "./product-skeleton";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  brand: string;
  image: string;
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
    price: 28.85,
    oldPrice: 32.8,
    rating: 4.0,
    brand: "NestFood",
    image: imgProduct11Jpg,
    badge: { text: "Hot", color: "bg-[#f74b81]" }
  },
  {
    id: 2,
    name: "Best snakes with hazel nut pack 200gm",
    category: "Hodo Foods",
    price: 52.85,
    oldPrice: 55.8,
    rating: 3.5,
    brand: "Stouffer",
    image: imgProduct21Jpg,
    badge: { text: "Sale", color: "bg-[#67bcee]" }
  },
  {
    id: 3,
    name: "Organic fresh venila farm watermelon 5kg",
    category: "Snack",
    price: 48.85,
    oldPrice: 52.8,
    rating: 4.0,
    brand: "StarKist",
    image: imgProduct31Jpg,
    badge: { text: "New", color: "bg-[#3bb77e]" }
  },
  {
    id: 4,
    name: "Fresh organic apple 1kg simla marming",
    category: "Vegetables",
    price: 17.85,
    oldPrice: 19.8,
    rating: 4.0,
    brand: "NestFood",
    image: imgProduct41Jpg
  },
  {
    id: 5,
    name: "Blue Diamond Almonds Lightly Salted Vegetables",
    category: "Pet Foods",
    price: 23.85,
    oldPrice: 25.8,
    rating: 4.0,
    brand: "NestFood",
    image: imgProduct51Jpg,
    badge: { text: "-14%", color: "bg-[#f59758]" }
  },
  {
    id: 6,
    name: "Chobani Complete Vanilla Greek Yogurt",
    category: "Hodo Foods",
    price: 54.85,
    oldPrice: 55.8,
    rating: 4.0,
    brand: "NestFood",
    image: imgProduct61Jpg
  }
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-[#ffffff] w-full rounded-[15px] border border-transparent hover:border-[#ececec] transition-colors overflow-hidden flex flex-col">
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
        
        {/* Price */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#3bb77e] text-[18px]">
            ${product.price}
          </div>
          <div className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#adadad] text-[14px] [text-decoration-line:line-through]">
            ${product.oldPrice}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products, loading, error } = useDataFetching({ 
    data: productsData,
    delay: 2500 
  });

  const categories = ["All", "Milks & Dairies", "Coffes & Teas", "Pet Foods", "Meats", "Vegetables", "Fruits"];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products?.filter(product => product.category === selectedCategory);

  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full max-w-[720px] mx-auto px-4 py-8">
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 mb-8">
        <h2 className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#253d4e] text-[28px] leading-[33.6px]">
          Popular Products
        </h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`font-['Quicksand:SemiBold',_sans-serif] font-semibold text-[14px] leading-[14px] px-3 py-2 rounded transition-colors ${
                selectedCategory === category
                  ? "text-[#3bb77e] bg-[#3bb77e]/10"
                  : "text-[#253d4e] hover:text-[#3bb77e]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-5">
        {filteredProducts?.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
}