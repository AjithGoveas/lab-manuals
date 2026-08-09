import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const experiments = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experiments" }),
  schema: ({ image }) => z.object({
    subject: z.string(),
    subjectSlug: z.string(),
    experimentNumber: z.number(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    dataset: z.string().optional(),
    notebookUrl: z.string().optional(),
    vivaQuestions: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    results: z
      .array(
        z.object({
          label: z.string(),
          src: image(),
          alt: z.string().optional(),
          caption: z.string(),
        })
      )
      .optional(),
    metrics: z
      .array(
        z.object({
          epoch: z.number(),
          trainLoss: z.number(),
          testAccuracy: z.number().optional(),
          note: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { experiments };
