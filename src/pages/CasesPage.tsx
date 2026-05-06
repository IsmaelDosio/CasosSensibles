import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useCasesStore, selectActiveCases } from '@/store/cases.store';
import { useAuthStore, useRole } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CasesFilters } from '@/components/cases/CasesFilters';
import { CasesTable } from '@/components/cases/CasesTable';
import { CaseListSidebar } from '@/components/cases/CaseListSidebar';
import { CaseDetailPanel } from '@/components/cases/CaseDetailPanel';
import { CaseHistoryPanel } from '@/components/cases/CaseHistoryPanel';
import { applyCasesQuery, useCasesQuery } from '@/components/cases/useCasesQuery';

export function CasesPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const role = useRole();
  const user = useAuthStore((s) => s.user);
  const cases = useCasesStore(useShallow(selectActiveCases));
  const softDelete = useCasesStore((s) => s.softDelete);

  const { query, setQuery, reset } = useCasesQuery();
  const filtered = useMemo(() => applyCasesQuery(cases, query), [cases, query]);

  const selectedId = params.get('id');
  const selected = useMemo(
    () => cases.find((c) => c.id === selectedId) ?? null,
    [cases, selectedId],
  );

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId && !selected) {
      const next = new URLSearchParams(params);
      next.delete('id');
      setParams(next, { replace: true });
    }
  }, [selectedId, selected, params, setParams]);

  const handleSelect = (id: string) => {
    const next = new URLSearchParams(params);
    next.set('id', id);
    setParams(next, { replace: true });
  };

  const handleClearSelection = () => {
    const next = new URLSearchParams(params);
    next.delete('id');
    setParams(next, { replace: true });
  };

  const handleDelete = (id: string) => setConfirmDelete(id);
  const confirmDeleteCase = () => {
    if (confirmDelete) {
      softDelete(confirmDelete, user);
      if (selectedId === confirmDelete) handleClearSelection();
      setConfirmDelete(null);
    }
  };

  if (selected) {
    return (
      <div className="flex h-[calc(100vh-3rem)] flex-col">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <button
            onClick={handleClearSelection}
            className="text-xs text-text-muted hover:text-text"
          >
            ← Back to list ({filtered.length})
          </button>
          <Button size="sm" onClick={() => navigate('/cases/new')}>
            New case
          </Button>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)_300px]">
          <CaseListSidebar
            cases={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
          <CaseDetailPanel
            case={selected}
            canDelete={role === 'admin'}
            onEdit={() => navigate(`/cases/${selected.id}/edit`)}
            onDelete={() => handleDelete(selected.id)}
          />
          <CaseHistoryPanel case={selected} />
        </div>

        <Modal
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Archive case"
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteCase}>
                Archive case
              </Button>
            </>
          }
        >
          <p className="text-sm">
            This will soft-delete the case. Admins can restore it from{' '}
            <span className="font-mono">Archived</span>. Continue?
          </p>
        </Modal>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <div>
          <div className="text-sm font-semibold uppercase tracking-label">Cases</div>
          <div className="text-2xs text-text-muted">
            Operational record · {cases.length} active
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="text-xs text-text-muted hover:text-text">
            Dashboard
          </Link>
          <Button size="sm" onClick={() => navigate('/cases/new')}>
            New case
          </Button>
        </div>
      </div>

      <CasesFilters
        query={query}
        setQuery={setQuery}
        reset={reset}
        resultCount={filtered.length}
        totalCount={cases.length}
      />

      <div className="min-h-0 flex-1 bg-surface">
        <CasesTable
          data={filtered}
          selectedId={selectedId}
          onSelect={handleSelect}
          onEdit={(id) => navigate(`/cases/${id}/edit`)}
          onDelete={handleDelete}
          canDelete={role === 'admin'}
        />
      </div>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Archive case"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteCase}>
              Archive case
            </Button>
          </>
        }
      >
        <p className="text-sm">
          This will soft-delete the case. Admins can restore it from{' '}
          <span className="font-mono">Archived</span>. Continue?
        </p>
      </Modal>
    </div>
  );
}
