import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{
      source: '/Tayab-Malik.pdf',
      headers: [{ key: 'Content-Disposition', value: 'attachment; filename="Tayab-Malik-Resume.pdf"' }],
    }];
  },
};

export default nextConfig;
