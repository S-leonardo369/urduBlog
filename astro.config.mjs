import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  // In Astro 5, "static" is the default and behaves like the old "hybrid":
  // pages are prerendered by default, individual pages/routes can opt into
  // server-rendering with `export const prerender = false`.
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    keystatic(),
  ],
});
