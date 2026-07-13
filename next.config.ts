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
      { pathname: '/projects/**', search: '' },
      { pathname: '/projects/**', search: '?v1' },
      { pathname: '/portraits/**', search: '' },
      { pathname: '/market-intelligence/**', search: '' },
    ],
  },
};

export default withNextIntl(nextConfig);
