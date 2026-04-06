import type { ChSONDocument } from '@chson/schema';
import { type ChecklistProps } from './checklist';
export interface ChsonRendererProps {
    data: ChSONDocument;
    className?: string;
    checklist?: Pick<ChecklistProps, 'checkedKeys' | 'defaultCheckedKeys' | 'onCheckedKeysChange' | 'getKey'>;
}
export declare function ChsonRenderer({ data, className, checklist }: ChsonRendererProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=chson-renderer.d.ts.map