import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { getEntries, getSections } from '../../core/normalize';
import { cn } from '../utils/cn';
import { Separator } from '../../shadcn/separator';
/**
 * TLDR renderer: compact Q&A layout.
 */
export function Tldr({ data, className }) {
    const sections = getSections(data);
    if (sections.length === 0)
        return _jsx("p", { className: className, children: "No content found." });
    return (_jsx("div", { className: cn('mt-6 space-y-6', className), children: sections.map((section, sectionIdx) => {
            const entries = getEntries(section);
            return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: section.title }), _jsx(Separator, { className: "flex-1" })] }), _jsx("div", { className: "mt-3 space-y-0", children: entries.map((entry, entryIdx) => (_jsxs("div", { className: cn('rounded-md px-3 py-2.5', entryIdx % 2 === 0 ? 'bg-muted/30' : ''), children: [_jsx("div", { className: "text-sm font-medium leading-snug", children: entry.anchor }), _jsxs("div", { className: "mt-0.5 text-sm text-muted-foreground leading-snug", children: [_jsx("span", { className: "mr-1.5 text-primary", children: "\u2192" }), entry.content] }), entry.details && (_jsx("div", { className: "mt-1 text-xs text-muted-foreground/70", children: entry.details }))] }, entryIdx))) })] }, sectionIdx));
        }) }));
}
