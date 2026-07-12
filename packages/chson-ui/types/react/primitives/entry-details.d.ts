export interface EntryDetailsProps {
    details: string;
    className?: string;
    triggerClassName?: string;
    /** Used for a clearer accessible name, e.g. entry.anchor */
    label?: string;
}
/**
 * Collapsed-by-default disclosure for entry.details (always markdown / GFM).
 */
export declare function EntryDetails({ details, className, triggerClassName, label, }: EntryDetailsProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=entry-details.d.ts.map