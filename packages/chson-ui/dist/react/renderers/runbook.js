import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { looksLikeCommand } from '../../core/runbook';
import { getEntries, getSections } from '../../core/normalize';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shadcn/accordion';
import { Badge } from '../../shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { EntryDetails } from '../primitives/entry-details';
import { Preformatted } from '../primitives/preformatted';
import { cn } from '../utils/cn';
/**
 * Runbook renderer: accordion-based operational flow.
 */
export function Runbook({ data, className }) {
    const sections = getSections(data);
    if (sections.length === 0)
        return _jsx("p", { className: className, children: "No procedures found." });
    return (_jsx("div", { className: cn('mt-6 space-y-5', className), children: sections.map((section, sectionIdx) => {
            const entries = getEntries(section);
            return (_jsxs(Card, { className: "border-border/50 bg-card/70 shadow-sm", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "font-mono text-[11px] tabular-nums", children: sectionIdx + 1 }), _jsx(CardTitle, { className: "text-base font-semibold", children: section.title })] }), section.description && (_jsx("p", { className: "text-sm text-muted-foreground", children: section.description }))] }), _jsx(CardContent, { className: "pt-0", children: _jsx(Accordion, { type: "multiple", className: "w-full", children: entries.map((entry, entryIdx) => {
                                const isCommand = looksLikeCommand(entry.content);
                                return (_jsxs(AccordionItem, { value: `${sectionIdx}-${entryIdx}`, className: "border-border/50", children: [_jsx(AccordionTrigger, { className: "py-3 text-sm font-medium hover:no-underline", children: _jsxs("div", { className: "flex items-center gap-2 text-left", children: [_jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [entryIdx + 1, "."] }), _jsx("span", { children: entry.anchor })] }) }), _jsx(AccordionContent, { children: _jsxs("div", { className: "space-y-2 pl-5", children: [isCommand ? (_jsx(Preformatted, { className: "block w-full", children: entry.content })) : (_jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: entry.content })), entry.details && (_jsx(EntryDetails, { details: entry.details, label: entry.anchor, className: "text-xs" })), entry.url && (_jsx("a", { href: entry.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-xs text-primary hover:underline", children: "Documentation \u2192" }))] }) })] }, entryIdx));
                            }) }) })] }, sectionIdx));
        }) }));
}
