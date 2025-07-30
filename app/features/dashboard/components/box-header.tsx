import { Package2 } from "lucide-react";
import { WarehouseLink } from "./warehouse-link";
import { StatusBadge } from "./status-badge";

interface BoxHeaderProps {
  code: string;
  name?: string;
  isActive: boolean;
  warehouse: {
    id: string;
    name: string;
  };
}

export function BoxHeader({ code, name, isActive, warehouse }: BoxHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package2 className="h-5 w-5 text-muted-foreground" />
          {code}
          {name && <span className="text-muted-foreground">({name})</span>}
        </h2>
        <div className="flex items-center gap-2">
          <WarehouseLink id={warehouse.id} name={warehouse.name} />
          <span className="text-muted-foreground">•</span>
          <StatusBadge isActive={isActive} />
        </div>
      </div>
    </div>
  );
}
