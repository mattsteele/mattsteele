import { getCollection } from "astro:content";

export const getPublishedWork = () =>
	getCollection("work", ({ data }) => !data.draft);
