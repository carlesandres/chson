// Typecheck-only fallback for Fumadocs generated output in `.source/`.
// Next build/dev should still generate the real module via `fumadocs-mdx`.

export const docs: any = {
  toFumadocsSource() {
    return {};
  },
};
