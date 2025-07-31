import { Calendar, Grid3x3, Layers, MapPin } from "lucide-react";
import { CapacityIndicator } from "./capacity-indicator";

interface BoxDetailProps {
  box: {
    code: string;
    name?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    location?: string;
    section?: string;
  };
  capacityPercentage: number;
  capacityColorClass: string;
  locationFormatted: string;
  formatDate: (date: string) => string;
}

export function BoxDetailCard({ 
  box, 
  capacityPercentage, 
  capacityColorClass,
  locationFormatted,
  formatDate 
}: BoxDetailProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Box Info */}
      <div className="bg-card rounded-lg p-5 border shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          Box Information
        </h3>
        
        <div className="space-y-4">
          {/* Box Code */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Grid3x3 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Box Code</div>
              <div className="font-medium">{box.code}</div>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">{locationFormatted}</div>
            </div>
          </div>
          
          {/* Section */}
          {box.section && (
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Section</div>
                <div className="font-medium">{box.section}</div>
              </div>
            </div>
          )}
          
          {/* Created Date */}
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">{formatDate(box.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Description & Capacity */}
      <div className="bg-card rounded-lg p-5 border shadow-sm">
        <h3 className="font-semibold mb-4">Box Details</h3>
        
        {/* Description */}
        {box.description ? (
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-1">Description</div>
            <div>{box.description}</div>
          </div>
        ) : (
          <div className="mb-6 text-muted-foreground italic">
            No description provided
          </div>
        )}
        
        {/* Capacity */}
        <div className="mt-auto">
          <div className="text-sm text-muted-foreground mb-2">Box Fill Status</div>
          <CapacityIndicator 
            percentage={capacityPercentage}
            colorClass={capacityColorClass}
            label="Capacity"
          />
        </div>
      </div>
    </div>
  );
}

// Import at top wasn't showing in preview
import { Package2 } from "lucide-react";
