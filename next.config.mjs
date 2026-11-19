/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'triple-rrr.com.br', pathname: '/wp-content/uploads/**' },
      ...(process.env.NEXT_PUBLIC_UPLOADS ? [{ protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/**' }] : [])
    ],
    formats: ['image/webp']
  }
};
export default nextConfig;
