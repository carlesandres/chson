import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion'
import { Badge } from 'components/ui/badge'
import { Preformatted } from 'components/chson/Preformatted'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

/**
 * Detects if content looks like a shell command.
 * Used to decide whether to render as preformatted code.
 */
function looksLikeCommand(text: string): boolean {
  const trimmed = text.trim()
  // Common CLI patterns
  const patterns = [
    /^kubectl\s/,
    /^docker\s/,
    /^git\s/,
    /^npm\s/,
    /^yarn\s/,
    /^pnpm\s/,
    /^curl\s/,
    /^wget\s/,
    /^aws\s/,
    /^gcloud\s/,
    /^az\s/,
    /^terraform\s/,
    /^helm\s/,
    /^make\s/,
    /^sudo\s/,
    /^ssh\s/,
    /^scp\s/,
    /^\.\//,
    /^cd\s/,
    /^ls\s/,
    /^cat\s/,
    /^grep\s/,
  ]
  return patterns.some((p) => p.test(trimmed))
}

/**
 * Runbook renderer — accordion-based troubleshooting flow.
 * Each section is a numbered phase with expandable entries.
 */
export function RunbookRenderer({ data }: RendererProps) {
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    return <p>No procedures found.</p>
  }

  return (
    <div className="mt-6 space-y-5">
      {data.sections.map((section, sectionIdx) => (
        <Card
          key={sectionIdx}
          className="border-border/50 bg-card/70 shadow-soft"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-[11px] tabular-nums"
              >
                {sectionIdx + 1}
              </Badge>
              <CardTitle className="text-base font-semibold">
                {section.title}
              </CardTitle>
            </div>
            {section.description && (
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="multiple" className="w-full">
              {(section.entries ?? []).map((entry, entryIdx) => {
                const isCommand = looksLikeCommand(entry.content)

                return (
                  <AccordionItem
                    key={entryIdx}
                    value={`${sectionIdx}-${entryIdx}`}
                    className="border-border/50"
                  >
                    <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {entryIdx + 1}.
                        </span>
                        <span>{entry.anchor}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-5">
                        {isCommand ? (
                          <Preformatted className="block w-full">
                            {entry.content}
                          </Preformatted>
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {entry.content}
                          </p>
                        )}
                        {entry.details && (
                          <p className="text-xs text-muted-foreground/70">
                            {entry.details}
                          </p>
                        )}
                        {entry.url && (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Documentation →
                          </a>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
