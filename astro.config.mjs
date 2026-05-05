import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';

const OVERRIDDEN_ROUTES = new Set([
  '/keystatic/[...params]',
  '/api/keystatic/[...params]',
]);

function keystaticWithUrduEditor() {
  const integration = keystatic();
  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      'astro:config:setup'(options) {
        const originalInjectRoute = options.injectRoute.bind(options);
        options.injectRoute = (routeOptions) => {
          if (OVERRIDDEN_ROUTES.has(routeOptions.pattern)) return;
          originalInjectRoute(routeOptions);
        };
        integration.hooks['astro:config:setup'](options);
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [
    markdoc(),
    react(),
    keystaticWithUrduEditor(),
  ],
});