export interface EntryMorePopoverProps {
    details?: string;
    url?: string;
    className?: string;
    /** Used for a clearer accessible name, e.g. entry.anchor */
    label?: string;
}
/**
 * Single "More" control for cheatsheet rows: opens a popover with markdown
 * details and/or a reference link. At most one per entry.
 */
export declare function EntryMorePopover({ details, url, className, label }: EntryMorePopoverProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=entry-more-popover.d.ts.map