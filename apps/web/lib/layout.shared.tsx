import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout options for Fumadocs HomeLayout and DocsLayout.
 * Provides consistent navigation across the site.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'ChSON',
      url: '/',
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
      },
      {
        text: 'Use Cases',
        url: '/use-cases',
      },
    ],
    // Adds GitHub icon link to navbar automatically
    githubUrl: 'https://github.com/carlesandres/chson',
  };
}
