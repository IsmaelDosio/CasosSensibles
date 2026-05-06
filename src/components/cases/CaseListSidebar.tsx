import type { Case } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { fmtDate } from '@/lib/format';
import { cn } from '@/lib/cn';

interface Props {
  cases: Case[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CaseListSidebar({ cases, selectedId, onSelect }: Props) {
  return (
    <aside className="scroll-thin h-full overflow-auto border-r border-border bg-surface">
      <div className="sticky top-0 flex h-9 items-center justify-between border-b border-border bg-surface-2 px-3">
        <span className="label-caps">Cases · {cases.length}</span>
      </div>
      <ul>
        {cases.map((c) => {
          const active = c.id === selectedId;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={cn(
                  'flex w-full flex-col gap-1 border-b border-border px-3 py-2 text-left transition-colors',
                  active ? 'bg-surface-2' : 'hover:bg-surface-2',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text">{c.caseNumber}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center justify-between text-2xs text-text-muted">
                  <span className="uppercase tracking-label">
                    {c.market} · {c.channel}
                  </span>
                  <span className="font-mono">{fmtDate(c.firstContact)}</span>
                </div>
                <div className="truncate text-xs text-text-muted">{c.resp} · {c.category}</div>
              </button>
            </li>
          );
        })}
        {!cases.length && (
          <li className="px-3 py-6 text-center text-2xs text-text-subtle">No cases.</li>
        )}
      </ul>
    </aside>
  );
}
