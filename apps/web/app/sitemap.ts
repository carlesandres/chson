import fs from 'node:fs';
import type { MetadataRoute } from 'next';
import { getAllCheatsheets } from 'lib/cheatsheets';
import { source } from 'lib/source';

const siteUrl = 'https://chson.dev';
const buildTimestamp = process.env.VERCEL_GIT_COMMIT_DATE
  ? new Date(process.env.VERCEL_GIT_COMMIT_DATE)
  : new Date();

type DocsParam = { slug?: string[] };

function getDocsPath(param: DocsParam): string {
  if (!param.slug || param.slug.length === 0) {
    return '/docs';
  }

  const slug = param.slug.map((segment) => encodeURIComponent(segment)).join('/');
  return `/docs/${slug}`;
}

function getDocsEntries(): MetadataRoute.Sitemap {
  const params = source.generateParams() as DocsParam[];

  return params
    .map((param) => getDocsPath(param))
    .filter((urlPath) => urlPath !== '/docs')
    .map((urlPath) => ({
      url: `${siteUrl}${urlPath}`,
      lastModified: buildTimestamp,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
}

function getCheatsheetEntries(): MetadataRoute.Sitemap {
  return getAllCheatsheets().map((ref) => {
    let lastModified = buildTimestamp;

    try {
      lastModified = fs.statSync(ref.filePath).mtime;
    } catch {
      lastModified = buildTimestamp;
    }

    return {
      url: `${siteUrl}/cheatsheets/${encodeURIComponent(ref.product)}/${encodeURIComponent(ref.name)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: buildTimestamp,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: buildTimestamp,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/use-cases`,
      lastModified: buildTimestamp,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const entries = [...staticEntries, ...getDocsEntries(), ...getCheatsheetEntries()];
  const deduped = new Map(entries.map((entry) => [entry.url, entry]));

  return Array.from(deduped.values());
}
