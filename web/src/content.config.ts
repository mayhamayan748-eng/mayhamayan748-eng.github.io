import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const l = z.object({ en: z.string(), ar: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    order: z.number(),
    featured: z.boolean().default(false),
    /** full: technique/architecture/sanitized metrics only. light: some details generalized. */
    nda: z.enum(['full', 'light', 'none']),
    title: l,
    summary: l,
    problem: l,
    approach: z.array(l),
    /** Generic pipeline stages, rendered as the architecture diagram. */
    pipeline: z.array(l).default([]),
    stack: z.array(z.string()),
    metrics: z
      .array(z.object({ label: l, value: z.string().nullable(), note: l.optional() }))
      .default([]),
    /** Cloudinary URLs; empty means a placeholder is rendered. Must be synthetic/blurred for NDA work. */
    media: z.array(z.object({ src: z.string(), alt: l })).default([]),
    repo: z.string().url().nullable().default(null),
    demo: z.string().url().nullable().default(null),
  }),
});

export const collections = { projects };
