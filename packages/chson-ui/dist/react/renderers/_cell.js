import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { InlineMarkdown } from '../primitives/inline-markdown';
import { Preformatted } from '../primitives/preformatted';
import { cn } from '../utils/cn';
function TextCell({ text, className }) {
    return _jsx("div", { className: cn('whitespace-pre-wrap', className), children: text });
}
function MarkdownCell({ text, className }) {
    return _jsx(InlineMarkdown, { text: text, className: className });
}
/** Primary cell content only (anchor or content). Details/url live in EntryMorePopover. */
export function Cell({ text, format, className }) {
    if (!text)
        return null;
    if (format === 'code') {
        return _jsx(Preformatted, { className: className, children: text });
    }
    if (format === 'markdown') {
        return _jsx(MarkdownCell, { text: text, className: className });
    }
    return _jsx(TextCell, { text: text, className: className });
}
