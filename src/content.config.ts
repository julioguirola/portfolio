import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const experience = defineCollection({
  loader: file('src/content/experience.json'),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    location: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
    focus: z.enum(['backend', 'fullstack', 'devops']),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.json'),
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    distinction: z.string(),
    period: z.string(),
    startYear: z.number(),
    endYear: z.number().nullable(),
    highlights: z.array(z.string()),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.json'),
  schema: z.object({
    name: z.string(),
    category: z.enum(['backend', 'frontend', 'devops', 'database', 'other']),
  }),
});

export const collections = { experience, education, skills };
