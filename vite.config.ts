import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
	plugins: [
		remix({
			ignoredRouteFiles: [
				"**/*.css",
				"**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
			],
		}),
		tsconfigPaths(),
	],
	assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
});
