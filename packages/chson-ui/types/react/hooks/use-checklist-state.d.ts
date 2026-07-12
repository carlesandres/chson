import { defaultChecklistKey, type ChecklistKeyArgs } from '../../core/checklist';
export declare function checklistStorageKey(scope: string): string;
export interface UseChecklistStateOptions {
    getKey?: (args: ChecklistKeyArgs) => string;
}
/**
 * Persist checklist checked keys in localStorage for a given scope.
 *
 * Hydration: state starts as `[]` on the first client render, then loads from
 * localStorage in an effect. Expect a brief flash of unchecked UI when stored
 * progress exists (SSR/CSR safe; not a silent data loss).
 */
export declare function useChecklistState(scope: string, options?: UseChecklistStateOptions): {
    checkedKeys: string[];
    onCheckedKeysChange: (next: string[]) => void;
    getKey: typeof defaultChecklistKey;
};
//# sourceMappingURL=use-checklist-state.d.ts.map