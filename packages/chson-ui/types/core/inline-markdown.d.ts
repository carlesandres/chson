export type InlineMarkdownToken = {
    type: 'text';
    value: string;
} | {
    type: 'code';
    value: string;
} | {
    type: 'strong';
    value: string;
} | {
    type: 'em';
    value: string;
} | {
    type: 'link';
    label: string;
    url: string;
};
/**
 * Markdown-lite inline parser.
 * Supports: `code`, **strong**, *em*, and [label](url).
 * Intentionally does not support nesting or block elements.
 */
export declare function parseInlineMarkdown(input: string): InlineMarkdownToken[];
//# sourceMappingURL=inline-markdown.d.ts.map