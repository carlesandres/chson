'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from './cn';
import { toggleVariants } from './toggle';
const ToggleGroupContext = React.createContext({
    size: 'default',
    variant: 'default',
});
const ToggleGroup = React.forwardRef(({ className, variant, size, children, type, ...props }, ref) => (_jsx(ToggleGroupPrimitive.Root, { ref: ref, type: type, className: cn('flex items-center justify-center gap-1', className), ...props, children: _jsx(ToggleGroupContext.Provider, { value: { variant, size }, children: children }) })));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, value, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    return (_jsx(ToggleGroupPrimitive.Item, { ref: ref, value: value, className: cn(toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
        }), className), ...props, children: children }));
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
export { ToggleGroup, ToggleGroupItem };
