import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

export const collections = {
	work: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/work', pattern: '**/*.md', }),
		schema: ({ image }) => z.object({
			title: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: image(),
			img_alt: z.string().optional(),
			external_site_link: z.string().optional(),
			work_with_company_url: z.string().optional(),
			work_with_company_name: z.string().optional(),
		}),
	}),
};
