// Custom Keystatic API route that fixes the OAuth redirect_uri on Vercel.
//
// Root cause: Keystatic builds redirect_uri from new URL(req.url).origin.
// On Vercel serverless, req.url contains an internal "localhost" origin;
// the real public domain is only in x-forwarded-host / x-forwarded-proto.
// This wrapper rewrites the request URL to the real origin before Keystatic
// ever sees it, so the redirect_uri it sends to GitHub is correct.
export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

const _handler = makeHandler({ config: keystaticConfig });

export const ALL = async (context: Parameters<typeof _handler>[0]) => {
  const fixed = withPublicOrigin(context.request);
  // Proxy the context so every property is unchanged except `request`.
  const patchedContext = new Proxy(context, {
    get(target, prop) {
      if (prop === 'request') return fixed;
      return (target as any)[prop];
    },
  });
  return _handler(patchedContext);
};

function withPublicOrigin(request: Request): Request {
  // 1. Explicit env var override (most reliable — set KEYSTATIC_URL on Vercel)
  const explicit = import.meta.env.KEYSTATIC_URL as string | undefined;

  // 2. Vercel always sets these forwarded headers on the real edge request
  const fwdHost  = request.headers.get('x-forwarded-host');
  const fwdProto = request.headers.get('x-forwarded-proto') ?? 'https';

  const publicOrigin =
    explicit?.replace(/\/$/, '') ??
    (fwdHost ? `${fwdProto.split(',')[0].trim()}://${fwdHost.split(',')[0].trim()}` : null);

  if (!publicOrigin) return request; // local dev — leave untouched

  const url = new URL(request.url);
  const currentOrigin = `${url.protocol}//${url.host}`;
  if (currentOrigin === publicOrigin) return request; // already correct

  // Rewrite only the origin; keep path + query intact
  const rewritten = new URL(url.pathname + url.search, publicOrigin);
  return new Request(rewritten.toString(), request);
}
