import { Skeleton } from "../../../shared/ui/skeleton/skeleton";

export function BannerCardSkeleton() {
  return (
    <div className="relative h-[200px] w-full overflow-clip rounded-[10px]">
      <Skeleton className="absolute h-full w-full rounded-[10px]" />
      <div className="absolute h-[80px] left-8 top-8 right-8">
        <div className="absolute flex flex-col gap-2 justify-center left-0 top-[50%] translate-y-[-50%] max-w-[200px]">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
      <div className="absolute left-8 h-8 w-24 rounded" style={{ top: "calc(50% + 40px)", transform: "translateY(-50%)" }}>
        <Skeleton className="h-full w-full rounded" />
      </div>
    </div>
  );
}

export function HeroBannersSkeleton() {
  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <BannerCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}