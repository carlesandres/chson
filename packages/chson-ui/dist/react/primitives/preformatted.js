import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../utils/cn';
/**
 * Compact preformatted block for command/code-like cells.
 */
export function Preformatted({ children, className }) {
    return (_jsx("pre", { className: cn('inline-block rounded border bg-muted p-2 text-[13px] leading-snug overflow-auto', className), children: children }));
}
