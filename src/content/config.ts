import { defineCollection, z } from "astro:content";

const stackIconSchema = z.union([
    z.string(),
    z.object({
        light: z.string(),
        dark: z.string(),
    }),
]);

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        img: z.string(),
        description: z.string(),
        stack: z.array(stackIconSchema),
        category: z.enum([
            "FullStack",
            "Frontend",
            "Backend",
            "Multiplataforma",
        ]),
        isFeatured: z.boolean(),
        urls: z.object({
            demo: z.string().optional(),
            code: z.string().optional(),
        }),
    }),
});

export const collections = { projects };
