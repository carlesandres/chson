'use client';

import { Streamdown } from 'streamdown';
import { code } from '@streamdown/code';
import { cn } from 'lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language,
  title,
  showCopy = true,
  className,
}: CodeBlockProps) {
  // Wrap the code in a markdown code fence for Streamdown to highlight
  const markdown = `\`\`\`${language || ''}\n${children}\n\`\`\``;

  return (
    <div className={cn('group relative', className)}>
      {title && (
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {title}
        </div>
      )}
      <div className="relative">
        <div
          className={cn(
            // Hide streamdown's internal border and header
            'chson-code-block overflow-auto text-[13px]',
            '[&_[data-streamdown="code-block"]]:my-0 [&_[data-streamdown="code-block"]]:border-0 [&_[data-streamdown="code-block"]]:rounded-none',
            '[&_[data-streamdown="code-block-header"]]:hidden',
            '[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0',
          )}
        >
          <Streamdown
            plugins={{ code }}
            mode="static"
            shikiTheme={['github-light', 'github-dark']}
            controls={{ code: showCopy }}
          >
            {markdown}
          </Streamdown>
        </div>
      </div>
    </div>
  );
}
