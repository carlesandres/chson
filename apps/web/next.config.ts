import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
};

const withMDX = createMDX({
  // Generated content output directory
  outDir: '.source',
});

export default withMDX(config);
