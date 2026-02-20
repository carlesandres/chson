import { highlightCode } from 'lib/shiki';
import { cn } from 'lib/utils';

interface InlineCodeProps {
  children: string;
  language?: string;
  className?: string;
}

/**
 * Compact highlighted code block for table cells and inline usage.
 * No copy button, minimal padding.
 */
export async function InlineCode({
  children,
  language,
  className,
}: InlineCodeProps) {
  const highlightedHtml = await highlightCode(children, language);

  return (
    <div
      className={cn(
        'shiki-container overflow-auto rounded-lg border border-border p-2.5 text-[13px] [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0',
        className
      )}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}
