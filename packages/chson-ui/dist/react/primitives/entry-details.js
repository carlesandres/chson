'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '../../shadcn/collapsible';
import { ChevronDownIcon } from '../icons';
import { cn } from '../utils/cn';
import { Markdown } from './markdown';
/**
 * Collapsed-by-default disclosure for entry.details (always markdown / GFM).
 */
export function EntryDetails({ details, className, triggerClassName, label, }) {
    const [open, setOpen] = React.useState(false);
    if (!details)
        return null;
    const visible = open ? 'Less' : 'More';
    const accessibleName = label
        ? `${visible} about ${label}`
        : visible;
    return (_jsxs(Collapsible, { open: open, onOpenChange: setOpen, children: [_jsxs(CollapsibleTrigger, { type: "button", "aria-label": accessibleName, className: cn('inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground', triggerClassName), children: [_jsx("span", { "aria-hidden": true, children: visible }), _jsx(ChevronDownIcon, { className: cn('h-3 w-3 transition-transform', open && 'rotate-180'), "aria-hidden": true })] }), _jsx(CollapsibleContent, { className: "mt-1", children: _jsx(Markdown, { content: details, className: className }) })] }));
}
