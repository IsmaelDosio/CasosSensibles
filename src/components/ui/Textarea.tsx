import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full rounded-sm border bg-surface px-2.5 py-2 text-sm text-text placeholder:text-text-subtle',
        'focus:outline-none focus:ring-1 focus:ring-text focus:border-text resize-y',
        invalid ? 'border-status-ur' : 'border-border-strong',
        className,
      )}
      {...rest}
    />
  );
});
