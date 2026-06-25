// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real production domain before deploy.
  site: 'https://www.home2u.bg',
  integrations: [sitemap()],
  // Honor a PORT env var (used by the preview tool); fall back to Astro's default.
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321, host: true },
});
