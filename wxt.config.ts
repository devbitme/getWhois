import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	modules: ["@wxt-dev/module-svelte"],
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	manifest: {
		permissions: ["clipboardWrite", "tabs", "<all_urls>"],
		web_accessible_resources: [
			{
				resources: ["get-whois.html"],
				matches: ["<all_urls>"]
			}
		]
	}
});
