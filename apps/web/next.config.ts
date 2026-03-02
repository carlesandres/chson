import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Backward compatibility: redirect old schema URL to new API endpoint
        source: '/schema/chson.schema.json',
        destination: '/api/schema.json',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Generated content output directory
  outDir: '.source',
});

export default withMDX(config);
