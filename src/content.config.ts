import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'zod';

export const collections = {
	work: defineCollection({
		loader: glob({ base: './src/content/work', pattern: '**/*.md', }),
		schema: ({ image }) => z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: image(),
			img_alt: z.string(),
			external_site_link: z.string().optional(),
			work_with_company_url: z.string().optional(),
			work_with_company_name: z.string().optional(),
			draft: z.boolean().optional(),
	}).refine(
		(data) => {
			const hasUrl = !!data.work_with_company_url;
			const hasName = !!data.work_with_company_name;
			return hasUrl === hasName;
		},
		{ message: "work_with_company_url and work_with_company_name must both be set or both be omitted" }
	),
	}),
};
