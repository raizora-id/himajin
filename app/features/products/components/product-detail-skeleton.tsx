import React from "react";
import { Skeleton } from "../../../ui/skeleton/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="bg-white rounded-[8px] shadow-sm border border-[#e9e9e9] p-6">
        <div className="flex flex-col gap-8">
          {/* Product Images Skeleton */}
          <div className="w-full">
            {/* Desktop Layout - Thumbnail vertical, Main image on right */}
            <div className="hidden md:flex gap-4">
              {/* Thumbnail Gallery - Vertical (Desktop) */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-[80px] h-[80px] rounded-[8px]" />
                ))}
              </div>

              {/* Main Image (Desktop) */}
              <div className="flex-1">
                <Skeleton className="w-full aspect-square rounded-[8px]" />
              </div>
            </div>

            {/* Mobile Layout - Main image on top, Thumbnail horizontal below */}
            <div className="md:hidden">
              {/* Main Image (Mobile) */}
              <Skeleton className="w-full aspect-square rounded-[8px] mb-4" />

              {/* Thumbnail Gallery - Horizontal (Mobile) */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="flex-shrink-0 w-[60px] h-[60px] rounded-[6px]" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Information Skeleton */}
          <div className="w-full space-y-4 md:space-y-6">
            {/* Title */}
            <Skeleton className="h-6 md:h-8 w-3/4" />
            
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            {/* Specifications */}
            <div className="space-y-3 md:space-y-4 pb-4 md:pb-6 border-b border-[#e9e9e9]">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 md:w-20" />
                  <Skeleton className="h-4 w-2" />
                  <Skeleton className="h-4 w-28 md:w-32" />
                </div>
              ))}
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 md:h-7 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            
            {/* Size Selection */}
            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-16 h-9 rounded-[6px]" />
                ))}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="w-32 h-10 rounded-[6px]" />
              <Skeleton className="w-32 h-10 rounded-[6px]" />
            </div>
          </div>
        </div>

        {/* Product Tabs Skeleton */}
        <div className="mt-6 md:mt-8">
          <Skeleton className="w-full h-[300px] md:h-[400px] rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}