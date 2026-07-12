import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { inferColumnFormats } from '../../core/format';
import { getLabels } from '../../core/document';
import { getEntries, getSections } from '../../core/normalize';
import { hasEntryMore } from '../../core/entry-more';
import { EntryMorePopover } from '../primitives/entry-more-popover';
import { cn } from '../utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../shadcn/table';
import { Cell } from './_cell';
/**
 * Cheatsheet renderer: section cards with anchor | content | optional More (popover).
 * The More column is omitted per section when no entry has details or a safe url.
 */
export function Cheatsheet({ data, className }) {
    const { anchorLabel, contentLabel } = getLabels(data);
    const { anchorFormat, contentFormat } = inferColumnFormats(data);
    const sections = getSections(data);
    if (sections.length === 0)
        return _jsx("p", { className: className, children: "No sections found." });
    return (_jsx("div", { className: cn('mt-6 grid gap-5', className), children: sections.map((section, sectionIdx) => {
            const entries = getEntries(section);
            const showMoreColumn = entries.some((entry) => hasEntryMore(entry.details, entry.url));
            return (_jsxs(Card, { className: "border-border/50 bg-card/70 shadow-sm", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { className: "text-base font-semibold", children: section.title }), section.description && (_jsx("p", { className: "text-sm text-muted-foreground", children: section.description }))] }), _jsx(CardContent, { children: _jsx("div", { className: "w-full overflow-x-auto", children: _jsx("div", { className: "min-w-[640px]", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-[40%]", children: anchorLabel }), _jsx(TableHead, { children: contentLabel }), showMoreColumn ? (_jsx(TableHead, { className: "w-14", children: _jsx("span", { className: "sr-only", children: "More" }) })) : null] }) }), _jsx(TableBody, { children: entries.map((entry, entryIdx) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: cn('align-middle', anchorFormat === 'code' && 'p-0'), children: _jsx(Cell, { text: entry.anchor, format: anchorFormat }) }), _jsx(TableCell, { className: cn('align-middle', contentFormat === 'code' && 'p-0'), children: _jsx(Cell, { text: entry.content, format: contentFormat }) }), showMoreColumn ? (_jsx(TableCell, { className: "align-middle text-right", children: _jsx(EntryMorePopover, { details: entry.details, url: entry.url, label: entry.anchor }) })) : null] }, entryIdx))) })] }) }) }) })] }, sectionIdx));
        }) }));
}
