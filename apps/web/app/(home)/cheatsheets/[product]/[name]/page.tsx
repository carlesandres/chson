import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCheatsheets, loadCheatsheet } from 'lib/cheatsheets'
import { Badge } from '@chson/ui/shadcn/badge'
import { Button } from '@chson/ui/shadcn/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@chson/ui/shadcn/breadcrumb'
import { ExternalLink, Home } from 'lucide-react'
import { Cheatsheet } from '@chson/ui'

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
          <h1 className="font-display text-[length:var(--text-display-title)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-display)]">
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
            <Badge variant="outline" className="font-mono text-[length:var(--text-badge)]">
              {ref.product}/{ref.name}
            </Badge>
          </div>
          <p className="mt-4 max-w-[var(--max-w-prose-lg)] text-muted-foreground">
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

      <Cheatsheet data={data} />
    </>
  )
}
