import type { ChSONDocument } from '@chson/schema';
export type DocumentType = NonNullable<ChSONDocument['documentType']> | 'cheatsheet';
export declare function getDocumentType(data: ChSONDocument): DocumentType;
export declare function getLabels(data: ChSONDocument): {
    anchorLabel: string;
    contentLabel: string;
};
export declare function getRetrievalDirection(data: ChSONDocument): NonNullable<ChSONDocument['retrievalDirection']>;
//# sourceMappingURL=document.d.ts.map