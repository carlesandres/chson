import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { parseInlineMarkdown } from '../../core/inline-markdown';
import { safeExternalUrl } from '../../core/url';
import { cn } from '../utils/cn';
export function InlineMarkdown({ text, className, linkClassName }) {
    const tokens = parseInlineMarkdown(text);
    return (_jsx("span", { className: cn('whitespace-pre-wrap', className), children: tokens.map((token, idx) => {
            switch (token.type) {
                case 'text':
                    return _jsx(React.Fragment, { children: token.value }, idx);
                case 'code':
                    return (_jsx("code", { className: "rounded bg-muted px-1 py-0.5 font-mono text-[0.925em]", children: token.value }, idx));
                case 'strong':
                    return (_jsx("strong", { className: "font-semibold", children: token.value }, idx));
                case 'em':
                    return (_jsx("em", { className: "italic", children: token.value }, idx));
                case 'link':
                    {
                        const safeUrl = safeExternalUrl(token.url);
                        if (!safeUrl)
                            return _jsx(React.Fragment, { children: token.label }, idx);
                        return (_jsx("a", { href: safeUrl, target: "_blank", rel: "noopener noreferrer", className: cn('text-primary hover:underline', linkClassName), children: token.label }, idx));
                    }
                default:
                    return null;
            }
        }) }));
}
