import { cn } from '@/lib/cn';

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'ur' | 'closed' | 'cufc' | 'muted';
  className?: string;
}

const toneColor: Record<NonNullable<Props['tone']>, string> = {
  default: 'text-text',
  ur: 'text-status-ur',
  closed: 'text-status-closed',
  cufc: 'text-status-cufc',
  muted: 'text-text-muted',
};

export function KpiCard({ label, value, hint, tone = 'default', className }: Props) {
  return (
    <div className={cn('flex flex-col justify-between border border-border bg-surface p-4 min-h-[96px]', className)}>
      <span className="label-caps">{label}</span>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={cn('text-3xl font-semibold tabular-nums', toneColor[tone])}>{value}</span>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </div>
    </div>
  );
}
