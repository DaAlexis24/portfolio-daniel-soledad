import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        img: z.string(),
        description: z.string(),
        stack: z.array(z.string()).default([]),
        urls: z.object({
            demo: z.string(),
            code: z.string(),
        }),
    }),
});

export const collections = { projects };
