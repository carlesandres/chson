'use client';

import { Streamdown } from 'streamdown';
import { code } from '@streamdown/code';
import { cn } from 'lib/utils';
import 'streamdown/styles.css';

interface InlineCodeProps {
  children: string;
  language?: string;
  className?: string;
}

/**
 * Compact highlighted code block for table cells and inline usage.
 * No copy button, minimal padding.
 */
export function InlineCode({ children, language, className }: InlineCodeProps) {
  // Wrap the code in a markdown code fence for Streamdown to highlight
  const markdown = `\`\`\`${language || ''}\n${children}\n\`\`\``;

  return (
    <div
      className={cn(
        // Hide streamdown's internal border and header
        'chson-inline-code overflow-auto text-[13px]',
        '[&_[data-streamdown="code-block"]]:my-0 [&_[data-streamdown="code-block"]]:border-0 [&_[data-streamdown="code-block"]]:rounded-none',
        '[&_[data-streamdown="code-block-header"]]:hidden',
        '[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0',
        className,
      )}
    >
      <Streamdown
        plugins={{ code }}
        mode="static"
        shikiTheme={['github-light', 'github-dark']}
        controls={{ code: false }}
      >
        {markdown}
      </Streamdown>
    </div>
  );
}
