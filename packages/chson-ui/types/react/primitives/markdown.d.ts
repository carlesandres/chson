export interface MarkdownProps {
    content: string;
    className?: string;
}
/**
 * Renders entry.details (and similar fields) as GitHub-Flavored Markdown via Streamdown.
 * Link targets are restricted via safeExternalUrl.
 */
export declare function Markdown({ content, className }: MarkdownProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=markdown.d.ts.map