import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { getHostname } from '../../core/bookmarks';
import { safeExternalUrl } from '../../core/url';
import { getEntries, getSections } from '../../core/normalize';
import { ExternalLinkIcon } from '../icons';
import { Markdown } from '../primitives/markdown';
import { Badge } from '../../shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { cn } from '../utils/cn';
/**
 * Bookmarks renderer: card grid of external links.
 */
export function Bookmarks({ data, className }) {
    const sections = getSections(data);
    if (sections.length === 0)
        return _jsx("p", { className: className, children: "No bookmarks found." });
    return (_jsx("div", { className: cn('mt-6 space-y-8', className), children: sections.map((section, sectionIdx) => {
            const entries = getEntries(section);
            return (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex items-center gap-3", children: [_jsx("h2", { className: "text-lg font-semibold", children: section.title }), section.description && (_jsx("span", { className: "text-sm text-muted-foreground", children: section.description }))] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: entries.map((entry, entryIdx) => {
                            const url = safeExternalUrl(entry.content);
                            const hostname = getHostname(url ?? entry.content);
                            return (_jsx("a", { href: url ?? undefined, target: "_blank", rel: "noopener noreferrer", className: cn('group block', !url && 'pointer-events-none'), "aria-disabled": url ? undefined : true, children: _jsxs(Card, { className: "h-full border-border/50 bg-card/70 shadow-sm transition-all hover:border-primary/50 hover:shadow-md", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx(CardTitle, { className: "text-base font-semibold leading-snug group-hover:text-primary transition-colors", children: entry.anchor }), _jsx(ExternalLinkIcon, { className: "h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" })] }), entry.details && (_jsx("div", { className: "line-clamp-3 pt-1.5", children: _jsx(Markdown, { content: entry.details }) }))] }), _jsx(CardContent, { className: "pt-0", children: _jsx(Badge, { variant: "secondary", className: "font-mono text-[11px] font-normal", children: hostname }) })] }) }, entryIdx));
                        }) })] }, sectionIdx));
        }) }));
}
