import type { Case } from '@/types';
import { StatusBadge, Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fmtDate, fmtGesture } from '@/lib/format';

interface Props {
  case: Case;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRestore?: () => void;
}

export function CaseDetailPanel({ case: c, canDelete, onEdit, onDelete, onRestore }: Props) {
  const isDeleted = !!c.deletedAt;
  return (
    <section className="bg-surface">
      <header className="border-b border-border bg-surface px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base text-text">{c.caseNumber}</span>
              <StatusBadge status={c.status} />
              {isDeleted && (
                <Tag className="border-status-ur bg-[var(--c-status-ur-bg)] text-status-ur">
                  Archived
                </Tag>
              )}
            </div>
            <div className="mt-1 text-xs text-text-muted">
              {c.market} · {c.channel} · First contact {fmtDate(c.firstContact)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDeleted ? (
              onRestore && canDelete && (
                <Button variant="secondary" onClick={onRestore}>
                  Restore
                </Button>
              )
            ) : (
              <>
                <Button variant="secondary" onClick={onEdit}>
                  Edit
                </Button>
                {canDelete && (
                  <Button variant="danger" onClick={onDelete}>
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-px bg-border md:grid-cols-2">
        <Group title="Identification">
          <Field label="CASE" value={c.caseNumber} mono />
          <Field label="FIRST CONTACT (FIRST)" value={fmtDate(c.firstContact)} mono />
          <Field label="STATUS" value={c.status} />
          <Field label="CATEGORY" value={c.category} />
        </Group>

        <Group title="Contact">
          <Field label="CHANNEL" value={c.channel} />
          <Field label="MARKET" value={c.market} />
          <Field label="RESP" value={c.resp} />
          <Field label="BU" value={c.bu} />
        </Group>

        <Group title="Operations">
          <Field label="WH / STORE / COURIER" value={c.whStoreCourier} />
          <Field label="SKU" value={c.sku} mono />
        </Group>

        <Group title="Gesture">
          <Field label="GESTURE" value={fmtGesture(c.gesture)} />
        </Group>
      </div>

      <Group title="Comment" className="border-t border-border">
        <p className="text-sm text-text">{c.comment}</p>
      </Group>

      <Group title="Description" className="border-t border-border">
        <p className="whitespace-pre-wrap text-sm leading-6 text-text">{c.description}</p>
      </Group>
    </section>
  );
}

function Group({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface px-6 py-4 ${className}`}>
      <div className="label-caps mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="label-caps">{label}</span>
      <span className={`text-sm text-text ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  );
}
