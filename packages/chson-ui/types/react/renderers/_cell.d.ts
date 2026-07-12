import type { CellFormat } from '../../core/format';
export interface CellProps {
    text: string;
    format: CellFormat;
    className?: string;
}
/** Primary cell content only (anchor or content). Details/url live in EntryMorePopover. */
export declare function Cell({ text, format, className }: CellProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=_cell.d.ts.map