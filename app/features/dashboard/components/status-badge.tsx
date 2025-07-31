import { Check, X } from "lucide-react";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

export function StatusBadge({ 
  isActive, 
  activeText = "Active", 
  inactiveText = "Inactive" 
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        isActive 
          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" 
          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
      }`}
    >
      {isActive ? (
        <>
          <Check className="mr-1 h-3 w-3" />
          {activeText}
        </>
      ) : (
        <>
          <X className="mr-1 h-3 w-3" />
          {inactiveText}
        </>
      )}
    </span>
  );
}
