# mattsteele.dev

Personal portfolio site. Astro (static output) + TailwindCSS v4 (via Vite plugin) + Cloudflare Pages.

## Commands

- `npm run dev` — dev server at localhost:4321
- `npm run build` — production build to `./dist/`
- `npm run preview` — preview the production build locally
- `npm run check` — Astro type/diagnostic check (`@astrojs/check`)
- `npm run astro ...` — Astro CLI passthrough

## Package versions

Always keep dependencies on their latest stable versions. When adding a new package, install the latest version rather than pinning to an older one. When touching a file whose dependency has a newer major available, flag it rather than silently leaving it behind.

## Framework conventions

- Astro components (`.astro`) for all pages/layouts/components — no other UI framework is installed, don't introduce React/Vue/Svelte etc. without asking.
- Static output only (`output: 'static'` in [astro.config.mjs](astro.config.mjs)) — avoid patterns that assume a server runtime.
- Styling is TailwindCSS utility classes; avoid separate CSS files. Site-wide theme lives in `src/assets/styles`.
- Deployed to Cloudflare Pages — keep build output compatible with static hosting (no Node-only APIs at runtime).

## File organization

- `src/pages/` — routes (file-based routing)
- `src/layouts/` — shared page layouts (`BaseLayout.astro`)
- `src/components/` — reusable components
- `src/content/` — content collections (see `src/content.config.ts`)
- `src/assets/` — images, svgs, styles
- `src/utils/` — helper/data-loading code (e.g. `work.ts`)

## Notes

- `astro.config.mjs` excludes `/work` and `/resume` from the sitemap intentionally — don't remove that filter without confirming.
- `trailingSlash` is set to `always`; keep internal links consistent with trailing slashes.
