import type { ChSONDocument } from '@chson/schema';
export type CellFormat = 'text' | 'markdown' | 'code';
export declare function inferColumnFormats(data: ChSONDocument): {
    anchorFormat: CellFormat;
    contentFormat: CellFormat;
};
//# sourceMappingURL=format.d.ts.map