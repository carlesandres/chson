import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(__dirname, './components'),
      hooks: path.resolve(__dirname, './hooks'),
      lib: path.resolve(__dirname, './lib'),
      providers: path.resolve(__dirname, './providers'),
      stores: path.resolve(__dirname, './stores'),
      types: path.resolve(__dirname, './types'),
      app: path.resolve(__dirname, './app'),
      utils: path.resolve(__dirname, './utils'),
      test: path.resolve(__dirname, './test'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
