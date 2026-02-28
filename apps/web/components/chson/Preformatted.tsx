'use client';

import { cn } from 'lib/utils';

interface PreformattedProps {
  children: string;
  className?: string;
}

/**
 * Compact highlighted code block for table cells and inline usage.
 * No copy button, minimal padding.
 */
export function Preformatted({
  children,
  className,
}: PreformattedProps) {
  return (
    <pre
      className={cn(
        'chson-inline-code border rounded p-2 inline-block bg-muted overflow-auto text-[13px]',
        className,
      )}
    >
      {children}
    </pre>
  );
}
