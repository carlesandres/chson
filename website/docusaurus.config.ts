import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CSIF',
  tagline: 'CheatSheet Interchange Format',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://csif.sh',
  baseUrl: '/',

  organizationName: 'carlesandres',
  projectName: 'csif.sh',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/carlesandres/csif.sh/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/csif-social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CSIF',
      logo: {
        alt: 'CSIF Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/registry',
          label: 'Registry',
          position: 'left',
        },
        {
          href: 'https://github.com/carlesandres/csif.sh',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'What is CSIF?',
              to: '/docs',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Schema Reference',
              to: '/docs/schema',
            },
          ],
        },
        {
          title: 'Explore',
          items: [
            {
              label: 'Cheatsheet Registry',
              to: '/docs/registry',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/carlesandres/csif.sh',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CSIF Project.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
