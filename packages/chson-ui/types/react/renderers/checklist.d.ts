import type { ChSONDocument } from '@chson/schema';
import { type ChecklistKeyArgs } from '../../core/checklist';
export interface ChecklistProps {
    data: ChSONDocument;
    className?: string;
    checkedKeys?: string[];
    defaultCheckedKeys?: string[];
    onCheckedKeysChange?: (keys: string[]) => void;
    getKey?: (args: ChecklistKeyArgs) => string;
}
/**
 * Checklist renderer: interactive task list.
 * Controlled by `checkedKeys`/`onCheckedKeysChange` when provided.
 */
export declare function Checklist({ data, className, checkedKeys, defaultCheckedKeys, onCheckedKeysChange, getKey, }: ChecklistProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=checklist.d.ts.map