import { useState } from "react";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Button } from "../button/button";
import { Input } from "../input/input";

interface HeaderBarProps {
  onBack?: () => void;
  onSearch?: (query: string) => void;
  onFilterSelect?: (filterId: string) => void;
  currentView?: "home" | "product-detail" | "checkout" | "about";
}

export function HeaderBar({ onBack, onSearch, onFilterSelect, currentView = "home" }: HeaderBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("semua");

  const handleBackClick = () => {
    if (isSearchActive) {
      // If in search mode, exit search mode
      setIsSearchActive(false);
      setSearchQuery("");
      setSelectedFilter("semua");
      onSearch?.("");
      onFilterSelect?.("semua");
    } else {
      // If not in search mode, navigate back
      onBack?.();
    }
  };

  const handleSearchButtonClick = () => {
    setIsSearchActive(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterSelect?.(value);
  };

  // Show search mode if currently searching or if not on home page
  const showSearchMode = isSearchActive || currentView !== "home";

  if (showSearchMode) {
    // Search Active Mode - Show back button and search input
    return (
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-accent flex-shrink-0"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari lebih banyak di PawsCare..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-muted border-0 rounded-lg text-[14px] placeholder:text-muted-foreground focus:bg-white focus:ring-1 focus:ring-primary"
              autoFocus={isSearchActive}
            />
          </div>
        </div>

        {/* Filter Options - Show when on home and in search mode */}
        {currentView === "home" && (
          <div className="px-4 py-3 bg-white border-t border-border">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter Produk:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                <Button
                  variant={selectedFilter === "semua" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 py-2 h-8 text-xs whitespace-nowrap transition-colors ${
                    selectedFilter === "semua"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleFilterChange("semua")}
                >
                  Semua
                </Button>
                <Button
                  variant={selectedFilter === "protein" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 py-2 h-8 text-xs whitespace-nowrap transition-colors ${
                    selectedFilter === "protein"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleFilterChange("protein")}
                >
                  Baru di Kategori Protein
                </Button>
                <Button
                  variant={selectedFilter === "aneka" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 py-2 h-8 text-xs whitespace-nowrap transition-colors ${
                    selectedFilter === "aneka"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleFilterChange("aneka")}
                >
                  Aneka Protein
                </Button>
                <Button
                  variant={selectedFilter === "makanan-ringan" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 py-2 h-8 text-xs whitespace-nowrap transition-colors ${
                    selectedFilter === "makanan-ringan"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleFilterChange("makanan-ringan")}
                >
                  Makanan Ringan
                </Button>
                <Button
                  variant={selectedFilter === "minuman" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 py-2 h-8 text-xs whitespace-nowrap transition-colors ${
                    selectedFilter === "minuman"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleFilterChange("minuman")}
                >
                  Minuman
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default Mode - Show logo and search button (only on home page)
  return (
    <div className="bg-white border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground text-lg">🐾</span>
          </div>
          <div>
            <h1 className="text-foreground font-semibold">PawsCare</h1>
            <p className="text-muted-foreground text-xs">Pet care essentials</p>
          </div>
        </div>

        {/* Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:bg-accent rounded-full"
          onClick={handleSearchButtonClick}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}