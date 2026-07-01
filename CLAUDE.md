# mattsteele.dev — Project Steering

## Stack

- **Astro** (always latest stable) — static site generator
- **Tailwind CSS v4** (always latest stable) — via `@tailwindcss/vite` Vite plugin
- **TypeScript** — strict mode via `astro/tsconfigs/strict`
- **Cloudflare Pages** — static deployment, no SSR adapter needed

## Commands

```sh
npm run dev        # local dev server at localhost:4321
npm run build      # production build → dist/
npm run preview    # preview production build locally
npm run check      # Astro + TypeScript type checking
```

## Package Management

- All packages belong in `devDependencies` — this is a static site with no runtime dependencies
- Always use the latest stable versions of all packages. When adding a new package, install latest rather than pinning to an older version. When touching a file whose dependency has a newer major available, flag it rather than silently leaving it behind
- Use `@tailwindcss/vite` (NOT `@tailwindcss/postcss`) — it is the recommended Tailwind v4 approach for Vite-based frameworks
- When `@tailwindcss/vite` and Astro resolve to different Vite majors, add `"overrides": { "vite": "^X" }` to align them. Check with `npm ls vite` after installing
- `allowScripts` in `package.json` is required for `esbuild`, `fsevents`, and `sharp`

## File Structure

```text
src/
  assets/
    images/       # source images (processed by Astro image pipeline)
    styles/       # globals.css (Tailwind entry point)
    svgs/         # SVG files imported as Astro components
  components/     # reusable Astro components (Nav, Footer, ThemeToggle, MainHead, Link, Pill, PortfolioPreview)
  content/        # content collections (see src/content.config.ts) — e.g. work/
  layouts/        # BaseLayout.astro (wraps all pages)
  pages/          # index.astro, about.astro, work.astro, resume.astro, 404.astro
  utils/          # work.ts and other data-loading helpers
public/
  _headers        # Cloudflare Pages response headers (CSP, cache, security)
  _redirects      # Cloudflare Pages redirects (trailing-slash normalization, 404 fallback)
  robots.txt
  favicon*.png, favicon.ico, site.webmanifest, android-chrome-*.png, apple-touch-icon.png
```

## Astro Configuration

- `output: 'static'` — fully static build
- `trailingSlash: 'always'` — keep internal links consistent with trailing slashes
- `compressHTML: true` — minifies HTML output
- `prefetch: true` — prefetches linked pages
- Sitemap auto-generated via `@astrojs/sitemap`, but `/work` and `/resume` are intentionally excluded — don't remove that filter without confirming

## Tailwind CSS v4

- Entry point: `src/assets/styles/globals.css`
- Use `@import "tailwindcss"` (v4 syntax — no config file needed)
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` — class-based, toggled via `ThemeToggle.astro` and initialized in `BaseLayout.astro` via an `is:inline` script (reads `localStorage`/`prefers-color-scheme`, reapplied on `astro:after-swap` for view transitions)
- Custom utilities use `@utility` directive (e.g. `btn-gradient`)

## Cloudflare Pages

- `public/_redirects` — normalizes trailing slashes on `/work`, `/about`, `/resume`, and falls back to `/404.html`
- `public/_headers` — security headers and cache rules applied to all routes
- HTML served with `Cache-Control: public, max-age=0, must-revalidate` so deployments propagate immediately
- Versioned/static assets (`/_astro/*`, fonts, images, css, js) served with `Cache-Control: public, max-age=31536000, immutable`; favicons/manifest with a shorter 1-day cache
- Google Analytics (`googletagmanager.com`, `google-analytics.com`) and Cloudflare Web Analytics (`static.cloudflareinsights.com`) are allowed in the CSP

## Content Security Policy

The CSP in `public/_headers` currently allows `'unsafe-inline'` in `script-src`. This is required because `BaseLayout.astro` has two `is:inline` scripts (theme init, and a GA `define:vars` page-view tracker) — moving to hash-based CSP (like SHA-256 pinning) would require regenerating hashes on every edit to those scripts, and `define:vars` output isn't static across builds. Don't remove `'unsafe-inline'` without replacing both inline scripts with an SSR-nonce approach or externalizing them, and confirming with the maintainer first — static output has no server to inject nonces per-request.
