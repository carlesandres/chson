import type { ChSONDocument } from '@chson/schema';
export interface CheatsheetProps {
    data: ChSONDocument;
    className?: string;
}
/**
 * Cheatsheet renderer: section cards with anchor | content | optional More (popover).
 * The More column is omitted per section when no entry has details or a safe url.
 */
export declare function Cheatsheet({ data, className }: CheatsheetProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=cheatsheet.d.ts.map