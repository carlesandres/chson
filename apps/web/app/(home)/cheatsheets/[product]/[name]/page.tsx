import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCheatsheets, loadCheatsheet } from 'lib/cheatsheets'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'components/ui/breadcrumb'
import { ExternalLink, Home } from 'lucide-react'
import { CheatsheetRenderer } from 'components/chson/renderers/CheatsheetRenderer'
import { ChecklistRenderer } from 'components/chson/renderers/ChecklistRenderer'
import { BookmarksRenderer } from 'components/chson/renderers/BookmarksRenderer'
import { TldrRenderer } from 'components/chson/renderers/TldrRenderer'

import type { Cheatsheet } from 'lib/cheatsheets'

type Params = Promise<{ product: string; name: string }>

export async function generateStaticParams() {
  return getAllCheatsheets().map((ref) => ({
    product: ref.product,
    name: ref.name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { product, name } = await params
  const ref = getAllCheatsheets().find(
    (r) => r.product === product && r.name === name,
  )
  if (!ref) return { title: 'Not Found' }

  return {
    title: `${ref.data.title} | ChSON`,
    description: ref.data.description,
  }
}

/**
 * Dispatches to the appropriate renderer based on documentType.
 */
function renderDocument(data: Cheatsheet, product: string, name: string) {
  const documentType = data.documentType || 'cheatsheet'

  switch (documentType) {
    case 'checklist':
      return (
        <ChecklistRenderer data={data} product={product} name={name} />
      )
    case 'bookmarks':
      return (
        <BookmarksRenderer data={data} product={product} name={name} />
      )
    case 'tldr':
      return (
        <TldrRenderer data={data} product={product} name={name} />
      )
    case 'cheatsheet':
    default:
      return (
        <CheatsheetRenderer data={data} product={product} name={name} />
      )
  }
}

export default async function CheatsheetPage({ params }: { params: Params }) {
  const { product, name } = await params
  const ref = getAllCheatsheets().find(
    (r) => r.product === product && r.name === name,
  )

  if (!ref) {
    notFound()
  }

  const data = loadCheatsheet(ref.filePath)
  const title = data.title || 'Cheatsheet'

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/use-cases">Use Cases</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(28px,4.2vw,44px)] font-semibold leading-[1.08] tracking-[-0.03em]">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.version && (
              <span>
                Version:{' '}
                <strong className="font-semibold text-foreground">
                  {data.version}
                </strong>
              </span>
            )}
            {data.publicationDate && (
              <span>
                Published:{' '}
                <strong className="font-semibold text-foreground">
                  {data.publicationDate}
                </strong>
              </span>
            )}
            <Badge variant="outline" className="font-mono text-[11px]">
              {ref.product}/{ref.name}
            </Badge>
          </div>
          <p className="mt-4 max-w-[80ch] text-muted-foreground">
            {data.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/use-cases">All use cases</Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="gap-1.5">
            <a
              href={`https://github.com/carlesandres/csif.sh/blob/main/packages/chson-registry/cheatsheets/${ref.product}/${ref.name}.chson.json`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View source
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {renderDocument(data, ref.product, ref.name)}
    </>
  )
}
