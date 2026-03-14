'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Checkbox } from 'components/ui/checkbox'
import { Progress } from 'components/ui/progress'
import { Badge } from 'components/ui/badge'
import { cn } from 'lib/utils'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

/**
 * Builds a localStorage key for checklist state.
 */
function storageKey(product: string, name: string): string {
  return `chson-checklist:${product}/${name}`
}

/**
 * Loads checked state from localStorage.
 * Returns a Set of "sectionIdx-entryIdx" strings.
 */
function loadChecked(product: string, name: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(storageKey(product, name))
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

/**
 * Saves checked state to localStorage.
 */
function saveChecked(product: string, name: string, checked: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      storageKey(product, name),
      JSON.stringify(Array.from(checked)),
    )
  } catch {
    // localStorage may be full or unavailable — fail silently
  }
}

/**
 * Checklist renderer — interactive checkbox list with progress tracking.
 * State persists via localStorage.
 */
export function ChecklistRenderer({ data, product, name }: RendererProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setChecked(loadChecked(product, name))
    setHydrated(true)
  }, [product, name])

  const toggle = useCallback(
    (key: string) => {
      setChecked((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        saveChecked(product, name, next)
        return next
      })
    },
    [product, name],
  )

  const resetAll = useCallback(() => {
    const empty = new Set<string>()
    setChecked(empty)
    saveChecked(product, name, empty)
  }, [product, name])

  // Count totals
  const totalEntries = data.sections.reduce(
    (sum, s) => sum + (s.entries?.length ?? 0),
    0,
  )
  const totalChecked = checked.size
  const overallPercent =
    totalEntries > 0 ? Math.round((totalChecked / totalEntries) * 100) : 0

  return (
    <div className="mt-6 space-y-5">
      {/* Overall progress */}
      <Card className="border-border/50 bg-card/70 shadow-soft">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {totalChecked}/{totalEntries} tasks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tabular-nums">
                {overallPercent}%
              </span>
              {totalChecked > 0 && (
                <button
                  onClick={resetAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <Progress value={overallPercent} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Sections */}
      {data.sections.map((section, sectionIdx) => {
        const sectionCheckedCount = (section.entries ?? []).filter(
          (_, entryIdx) => checked.has(`${sectionIdx}-${entryIdx}`),
        ).length
        const sectionTotal = section.entries?.length ?? 0
        const sectionComplete = sectionCheckedCount === sectionTotal && sectionTotal > 0

        return (
          <Card
            key={sectionIdx}
            className={cn(
              'border-border/50 bg-card/70 shadow-soft transition-opacity',
              sectionComplete && 'opacity-70',
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
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
                <span className="text-xs text-muted-foreground tabular-nums">
                  {sectionCheckedCount}/{sectionTotal}
                </span>
              </div>
              {section.description && (
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {(section.entries ?? []).map((entry, entryIdx) => {
                  const key = `${sectionIdx}-${entryIdx}`
                  const isChecked = hydrated && checked.has(key)
                  const id = `check-${key}`

                  return (
                    <div
                      key={entryIdx}
                      className={cn(
                        'flex items-start gap-3 rounded-md px-3 py-3 transition-colors',
                        entryIdx % 2 === 0 ? 'bg-muted/30' : '',
                        isChecked && 'opacity-60',
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={isChecked}
                        onCheckedChange={() => toggle(key)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={id}
                        className="flex-1 cursor-pointer select-none"
                      >
                        <div
                          className={cn(
                            'text-sm font-medium leading-snug',
                            isChecked && 'line-through',
                          )}
                        >
                          {entry.anchor}
                        </div>
                        <div className="mt-0.5 text-sm text-muted-foreground leading-snug">
                          {entry.content}
                        </div>
                        {entry.details && (
                          <div className="mt-1 text-xs text-muted-foreground/70">
                            {entry.details}
                          </div>
                        )}
                      </label>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
