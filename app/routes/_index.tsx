import type { MetaFunction } from "@remix-run/node";
import { HeroBanners } from "../features/products/components/hero-products";
import { ProductGrid } from "../features/products/components/product-grid";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div className="min-h-screen bg-[#ffffff]">
		<HeroBanners />
		<ProductGrid />
	  </div>
	)
}
