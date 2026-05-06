import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCasesStore, selectDeletedCases } from '@/store/cases.store';
import { useAuthStore } from '@/store/auth.store';
import { CasesTable } from '@/components/cases/CasesTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function DeletedCasesPage() {
  const cases = useCasesStore(useShallow(selectDeletedCases));
  const restore = useCasesStore((s) => s.restore);
  const user = useAuthStore((s) => s.user);
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);

  const handleRestore = (id: string) => setConfirmRestore(id);
  const confirm = () => {
    if (confirmRestore) {
      restore(confirmRestore, user);
      setConfirmRestore(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="text-sm font-semibold uppercase tracking-label">Archived cases</div>
        <div className="text-2xs text-text-muted">
          Soft-deleted cases · {cases.length} archived · restore returns them to the active list
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-surface">
        <CasesTable
          data={cases}
          onSelect={() => undefined}
          onRestore={handleRestore}
          showRestore
          emptyHint="No archived cases."
        />
      </div>

      <Modal
        open={!!confirmRestore}
        onClose={() => setConfirmRestore(null)}
        title="Restore case"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmRestore(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirm}>
              Restore
            </Button>
          </>
        }
      >
        <p className="text-sm">This case will return to the active list.</p>
      </Modal>
    </div>
  );
}
