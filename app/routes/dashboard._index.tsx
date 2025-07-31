import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { BarChart3, Package, ShoppingCart, Users, Warehouse, Grid3X3 } from "lucide-react";
import { StatCard, ModuleCard } from "~/features/dashboard/components";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - POS System" },
    { name: "description", content: "POS System Dashboard" },
  ];
};



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
