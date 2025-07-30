import { Link, useLocation } from "@remix-run/react";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Warehouse, 
  Grid3X3, 
  ChevronDown,
  Home
} from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ to, icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active 
          ? "bg-sidebar-accent text-sidebar-primary font-medium" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  currentPath: string;
  basePath: string;
}

function NavGroup({ icon, label, children, defaultOpen = false, currentPath, basePath }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || currentPath.startsWith(basePath));
  const isActive = currentPath.startsWith(basePath);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors",
          isActive 
            ? "bg-sidebar-accent text-sidebar-primary font-medium" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="mt-1 ml-9 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h1 className="font-semibold text-xl">POS System</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <NavItem 
          to="/dashboard" 
          icon={<Home className="w-5 h-5" />} 
          label="Dashboard"
          active={currentPath === "/dashboard"}
        />

        <NavGroup 
          icon={<Package className="w-5 h-5" />} 
          label="Products" 
          currentPath={currentPath}
          basePath="/dashboard/products"
        >
          <NavItem 
            to="/dashboard/products" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="All Products"
            active={currentPath === "/dashboard/products"}
          />
          <NavItem 
            to="/dashboard/products/add" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="Add Product"
            active={currentPath === "/dashboard/products/add"}
          />
        </NavGroup>

        <NavGroup 
          icon={<Users className="w-5 h-5" />} 
          label="Users" 
          currentPath={currentPath}
          basePath="/dashboard/users"
        >
          <NavItem 
            to="/dashboard/users" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="All Users"
            active={currentPath === "/dashboard/users"}
          />
          <NavItem 
            to="/dashboard/users/add" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="Add User"
            active={currentPath === "/dashboard/users/add"}
          />
        </NavGroup>

        <NavGroup 
          icon={<ShoppingCart className="w-5 h-5" />} 
          label="Transactions" 
          currentPath={currentPath}
          basePath="/dashboard/transactions"
        >
          <NavItem 
            to="/dashboard/transactions" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="All Transactions"
            active={currentPath === "/dashboard/transactions"}
          />
        </NavGroup>

        <NavGroup 
          icon={<Warehouse className="w-5 h-5" />} 
          label="Warehouse" 
          currentPath={currentPath}
          basePath="/dashboard/warehouse"
        >
          <NavItem 
            to="/dashboard/warehouse" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="All Warehouses"
            active={currentPath === "/dashboard/warehouse"}
          />
        </NavGroup>

        <NavGroup 
          icon={<Grid3X3 className="w-5 h-5" />} 
          label="Box Management" 
          currentPath={currentPath}
          basePath="/dashboard/box"
        >
          <NavItem 
            to="/dashboard/box" 
            icon={<div className="w-2 h-2 rounded-full bg-current" />} 
            label="All Boxes"
            active={currentPath === "/dashboard/box"}
          />
        </NavGroup>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
