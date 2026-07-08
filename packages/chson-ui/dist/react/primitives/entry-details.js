'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '../../shadcn/collapsible';
import { ChevronDownIcon } from '../icons';
import { cn } from '../utils/cn';
/**
 * Collapsed-by-default disclosure for entry.details.
 */
export function EntryDetails({ details, className, triggerClassName }) {
    const [open, setOpen] = React.useState(false);
    if (!details)
        return null;
    return (_jsxs(Collapsible, { open: open, onOpenChange: setOpen, children: [_jsxs(CollapsibleTrigger, { type: "button", className: cn('inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground', triggerClassName), children: [_jsx("span", { children: open ? 'Less' : 'More' }), _jsx(ChevronDownIcon, { className: cn('h-3 w-3 transition-transform', open && 'rotate-180'), "aria-hidden": true })] }), _jsx(CollapsibleContent, { className: cn('mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground', className), children: details })] }));
}
