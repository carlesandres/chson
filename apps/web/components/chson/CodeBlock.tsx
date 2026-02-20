'use client';

import { useState } from 'react';
import { Button } from 'components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/ui/tooltip';
import { Check, Copy } from 'lucide-react';
import { cn } from 'lib/utils';

interface CodeBlockProps {
  children: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  title,
  showCopy = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group relative', className)}>
      {title && (
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className="overflow-auto rounded-xl border border-border bg-muted/50 p-4 pr-12">
          <code className="font-mono text-[13px]">{children}</code>
        </pre>
        {showCopy && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy code</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy to clipboard'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
