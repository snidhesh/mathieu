import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/listings/**', search: '' },
      { pathname: '/listings/**', search: '?v2' },
      { pathname: '/communities/**', search: '' },
      { pathname: '/communities/**', search: '?v2' },
      { pathname: '/portraits/**', search: '' },
    ],
  },
};

export default withNextIntl(nextConfig);
