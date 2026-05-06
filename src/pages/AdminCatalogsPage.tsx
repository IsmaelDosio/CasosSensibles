import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCatalogsStore, isLocked, selectByCatalog } from '@/store/catalogs.store';
import { useCasesStore } from '@/store/cases.store';
import { CATALOG_KEYS, type CatalogKey, type CatalogValue } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';

const CATALOG_FIELD: Record<CatalogKey, keyof import('@/types').Case> = {
  CHANNEL: 'channel',
  MARKET: 'market',
  RESP: 'resp',
  CATEGORY: 'category',
  STATUS: 'status',
};

export function AdminCatalogsPage() {
  const [active, setActive] = useState<CatalogKey>('CHANNEL');
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="text-sm font-semibold uppercase tracking-label">Catalogs</div>
        <div className="text-2xs text-text-muted">
          Manage dropdown values. Catalog values are never hard-deleted — use active/inactive states.
        </div>
      </div>
      <div className="flex border-b border-border bg-surface">
        {CATALOG_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={cn(
              'h-9 px-4 text-xs font-semibold uppercase tracking-label border-b-2 -mb-px',
              active === k
                ? 'border-text text-text'
                : 'border-transparent text-text-muted hover:text-text',
            )}
          >
            {k}
            {isLocked(k) && (
              <span className="ml-1 text-2xs font-normal normal-case tracking-normal text-text-subtle">
                (locked)
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-bg">
        <CatalogTable key={active} catalog={active} />
      </div>
    </div>
  );
}

function CatalogTable({ catalog }: { catalog: CatalogKey }) {
  const values = useCatalogsStore(useShallow(selectByCatalog(catalog)));
  const addValue = useCatalogsStore((s) => s.addValue);
  const updateValue = useCatalogsStore((s) => s.updateValue);
  const setActive = useCatalogsStore((s) => s.setActive);
  const cases = useCasesStore((s) => s.cases);

  const usageCount = useMemo(() => {
    const field = CATALOG_FIELD[catalog];
    const map = new Map<string, number>();
    cases.forEach((c) => {
      const v = String(c[field] ?? '');
      map.set(v, (map.get(v) ?? 0) + 1);
    });
    return map;
  }, [cases, catalog]);

  const [newValue, setNewValue] = useState('');
  const [editing, setEditing] = useState<{ id: string; original: string; draft: string } | null>(null);
  const [confirmEdit, setConfirmEdit] = useState<{ id: string; from: string; to: string; count: number } | null>(null);

  const locked = isLocked(catalog);

  const handleAdd = () => {
    if (locked) return;
    const trimmed = newValue.trim();
    if (!trimmed) return;
    addValue(catalog, trimmed);
    setNewValue('');
  };

  const startEdit = (cv: CatalogValue) => {
    if (locked) return;
    setEditing({ id: cv.id, original: cv.value, draft: cv.value });
  };

  const commitEdit = () => {
    if (!editing) return;
    const trimmed = editing.draft.trim();
    if (!trimmed || trimmed === editing.original) {
      setEditing(null);
      return;
    }
    const count = usageCount.get(editing.original) ?? 0;
    if (count > 0) {
      setConfirmEdit({ id: editing.id, from: editing.original, to: trimmed, count });
    } else {
      updateValue(editing.id, trimmed);
      setEditing(null);
    }
  };

  const finalizeConfirmedEdit = () => {
    if (!confirmEdit) return;
    updateValue(confirmEdit.id, confirmEdit.to);
    setConfirmEdit(null);
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      {locked && (
        <div className="mb-4 border border-border-strong bg-surface px-4 py-3 text-xs text-text-muted">
          <strong className="text-text">{catalog}</strong> is a system catalog. Its values are
          referenced by code paths throughout the application and cannot be added, edited, deactivated
          or removed in Phase 0.
        </div>
      )}

      {!locked && (
        <div className="mb-4 flex items-end gap-2 border border-border-strong bg-surface px-3 py-3">
          <div className="flex flex-1 flex-col gap-1">
            <span className="label-caps">Add new value</span>
            <Input
              placeholder={`New ${catalog} value…`}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <Button variant="primary" onClick={handleAdd} disabled={!newValue.trim()}>
            Add
          </Button>
        </div>
      )}

      <div className="border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2">
            <tr>
              <Th>Value</Th>
              <Th>State</Th>
              <Th className="text-right">In use by</Th>
              <Th className="w-40 text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {values.map((cv) => {
              const count = usageCount.get(cv.value) ?? 0;
              const isEditing = editing?.id === cv.id;
              return (
                <tr key={cv.id} className="border-t border-border">
                  <Td>
                    {isEditing ? (
                      <Input
                        autoFocus
                        value={editing!.draft}
                        onChange={(e) =>
                          setEditing((s) => (s ? { ...s, draft: e.target.value } : s))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit();
                          if (e.key === 'Escape') setEditing(null);
                        }}
                      />
                    ) : (
                      <span className="font-medium">{cv.value}</span>
                    )}
                  </Td>
                  <Td>
                    {locked ? (
                      <span className="text-xs uppercase tracking-label text-text-subtle">
                        Locked
                      </span>
                    ) : cv.active ? (
                      <span className="text-xs uppercase tracking-label text-status-closed">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs uppercase tracking-label text-text-subtle">
                        Inactive
                      </span>
                    )}
                  </Td>
                  <Td className="text-right text-xs text-text-muted">
                    {count > 0 ? `${count} cases` : '—'}
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1.5">
                      {!locked && (
                        <>
                          {isEditing ? (
                            <>
                              <Button size="sm" variant="primary" onClick={commitEdit}>
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => startEdit(cv)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setActive(cv.id, !cv.active)}
                              >
                                {cv.active ? 'Deactivate' : 'Activate'}
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
            {!values.length && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-text-subtle">
                  No values yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!confirmEdit}
        onClose={() => setConfirmEdit(null)}
        title="Rename used catalog value"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmEdit(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={finalizeConfirmedEdit}>
              Rename anyway
            </Button>
          </>
        }
      >
        <p className="text-sm">
          The value <strong className="font-mono">{confirmEdit?.from}</strong> is referenced by{' '}
          <strong>{confirmEdit?.count}</strong>{' '}
          existing case{(confirmEdit?.count ?? 0) === 1 ? '' : 's'}. Renaming will only update the
          catalog entry — historical case records keep their original value. Proceed?
        </p>
      </Modal>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`h-8 px-3 text-2xs font-semibold uppercase tracking-label text-text-muted ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`h-10 px-3 text-text ${className}`}>{children}</td>;
}
