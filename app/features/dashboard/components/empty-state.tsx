import { Link } from "@remix-run/react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLink?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  showAction?: boolean; // Control whether to show the action button
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLink, 
  actionLabel,
  actionIcon: ActionIcon,
  showAction = true // Default to showing the action button if provided
}: EmptyStateProps) {
  return (
    <div className="py-8 text-center border border-dashed rounded-md">
      <div className="flex flex-col items-center gap-2">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground">
          {description}
        </p>
        {actionLink && actionLabel && showAction && (
          <Link
            to={actionLink}
            className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
          >
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
