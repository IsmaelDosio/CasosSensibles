import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface Option {
  value: string;
  label?: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: readonly Option[] | readonly string[];
  placeholder?: string;
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, className, invalid, ...rest },
  ref,
) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <select
      ref={ref}
      className={cn(
        'h-9 w-full appearance-none rounded-sm border bg-surface px-2.5 pr-8 text-sm text-text',
        'focus:outline-none focus:ring-1 focus:ring-text focus:border-text',
        'bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem] cursor-pointer',
        invalid ? 'border-status-ur' : 'border-border-strong',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%235b5b5b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {placeholder !== undefined && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {normalized.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label ?? o.value}
        </option>
      ))}
    </select>
  );
});
