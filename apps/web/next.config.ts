import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
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
