// @ts-check
import { defineConfig } from "astro/config";
// Import Tailwind CSS Vite plugin
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	integrations: [],

	vite: {
		plugins: [tailwindcss()],
	},
});
