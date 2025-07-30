import { Link } from "@remix-run/react";
import { Building2 } from "lucide-react";

interface WarehouseLinkProps {
  id: string;
  name: string;
}

export function WarehouseLink({ id, name }: WarehouseLinkProps) {
  return (
    <Link 
      to={`/dashboard/warehouses/${id}`}
      className="text-primary hover:underline font-medium flex items-center gap-1"
    >
      <Building2 className="h-4 w-4" />
      {name}
    </Link>
  );
}
