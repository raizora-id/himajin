import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { BarChart3, Package, ShoppingCart, Users, Warehouse, Grid3X3 } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - POS System" },
    { name: "description", content: "POS System Dashboard" },
  ];
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

function ModuleCard({ title, description, icon, to, color }: ModuleCardProps) {
  return (
    <Link 
      to={to}
      className="bg-card rounded-lg border border-border p-6 transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

export default function DashboardIndex() {
  // This would come from a loader function in a real application
  const stats = {
    totalSales: "Rp 12,458,000",
    totalOrders: 158,
    totalProducts: 523,
    totalCustomers: 1245
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          trend={{ value: 12.5, isPositive: true }}
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          trend={{ value: 5.8, isPositive: true }}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          trend={{ value: 2.1, isPositive: false }}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          trend={{ value: 8.3, isPositive: true }}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-amber-500"
        />
      </div>

      <h2 className="text-2xl font-bold pt-6">Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          title="Products"
          description="Manage your product inventory, prices, and details"
          icon={<Package className="w-6 h-6 text-white" />}
          to="/dashboard/products"
          color="bg-purple-500"
        />
        <ModuleCard
          title="Users"
          description="Manage staff, admins, and customer accounts"
          icon={<Users className="w-6 h-6 text-white" />}
          to="/dashboard/users"
          color="bg-amber-500"
        />
        <ModuleCard
          title="Transactions"
          description="View and manage sales transactions and history"
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          to="/dashboard/transactions"
          color="bg-green-500"
        />
        <ModuleCard
          title="Warehouse"
          description="Manage branch locations and warehouse inventory"
          icon={<Warehouse className="w-6 h-6 text-white" />}
          to="/dashboard/warehouse"
          color="bg-blue-500"
        />
        <ModuleCard
          title="Box Management"
          description="Manage storage locations and track item placement"
          icon={<Grid3X3 className="w-6 h-6 text-white" />}
          to="/dashboard/box"
          color="bg-rose-500"
        />
      </div>
    </div>
  );
}
