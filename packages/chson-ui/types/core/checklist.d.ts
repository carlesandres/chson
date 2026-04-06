import type { ChSONDocument } from '@chson/schema';
export type ChecklistKeyArgs = {
    sectionIndex: number;
    entryIndex: number;
    sectionTitle: string;
    anchor: string;
    content: string;
};
export declare function defaultChecklistKey({ sectionIndex, entryIndex }: ChecklistKeyArgs): string;
export declare function countChecklistEntries(data: ChSONDocument): number;
export declare function countCheckedEntries(data: ChSONDocument, checkedKeys: ReadonlySet<string>, getKey: (args: ChecklistKeyArgs) => string): number;
export declare function progressPercent(checked: number, total: number): number;
//# sourceMappingURL=checklist.d.ts.map