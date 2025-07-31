interface CapacityIndicatorProps {
  percentage: number;
  colorClass: string;
  label?: string;
  showPercentage?: boolean;
  width?: string;
}

export function CapacityIndicator({ 
  percentage, 
  colorClass,
  label = "Capacity",
  showPercentage = true,
  width = "w-full"
}: CapacityIndicatorProps) {
  return (
    <div className="space-y-1">
      {showPercentage && (
        <div className="flex justify-between text-xs font-medium">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`h-2 ${width} bg-muted rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
