import { highlightCode } from 'lib/shiki';
import { CopyButton } from './CopyButton';
import { cn } from 'lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export async function CodeBlock({
  children,
  language,
  title,
  showCopy = true,
  className,
}: CodeBlockProps) {
  const highlightedHtml = await highlightCode(children, language);

  return (
    <div className={cn('group relative', className)}>
      {title && (
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {title}
        </div>
      )}
      <div className="relative">
        <div
          className="shiki-container overflow-auto rounded-xl border border-border p-4 pr-12 text-[13px] [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
        {showCopy && <CopyButton text={children} />}
      </div>
    </div>
  );
}
