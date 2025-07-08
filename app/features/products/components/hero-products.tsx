import imgBanner1Png from "../../assets/images/banner-1.png";
import imgBanner2Png from "../../assets/images/banner-2.png";
import { useDataFetching } from "../hooks/use-data-fetching";
import { HeroBannersSkeleton } from "./hero-products-skeleton";

interface Banner {
  image: string;
  title: string;
  subtitle: string;
}

const bannersData: Banner[] = [
  {
    image: imgBanner1Png,
    title: "Everyday Fresh &",
    subtitle: "Clean with Our Products"
  },
  {
    image: imgBanner2Png,
    title: "Make your Breakfast",
    subtitle: "Healthy and Easy"
  }
];

function ShopNowButton() {
  return (
    <div className="absolute bg-[#f53e32] h-8 left-8 rounded translate-y-[-50%] w-24 flex items-center justify-center" style={{ top: "calc(50% + 40px)" }}>
      <div className="flex items-center gap-1">
        <span className="font-['Quicksand:Bold',_sans-serif] font-bold text-[#ffffff] text-[11px] tracking-[0.5px]">
          Shop Now
        </span>
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
        <div className="absolute flex flex-col font-['Quicksand:Bold',_sans-serif] font-bold justify-center leading-[20px] left-0 text-[#253d4e] text-[16px] text-left top-[50%] translate-y-[-50%] max-w-[200px]">
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
      <div className="w-full max-w-[720px] mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load banners: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-4">
        {banners?.map((banner, index) => (
          <BannerCard 
            key={index}
            image={banner.image}
            title={banner.title}
            subtitle={banner.subtitle}
          />
        ))}
      </div>
    </div>
  );
}