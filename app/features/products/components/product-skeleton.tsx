import { Skeleton } from "../../../shared/ui/skeleton/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#ffffff] w-full rounded-[15px] border border-transparent overflow-hidden flex flex-col">
      {/* Product Image Container */}
      <div className="relative bg-[#ffffff] h-[200px] p-4">
        <Skeleton className="w-full h-full rounded-[15px]" />
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col flex-1 px-4 pb-4 gap-2">
        {/* Product Category */}
        <Skeleton className="h-3 w-16" />
        
        {/* Product Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 mb-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20" />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}