import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Wrap the Keystatic integration so it skips injecting the default admin UI
// route. We provide our own page at src/pages/keystatic/[...params].astro
// which adds RTL + Noto Nastaliq Urdu CSS to the editor. The API route
// (/api/keystatic/[...params]) is still injected normally.
function keystaticWithUrduEditor() {
  const integration = keystatic();
  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      'astro:config:setup'(options) {
        const originalInjectRoute = options.injectRoute.bind(options);
        options.injectRoute = (routeOptions) => {
          if (routeOptions.pattern === '/keystatic/[...params]') return;
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
    react(),
    keystaticWithUrduEditor(),
  ],
});
