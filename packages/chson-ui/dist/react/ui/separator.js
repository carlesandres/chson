import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../utils/cn';
export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }) {
    return (_jsx("div", { role: decorative ? 'none' : 'separator', "aria-orientation": decorative ? undefined : orientation, className: cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className), ...props }));
}
