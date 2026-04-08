import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chson/ui'],
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Resolve to workspace source for HMR.
      '@chson/ui/shadcn': path.resolve(__dirname, '../../packages/chson-ui/src/shadcn'),
    };

    return config;
  },
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
