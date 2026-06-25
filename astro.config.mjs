// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
//
// The marketing page stays static (prerendered); only `/api/register` runs as a
// Vercel serverless function (it sets `export const prerender = false`). The
// adapter below enables that. Server secrets are read at runtime via getSecret()
// from `astro:env/server` — no secrets baked into the build.
export default defineConfig({
  // Served under webinar.home2u.bg/course (path-based zone behind the
  // webinar-ralica project, which rewrites /course/* to this deployment).
  site: 'https://webinar.home2u.bg',
  base: '/course',
  trailingSlash: 'ignore',
  adapter: vercel(),
  integrations: [sitemap()],
  // Honor a PORT env var (used by the preview tool); fall back to Astro's default.
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321, host: true },
});
