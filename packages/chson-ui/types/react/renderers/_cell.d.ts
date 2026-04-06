import type { Entry } from '@chson/schema';
import type { CellFormat } from '../../core/format';
export interface CellProps {
    text: string;
    format: CellFormat;
    details?: Entry['details'];
    url?: Entry['url'];
    className?: string;
}
export declare function Cell({ text, format, details, url, className }: CellProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=_cell.d.ts.map