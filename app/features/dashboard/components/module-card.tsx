import { Link } from "@remix-run/react";
import React from "react";

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

export function ModuleCard({ title, description, icon, to, color }: ModuleCardProps) {
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
