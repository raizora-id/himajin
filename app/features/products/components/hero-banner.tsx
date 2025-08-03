import svgPaths from "../../../shared/ui/icons/icon-svg";

import { useDataFetching } from "../../../shared/hooks/use-data-fetching";
import { HeroBannersSkeleton } from "./hero-banner-skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../shared/ui/carousel/carousel";

interface Banner {
  image: string;
  title: string;
  subtitle: string;
}

const bannersData: Banner[] = [
  {
    image: "https://github.com/user-attachments/assets/5630d238-1a9e-42af-b281-ee57f938dea8",
    title: "Everyday Fresh &",
    subtitle: "Clean with Our Products"
  },
  {
    image: "https://github.com/user-attachments/assets/fa4a3ade-a409-4dd9-9066-7ac64872a361",
    title: "Make your Breakfast",
    subtitle: "Healthy and Easy"
  },
  {
    image: "https://github.com/user-attachments/assets/5630d238-1a9e-42af-b281-ee57f938dea8",
    title: "Premium Quality",
    subtitle: "Products for Your Pets"
  },
  {
    image: "https://github.com/user-attachments/assets/fa4a3ade-a409-4dd9-9066-7ac64872a361",
    title: "Organic & Natural",
    subtitle: "Food Selection"
  }
];

function ShopNowButton() {
  return (
    <div className="absolute bg-primary h-8 left-8 rounded translate-y-[-50%] w-24 flex items-center justify-center" style={{ top: "calc(50% + 40px)" }}>
      <div className="flex items-center gap-1">
        <span className="font-bold text-primary-foreground text-[11px] tracking-[0.5px]">
          Shop Now
        </span>
        <div className="flex items-center justify-center w-3 h-3">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 1">
            <g clipPath="url(#clip0_2_316)">
              <path d={svgPaths.p2a480380} fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_2_316">
                <rect fill="white" height="1" width="20.1556" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function BannerCard({ image, title, subtitle, className }: { image: string; title: string; subtitle: string; className?: string }) {
  return (
    <div className={`relative h-[200px] w-full overflow-clip rounded-[10px] ${className}`}>
      <div
        className="absolute bg-no-repeat bg-center bg-cover h-full left-0 rounded-[10px] top-0 w-full"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute h-[80px] left-8 top-8 right-8">
        <div className="absolute flex flex-col font-bold justify-center leading-[20px] left-0 text-foreground text-[16px] text-left top-[50%] translate-y-[-50%] max-w-[200px]">
          <p className="block mb-0">{title}</p>
          <p className="block">{subtitle}</p>
        </div>
      </div>
      <ShopNowButton />
    </div>
  );
}

export function HeroBanners() {
  const { data: banners, loading, error } = useDataFetching({ 
    data: bannersData,
    delay: 1500 
  });

  if (loading) {
    return <HeroBannersSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center mb-8">
        <p className="text-destructive">Failed to load banners: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {banners?.map((banner, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2">
              <BannerCard 
                image={banner.image}
                title={banner.title}
                subtitle={banner.subtitle}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}