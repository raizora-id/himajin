import { Skeleton } from "../../shared/ui/skeleton/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="bg-white rounded-[8px] shadow-sm border border-[#e9e9e9] p-6">
        <Skeleton className="h-8 w-32 mb-8" />
        
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="ml-2 hidden sm:block">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-2 w-20" />
                </div>
                {index < 1 && (
                  <div className="w-16 sm:w-32 h-0.5 bg-[#e9e9e9] mx-4 sm:mx-8"></div>
                )}
              </div>
            ))}
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        
        {/* Form Content */}
        <div className="min-h-[400px] space-y-6">
          {/* Step Header */}
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#e9e9e9]">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}