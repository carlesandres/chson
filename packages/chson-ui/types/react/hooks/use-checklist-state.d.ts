import { defaultChecklistKey, type ChecklistKeyArgs } from '../../core/checklist';
export declare function checklistStorageKey(scope: string): string;
export interface UseChecklistStateOptions {
    getKey?: (args: ChecklistKeyArgs) => string;
}
export declare function useChecklistState(scope: string, options?: UseChecklistStateOptions): {
    checkedKeys: string[];
    onCheckedKeysChange: (next: string[]) => void;
    getKey: typeof defaultChecklistKey;
};
//# sourceMappingURL=use-checklist-state.d.ts.map