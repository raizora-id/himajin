import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

// export default function Index() {
// 	return (
// 		<div className="min-h-screen bg-[#ffffff]">
// 		<HeroBanners />
// 		<ProductGrid />
// 	  </div>
// 	)
// }

import { useState, useEffect } from "react";
import { HeroBanners } from "../features/products/components/hero-banner";
import { ProductGrid } from "../features/products/components/product-grid";
import { ProductDetail } from "../features/products/components/product-detail";
import { CheckoutWizard } from "../features/products/components/checkout-wizard";
import About from "../features/products/components/about";
import Footer from "../features/products/components/footer";
import { CartButton } from "./components/Cart";
import { HeaderBar } from "./components/HeaderBar";
import { BottomCartBar } from "./components/BottomCartBar";
import { HomeSkeleton } from "./components/ProductSkeleton";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { useDataFetching } from "./hooks/useDataFetching";

function AppContent() {
  const [currentView, setCurrentView] = useState<"home" | "product-detail" | "checkout" | "checkout-success" | "about">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("semua");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Simulate loading for home page
  const { loading: homeLoading } = useDataFetching({
    data: true,
    delay: 1000
  });

  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToCheckout = () => setCurrentView("checkout");
    const handleNavigateToCheckoutSuccess = () => setCurrentView("checkout-success");
    const handleNavigateToHome = () => setCurrentView("home");
    const handleNavigateToProductDetail = (e: CustomEvent) => {
      setSelectedProductId(e.detail.productId);
      setCurrentView("product-detail");
    };
    const handleNavigateToAbout = () => setCurrentView("about");
    
    window.addEventListener('navigate-to-checkout', handleNavigateToCheckout);
    window.addEventListener('navigate-to-checkout-success', handleNavigateToCheckoutSuccess);
    window.addEventListener('navigate-to-home', handleNavigateToHome);
    window.addEventListener('navigate-to-product-detail', handleNavigateToProductDetail as EventListener);
    window.addEventListener('navigate-to-about', handleNavigateToAbout);
    
    return () => {
      window.removeEventListener('navigate-to-checkout', handleNavigateToCheckout);
      window.removeEventListener('navigate-to-checkout-success', handleNavigateToCheckoutSuccess);
      window.removeEventListener('navigate-to-home', handleNavigateToHome);
      window.removeEventListener('navigate-to-product-detail', handleNavigateToProductDetail as EventListener);
      window.removeEventListener('navigate-to-about', handleNavigateToAbout);
    };
  }, []);

  const handleBack = () => {
    if (currentView !== "home") {
      setCurrentView("home");
      setSelectedProductId(null);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
    console.log("Searching for:", query);
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    // Implement filter functionality here
    console.log("Selected filter:", filterId);
  };

  const handleCartClick = () => {
    // Dispatch custom event to open cart
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  // Navigation functions
  const navigateToProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView("product-detail");
  };

  const navigateToCheckout = () => {
    setCurrentView("checkout");
  };

  const navigateToCheckoutSuccess = () => {
    setCurrentView("checkout-success");
  };

  const navigateToAbout = () => {
    setCurrentView("about");
  };

  const navigateToHome = () => {
    setCurrentView("home");
    setSelectedProductId(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="w-full max-w-[720px] mx-auto bg-white min-h-screen">
        {/* Header Bar */}
        <HeaderBar 
          onBack={handleBack}
          onSearch={handleSearch}
          onFilterSelect={handleFilterSelect}
          currentView={currentView}
        />

        {/* Content */}
        <div className="bg-white">
          {currentView === "home" ? (
            homeLoading ? (
              <HomeSkeleton />
            ) : (
              <div className="px-4 pb-8 mb-24">
                {/* Hero Banners */}
                <div className="pt-4">
                  <HeroBanners />
                </div>
                
                {/* Product Grid */}
                <ProductGrid 
                  searchQuery={searchQuery} 
                  selectedFilter={selectedFilter}
                  onProductClick={navigateToProductDetail}
                />
              </div>
            )
          ) : currentView === "product-detail" ? (
            <div className="bg-[#f8f8f8] min-h-screen">
              <ProductDetail 
                productId={selectedProductId}
                onBack={navigateToHome}
              />
            </div>
          ) : currentView === "about" ? (
            <About onBack={navigateToHome} />
          ) : currentView === "checkout-success" ? (
            <div className="bg-[#f8f8f8] min-h-screen">
              <CheckoutWizard 
                onBack={navigateToHome} 
                showSuccessPage={true}
                onNavigateToHome={navigateToHome}
              />
            </div>
          ) : (
            <div className="bg-[#f8f8f8] min-h-screen">
              <CheckoutWizard 
                onBack={navigateToHome} 
                onNavigateToSuccess={navigateToCheckoutSuccess}
              />
            </div>
          )}
        </div>
        
        {/* Footer - Show on all pages except checkout and product detail */}
        {(currentView === "home" || currentView === "about") && (
          <Footer onNavigateToAbout={navigateToAbout} />
        )}
        
        {/* Bottom Cart Bar - Hide on checkout success */}
        {currentView !== "checkout-success" && (
          <BottomCartBar 
            onCartClick={handleCartClick} 
            onCheckoutClick={navigateToCheckout}
          />
        )}
        
        {/* Hidden Cart Button - handles the cart sheet modal */}
        <div className="hidden">
          <CartButton onNavigateToCheckout={navigateToCheckout} />
        </div>

        {/* Development Navigation - Only show in home view */}
        {currentView === "home" && (
          <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
            <Button
              onClick={() => navigateToProductDetail("1")}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Product Detail
            </Button>
            <Button
              onClick={navigateToCheckout}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Checkout
            </Button>
            <Button
              onClick={navigateToAbout}
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              About Us
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster />
    </>
  );
}
