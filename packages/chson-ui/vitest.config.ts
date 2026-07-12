import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'https://chson.localhost',
      },
    },
    setupFiles: ['./vitest.setup.ts'],
  },
})
