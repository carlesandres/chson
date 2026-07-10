'use client'

import * as React from 'react'

import type { ChSONDocument } from '@chson/schema'

import {
  countChecklistEntries,
  countCheckedEntries,
  defaultChecklistKey,
  progressPercent,
  type ChecklistKeyArgs,
} from '../../core/checklist'
import { getEntries, getSections } from '../../core/normalize'
import { EntryDetails } from '../primitives/entry-details'
import { cn } from '../utils/cn'
import { Badge } from '../../shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card'
import { Checkbox } from '../../shadcn/checkbox'
import { Progress } from '../../shadcn/progress'

export interface ChecklistProps {
  data: ChSONDocument
  className?: string
  checkedKeys?: string[]
  defaultCheckedKeys?: string[]
  onCheckedKeysChange?: (keys: string[]) => void
  getKey?: (args: ChecklistKeyArgs) => string
}

/**
 * Checklist renderer: interactive task list.
 * Controlled by `checkedKeys`/`onCheckedKeysChange` when provided.
 */
export function Checklist({
  data,
  className,
  checkedKeys,
  defaultCheckedKeys,
  onCheckedKeysChange,
  getKey = defaultChecklistKey,
}: ChecklistProps) {
  const isControlled = checkedKeys !== undefined
  const [internal, setInternal] = React.useState<Set<string>>(
    () => new Set(defaultCheckedKeys ?? []),
  )

  const checked = isControlled ? new Set(checkedKeys ?? []) : internal

  const setChecked = React.useCallback(
    (next: Set<string>) => {
      const arr = Array.from(next)
      if (!isControlled) setInternal(next)
      onCheckedKeysChange?.(arr)
    },
    [isControlled, onCheckedKeysChange],
  )

  const toggle = React.useCallback(
    (key: string) => {
      const next = new Set(checked)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      setChecked(next)
    },
    [checked, setChecked],
  )

  const resetAll = React.useCallback(() => setChecked(new Set()), [setChecked])

  const sections = getSections(data)
  const totalEntries = countChecklistEntries(data)
  const totalChecked = countCheckedEntries(data, checked, getKey)
  const overallPercent = progressPercent(totalChecked, totalEntries)

  if (sections.length === 0) return <p className={className}>No checklist items found.</p>

  return (
    <div className={cn('mt-6 space-y-5', className)}>
      <Card className="border-border/50 bg-card/70 shadow-sm">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {totalChecked}/{totalEntries} tasks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tabular-nums">{overallPercent}%</span>
              {totalChecked > 0 && (
                <button
                  type="button"
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

      {sections.map((section, sectionIndex) => {
        const entries = getEntries(section)

        const sectionCheckedCount = entries.reduce((sum, entry, entryIndex) => {
          const key = getKey({
            sectionIndex,
            entryIndex,
            sectionTitle: section.title,
            anchor: entry.anchor,
            content: entry.content,
          })
          return sum + (checked.has(key) ? 1 : 0)
        }, 0)

        const sectionTotal = entries.length
        const sectionComplete = sectionTotal > 0 && sectionCheckedCount === sectionTotal

        return (
          <Card
            key={sectionIndex}
            className={cn(
              'border-border/50 bg-card/70 shadow-sm transition-opacity',
              sectionComplete && 'opacity-70',
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px] tabular-nums">
                    {sectionIndex + 1}
                  </Badge>
                  <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {sectionCheckedCount}/{sectionTotal}
                </span>
              </div>
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-0">
                {entries.map((entry, entryIndex) => {
                  const key = getKey({
                    sectionIndex,
                    entryIndex,
                    sectionTitle: section.title,
                    anchor: entry.anchor,
                    content: entry.content,
                  })
                  const isChecked = checked.has(key)
                  const id = `chson-check-${sectionIndex}-${entryIndex}`

                  return (
                    <div
                      key={entryIndex}
                      className={cn(
                        'flex items-start gap-3 rounded-md px-3 py-3 transition-colors',
                        entryIndex % 2 === 0 ? 'bg-muted/30' : '',
                        isChecked && 'opacity-60',
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={isChecked}
                        onCheckedChange={() => toggle(key)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <label htmlFor={id} className="block cursor-pointer select-none">
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
                        </label>
                        {entry.details && (
                          <div className="mt-1">
                            <EntryDetails
                              details={entry.details}
                              label={entry.anchor}
                              className="text-xs"
                            />
                          </div>
                        )}
                      </div>
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
