import type { ReactNode } from 'react';

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <div className="text-sm font-semibold text-text">{title}</div>
      {hint && <div className="max-w-md text-xs text-text-muted">{hint}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
