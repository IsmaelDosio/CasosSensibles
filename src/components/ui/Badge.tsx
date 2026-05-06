import type { Status } from '@/types';
import { cn } from '@/lib/cn';

const statusStyles: Record<Status, string> = {
  UR: 'bg-[var(--c-status-ur-bg)] text-status-ur',
  CLOSED: 'bg-[var(--c-status-closed-bg)] text-status-closed',
  CUFC: 'bg-[var(--c-status-cufc-bg)] text-status-cufc',
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-sm px-1.5 text-2xs font-semibold uppercase tracking-label',
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-sm border border-border bg-surface px-1.5 text-2xs font-medium uppercase tracking-label text-text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
