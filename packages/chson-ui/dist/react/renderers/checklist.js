'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { countChecklistEntries, countCheckedEntries, defaultChecklistKey, progressPercent, } from '../../core/checklist';
import { getEntries, getSections } from '../../core/normalize';
import { EntryDetails } from '../primitives/entry-details';
import { cn } from '../utils/cn';
import { Badge } from '../../shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { Checkbox } from '../../shadcn/checkbox';
import { Progress } from '../../shadcn/progress';
/**
 * Checklist renderer: interactive task list.
 * Controlled by `checkedKeys`/`onCheckedKeysChange` when provided.
 */
export function Checklist({ data, className, checkedKeys, defaultCheckedKeys, onCheckedKeysChange, getKey = defaultChecklistKey, }) {
    const isControlled = checkedKeys !== undefined;
    const [internal, setInternal] = React.useState(() => new Set(defaultCheckedKeys ?? []));
    const checked = isControlled ? new Set(checkedKeys ?? []) : internal;
    const setChecked = React.useCallback((next) => {
        const arr = Array.from(next);
        if (!isControlled)
            setInternal(next);
        onCheckedKeysChange?.(arr);
    }, [isControlled, onCheckedKeysChange]);
    const toggle = React.useCallback((key) => {
        const next = new Set(checked);
        if (next.has(key))
            next.delete(key);
        else
            next.add(key);
        setChecked(next);
    }, [checked, setChecked]);
    const resetAll = React.useCallback(() => setChecked(new Set()), [setChecked]);
    const sections = getSections(data);
    const totalEntries = countChecklistEntries(data);
    const totalChecked = countCheckedEntries(data, checked, getKey);
    const overallPercent = progressPercent(totalChecked, totalEntries);
    if (sections.length === 0)
        return _jsx("p", { className: className, children: "No checklist items found." });
    return (_jsxs("div", { className: cn('mt-6 space-y-5', className), children: [_jsx(Card, { className: "border-border/50 bg-card/70 shadow-sm", children: _jsxs(CardContent, { className: "pt-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("span", { className: "font-medium", children: "Progress" }), _jsxs("span", { className: "text-muted-foreground", children: [totalChecked, "/", totalEntries, " tasks"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-sm font-medium tabular-nums", children: [overallPercent, "%"] }), totalChecked > 0 && (_jsx("button", { type: "button", onClick: resetAll, className: "text-xs text-muted-foreground hover:text-foreground transition-colors", children: "Reset" }))] })] }), _jsx(Progress, { value: overallPercent, className: "mt-2 h-2" })] }) }), sections.map((section, sectionIndex) => {
                const entries = getEntries(section);
                const sectionCheckedCount = entries.reduce((sum, entry, entryIndex) => {
                    const key = getKey({
                        sectionIndex,
                        entryIndex,
                        sectionTitle: section.title,
                        anchor: entry.anchor,
                        content: entry.content,
                    });
                    return sum + (checked.has(key) ? 1 : 0);
                }, 0);
                const sectionTotal = entries.length;
                const sectionComplete = sectionTotal > 0 && sectionCheckedCount === sectionTotal;
                return (_jsxs(Card, { className: cn('border-border/50 bg-card/70 shadow-sm transition-opacity', sectionComplete && 'opacity-70'), children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "font-mono text-[11px] tabular-nums", children: sectionIndex + 1 }), _jsx(CardTitle, { className: "text-base font-semibold", children: section.title })] }), _jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [sectionCheckedCount, "/", sectionTotal] })] }), section.description && (_jsx("p", { className: "text-sm text-muted-foreground", children: section.description }))] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-0", children: entries.map((entry, entryIndex) => {
                                    const key = getKey({
                                        sectionIndex,
                                        entryIndex,
                                        sectionTitle: section.title,
                                        anchor: entry.anchor,
                                        content: entry.content,
                                    });
                                    const isChecked = checked.has(key);
                                    const id = `chson-check-${sectionIndex}-${entryIndex}`;
                                    return (_jsxs("div", { className: cn('flex items-start gap-3 rounded-md px-3 py-3 transition-colors', entryIndex % 2 === 0 ? 'bg-muted/30' : '', isChecked && 'opacity-60'), children: [_jsx(Checkbox, { id: id, checked: isChecked, onCheckedChange: () => toggle(key), className: "mt-0.5" }), _jsxs("label", { htmlFor: id, className: "flex-1 cursor-pointer select-none", children: [_jsx("div", { className: cn('text-sm font-medium leading-snug', isChecked && 'line-through'), children: entry.anchor }), _jsx("div", { className: "mt-0.5 text-sm text-muted-foreground leading-snug", children: entry.content }), entry.details && (_jsx("div", { className: "mt-1", children: _jsx(EntryDetails, { details: entry.details, className: "text-xs" }) }))] })] }, entryIndex));
                                }) }) })] }, sectionIndex));
            })] }));
}
