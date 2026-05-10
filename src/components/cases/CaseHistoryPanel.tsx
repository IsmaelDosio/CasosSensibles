import type { Case } from '@/types';
import { fmtDateTime } from '@/lib/format';

interface Event {
  label: string;
  at: string;
  by: string;
  tone?: 'default' | 'warn';
}

export function CaseHistoryPanel({ case: c }: { case: Case }) {
  const events: Event[] = [];
  events.push({ label: 'Created', at: c.createdAt, by: c.createdBy });
  if (c.updatedAt && c.updatedAt !== c.createdAt) {
    events.push({ label: 'Updated', at: c.updatedAt, by: c.updatedBy });
  }
  if (c.deletedAt) {
    events.push({ label: 'Archived', at: c.deletedAt, by: c.deletedBy ?? '—', tone: 'warn' });
  }
  events.sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <aside className="bg-surface">
      <div className="flex h-9 items-center border-b border-border bg-surface-2 px-3">
        <span className="label-caps">History</span>
      </div>

      <div className="px-3 py-3">
        <div className="mb-3 grid grid-cols-2 gap-y-2 text-2xs">
          <Meta label="Case ID" value={c.id} />
          <Meta label="Status" value={c.status} />
          <Meta label="Created" value={fmtDateTime(c.createdAt)} />
          <Meta label="By" value={c.createdBy} />
          <Meta label="Updated" value={fmtDateTime(c.updatedAt)} />
          <Meta label="By" value={c.updatedBy} />
        </div>

        <div className="mb-1 label-caps">Activity</div>
        <ul className="relative ml-2 border-l border-border-strong pl-3">
          {events.map((e, i) => (
            <li key={i} className="relative py-1.5">
              <span
                className={
                  'absolute -left-[5px] top-2.5 h-2 w-2 rounded-full ' +
                  (e.tone === 'warn' ? 'bg-status-ur' : 'bg-text')
                }
              />
              <div className="text-xs font-medium text-text">{e.label}</div>
              <div className="text-2xs text-text-muted">{fmtDateTime(e.at)} · {e.by}</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="label-caps">{label}</span>
      <span className="truncate text-xs text-text">{value}</span>
    </div>
  );
}
