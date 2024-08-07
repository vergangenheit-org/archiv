import { defineCollection, z } from "astro:content";

const seoSchema = z.object({
  title: z.string().min(5).max(120).optional(),
  description: z.string().min(15).max(160).optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string().optional()
    })
    .optional(),
  pageType: z.enum(["website", "article"]).default("website")
});

const artikel = defineCollection({
  schema: z.object({
    title: z.string(),
    publishedDate: z.coerce.date(),
    translatedDate: z.coerce.date(),
    description: z.string().optional(),
    publication: z.string(),
    tags: z.array(z.string()).default([]),
    source: z.object({ name: z.string(), url: z.string() }),
    seo: seoSchema.optional()
  })
});

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    seo: seoSchema.optional()
  })
});

export const collections = { artikel, pages };
