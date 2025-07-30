import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";

interface BackNavigationProps {
  to: string;
  label: string;
}

export function BackNavigation({ to, label }: BackNavigationProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
    >
      <ArrowLeft className="mr-1 h-4 w-4" />
      {label}
    </Link>
  );
}
