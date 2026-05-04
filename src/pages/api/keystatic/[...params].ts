// Custom Keystatic API route that fixes the OAuth redirect_uri on Vercel.
//
// Root cause: Keystatic builds redirect_uri from new URL(req.url).origin.
// On Vercel serverless, req.url often contains an internal "localhost" origin;
// the real public domain has to come from env vars or forwarded headers.
//
// Priority chain (first match wins):
//   1. process.env.KEYSTATIC_URL              — explicit, user-controlled
//   2. process.env.VERCEL_PROJECT_PRODUCTION_URL — auto-set by Vercel on every
//                                                 deployment (no setup needed)
//   3. x-forwarded-host header                — generic platform fallback
//
// We use process.env (runtime) instead of import.meta.env (build-time) so
// env vars added in the Vercel dashboard after the build still work.
export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

const _handler = makeHandler({ config: keystaticConfig });

export const ALL = async (context: Parameters<typeof _handler>[0]) => {
  const fixed = withPublicOrigin(context.request);
  const patchedContext = new Proxy(context, {
    get(target, prop) {
      if (prop === 'request') return fixed;
      return (target as any)[prop];
    },
  });
  return _handler(patchedContext);
};

function getPublicOrigin(request: Request): string | null {
  const env = (typeof process !== 'undefined' && process.env) || {};

  // 1. User-provided override
  const explicit = env.KEYSTATIC_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  // 2. Vercel auto-populates this on every production + preview deployment
  const vercelProd = env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

  // 3. Generic x-forwarded-host fallback (skip localhost values)
  const fwdHost  = request.headers.get('x-forwarded-host');
  const fwdProto = request.headers.get('x-forwarded-proto') ?? 'https';
  if (fwdHost) {
    const host  = fwdHost.split(',')[0].trim();
    const proto = fwdProto.split(',')[0].trim();
    const isLocal = !host || host === 'localhost' || host.startsWith('localhost:') || host.startsWith('127.');
    if (!isLocal) return `${proto}://${host}`;
  }

  return null;
}

function withPublicOrigin(request: Request): Request {
  const publicOrigin = getPublicOrigin(request);
  if (!publicOrigin) return request; // local dev — leave untouched

  const url = new URL(request.url);
  const currentOrigin = `${url.protocol}//${url.host}`;
  if (currentOrigin === publicOrigin) return request; // already correct

  const rewritten = new URL(url.pathname + url.search, publicOrigin);
  return new Request(rewritten.toString(), request);
}
