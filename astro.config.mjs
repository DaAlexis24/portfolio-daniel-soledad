// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
        build: {
            cssCodeSplit: true,
        },
    },

    image: {
        service: { entrypoint: "astro/assets/services/sharp" },
    },

    adapter: netlify(),
});
