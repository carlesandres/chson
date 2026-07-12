'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { safeExternalUrl } from '../../core/url';
import { hasEntryMore } from '../../core/entry-more';
import { Popover, PopoverContent, PopoverTrigger } from '../../shadcn/popover';
import { ExternalLinkIcon } from '../icons';
import { cn } from '../utils/cn';
import { Markdown } from './markdown';
export { hasEntryMore } from '../../core/entry-more';
/**
 * Single "More" control for cheatsheet rows: opens a popover with markdown
 * details and/or a reference link. At most one per entry.
 */
export function EntryMorePopover({ details, url, className, label }) {
    const safeUrl = url ? safeExternalUrl(url) : null;
    if (!hasEntryMore(details, url))
        return null;
    const accessibleName = label ? `More about ${label}` : 'More';
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx("button", { type: "button", className: cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', className), "aria-label": accessibleName, children: "More" }) }), _jsxs(PopoverContent, { align: "end", className: "w-80 max-w-[min(20rem,calc(100vw-2rem))] space-y-3 p-3", children: [details ? _jsx(Markdown, { content: details }) : null, safeUrl ? (_jsxs("a", { href: safeUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-sm text-primary hover:underline", children: [_jsx(ExternalLinkIcon, { className: "h-3 w-3", "aria-hidden": true }), _jsx("span", { children: "Link" })] })) : null] })] }));
}
