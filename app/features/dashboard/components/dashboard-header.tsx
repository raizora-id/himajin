import { Bell, Search } from "lucide-react";
import { Form, useLocation, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/dashboard") return "Dashboard";
    
    if (path.startsWith("/dashboard/products")) {
      if (path.includes("/add")) return "Add Product";
      if (path.includes("/edit")) return "Edit Product";
      if (path.match(/\/dashboard\/products\/\d+$/)) return "Product Details";
      return "Products";
    }
    
    if (path.startsWith("/dashboard/users")) {
      if (path.includes("/add")) return "Add User";
      if (path.includes("/edit")) return "Edit User";
      if (path.match(/\/dashboard\/users\/\d+$/)) return "User Details";
      return "Users";
    }
    
    if (path.startsWith("/dashboard/transactions")) {
      if (path.match(/\/dashboard\/transactions\/\d+$/)) return "Transaction Details";
      return "Transactions";
    }
    
    if (path.startsWith("/dashboard/warehouse")) {
      if (path.match(/\/dashboard\/warehouse\/\d+$/)) return "Warehouse Details";
      return "Warehouses";
    }
    
    if (path.startsWith("/dashboard/box")) {
      if (path.match(/\/dashboard\/box\/\d+$/)) return "Box Details";
      return "Box Management";
    }
    
    return "Dashboard";
  };

  // Reset search value when changing routes
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchValue(currentSearch);
  }, [location.pathname, searchParams]);

  // Only show search on list pages
  const showSearch = () => {
    const path = location.pathname;
    return (
      path === "/dashboard/products" ||
      path === "/dashboard/users" ||
      path === "/dashboard/transactions" ||
      path === "/dashboard/warehouse" ||
      path === "/dashboard/box"
    );
  };

  return (
    <header className="border-b border-border h-16 px-6 flex items-center justify-between bg-background">
      <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        {showSearch() && (
          <Form method="get" className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-md bg-input-background border border-border w-64 text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Form>
        )}
        
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
