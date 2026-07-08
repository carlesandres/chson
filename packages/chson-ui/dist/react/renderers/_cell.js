import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { safeExternalUrl } from '../../core/url';
import { ExternalLinkIcon } from '../icons';
import { EntryDetails } from '../primitives/entry-details';
import { InlineMarkdown } from '../primitives/inline-markdown';
import { Preformatted } from '../primitives/preformatted';
import { cn } from '../utils/cn';
function TextCell({ text, details, url, className }) {
    const safeUrl = url ? safeExternalUrl(url) : null;
    return (_jsxs("div", { className: cn('space-y-1', className), children: [_jsx("div", { className: "whitespace-pre-wrap", children: text }), details && _jsx(EntryDetails, { details: details }), safeUrl && (_jsxs("a", { href: safeUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-sm text-primary hover:underline", children: [_jsx(ExternalLinkIcon, { className: "h-3 w-3" }), _jsx("span", { children: "Link" })] }))] }));
}
function MarkdownCell({ text, details, url, className }) {
    const safeUrl = url ? safeExternalUrl(url) : null;
    return (_jsxs("div", { className: cn('space-y-1', className), children: [_jsx(InlineMarkdown, { text: text }), details && _jsx(EntryDetails, { details: details }), safeUrl && (_jsxs("a", { href: safeUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-sm text-primary hover:underline", children: [_jsx(ExternalLinkIcon, { className: "h-3 w-3" }), _jsx("span", { children: "Link" })] }))] }));
}
export function Cell({ text, format, details, url, className }) {
    if (!text)
        return null;
    if (format === 'code') {
        return _jsx(Preformatted, { className: className, children: text });
    }
    if (format === 'markdown') {
        return _jsx(MarkdownCell, { text: text, details: details, url: url, className: className });
    }
    return _jsx(TextCell, { text: text, details: details, url: url, className: className });
}
