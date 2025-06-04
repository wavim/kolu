import { defineConfig } from "vite";

import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
	server: {
		port: 5200,
	},
	build: {
		target: "esnext",
		outDir: "docs",
	},
	base: "",
	plugins: [ViteMinifyPlugin()],
});
