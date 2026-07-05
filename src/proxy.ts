import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude:
  //  - API + tRPC + Next internals + Vercel
  //  - App-Router metadata files (icon, apple-icon, opengraph-image, robots, sitemap)
  //  - Any path containing a dot (static file)
  matcher:
    '/((?!api|trpc|_next|_vercel|icon|apple-icon|opengraph-image|robots|sitemap|.*\\..*).*)',
};
