// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
        build: {
            cssCodeSplit: true, // Separa CSS por página
        },
        ssr: {
            external: ["flowbite"], // Evita procesamiento innecesario
        },
    },

    adapter: netlify(),
});
