import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldGroupProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldGroup({ label, hint, error, required, children, className }: FieldGroupProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="label-caps">
        {label}
        {required && <span className="ml-1 text-status-ur">*</span>}
      </span>
      {children}
      {error ? (
        <span className="text-2xs text-status-ur">{error}</span>
      ) : hint ? (
        <span className="text-2xs text-text-subtle">{hint}</span>
      ) : null}
    </div>
  );
}
