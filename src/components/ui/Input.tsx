import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-sm border bg-surface px-2.5 text-sm text-text placeholder:text-text-subtle',
        'focus:outline-none focus:ring-1 focus:ring-text focus:border-text',
        invalid ? 'border-status-ur' : 'border-border-strong',
        className,
      )}
      {...rest}
    />
  );
});
