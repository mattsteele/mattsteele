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
- `build.inlineStylesheets: 'auto'` — inlines small stylesheets
- `vite.build.cssMinify: 'lightningcss'` — minifies CSS with LightningCSS
- `site: 'https://mattsteele.dev'` — canonical domain is the apex; `public/_redirects` 301s `www.mattsteele.dev` → apex
- Sitemap auto-generated via `@astrojs/sitemap`, but `/work` and `/resume` are intentionally excluded — don't remove that filter without confirming

## Tailwind CSS v4

- Entry point: `src/assets/styles/globals.css`
- Use `@import "tailwindcss"` (v4 syntax — no config file needed)
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` — class-based, toggled via `ThemeToggle.astro` and initialized in `BaseLayout.astro` via an `is:inline` script (reads `localStorage`/`prefers-color-scheme`, reapplied on `astro:after-swap` for view transitions)
- Custom utilities use `@utility` directive (e.g. `btn-gradient`)

## Cloudflare Pages

- `public/_redirects` — 301s `www.mattsteele.dev` → apex, normalizes trailing slashes on `/work`, `/about`, `/resume`, and falls back to `/404.html`
- `public/_headers` — security headers and cache rules applied to all routes
- HTML served with `Cache-Control: public, max-age=0, must-revalidate` so deployments propagate immediately
- Versioned/static assets (`/_astro/*`, fonts, images, css, js) served with `Cache-Control: public, max-age=31536000, immutable`; favicons/manifest with a shorter 1-day cache
- Google Analytics and Cloudflare Web Analytics are allowed in the CSP: `googletagmanager.com` (script + tracking pixel), `google-analytics.com`, and `www.google.com` (GA4's actual beacon endpoint is `www.google.com/g/collect`, not `google-analytics.com` — don't remove it, connect-src was silently blocking all GA traffic before this was added), and `static.cloudflareinsights.com` for CF Web Analytics

## Content Security Policy

The CSP in `public/_headers` uses SHA-256 hashes for inline scripts instead of `'unsafe-inline'`.

There are five inline scripts in the built HTML that need a pinned hash (scripts with a `src` attribute, like the GA loader and Astro's bundled `ClientRouter`/page chunks, don't need one — they're covered by the `'self'`/host allowlist instead):

1. **Theme detection** (`is:inline` in `BaseLayout.astro`) — static content, hash only changes if that script block is edited
2. **GA page-view tracker** (`is:inline` in `BaseLayout.astro`) — static content (no `define:vars`)
3. **GA config script** (`is:inline` in `MainHead.astro`) — reads the measurement ID from a `<meta name="ga-measurement-id">` tag at runtime instead of via `define:vars`, so its literal script text — and hash — stays constant regardless of the `PUBLIC_GA_ID` value
4. **JSON-LD** (`is:inline type="application/ld+json"` in `MainHead.astro`) — static content
5. **Bundled `ThemeToggle` module script** (inlined by Vite) — hash changes whenever `ThemeToggle.astro` is modified

Avoid `define:vars` on any script that needs a hash — it bakes the interpolated value into the script's literal text, which either breaks the hash across environments (if the value differs) or, worse, silently ships an unused variable (this happened to the GA page-view tracker, which declared `gaId` via `define:vars` but never referenced it in the script body). Prefer passing data via a `<meta>` tag read at runtime instead.

After adding/editing an inline script, regenerate the hashes:

```sh
npm run build
node -e "
const fs = require('fs'), crypto = require('crypto');
const html = fs.readFileSync('dist/index.html', 'utf8');
[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].forEach(m => {
  const attrs = m[1].trim();
  if (attrs.includes('src=') || m[2].trim() === '') return;
  const hash = crypto.createHash('sha256').update(m[2], 'utf8').digest('base64');
  console.log(attrs || '(inline)', '=>', 'sha256-' + hash);
});
"
```

Then update the `script-src` directive in `public/_headers` with the new hashes. Verify hashes are identical across a clean rebuild (`rm -rf dist && npm run build`) before trusting them — a script whose content varies per build (timestamps, env-dependent values) can't be hashed reliably.
