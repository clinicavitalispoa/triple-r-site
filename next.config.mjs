import { readFileSync } from 'node:fs';

const models = {
  ...JSON.parse(readFileSync(new URL('./lib/data/models-a.json', import.meta.url), 'utf8')),
  ...JSON.parse(readFileSync(new URL('./lib/data/models-b.json', import.meta.url), 'utf8'))
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'triple-rrr.com.br', pathname: '/wp-content/uploads/**' },
      ...(process.env.NEXT_PUBLIC_UPLOADS ? [{ protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/**' }] : [])
    ],
    formats: ['image/webp']
  },
  // old product URLs (/produto/<model>) now live under their product line
  async redirects() {
    return Object.entries(models).map(([slug, m]) => ({ source: `/produto/${slug}`, destination: `/solucoes/${m.series}/${slug}`, permanent: true }));
  }
};
export default nextConfig;
