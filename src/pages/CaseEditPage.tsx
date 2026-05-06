import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { CaseForm } from '@/components/cases/CaseForm';
import { useCasesStore } from '@/store/cases.store';
import { useAuthStore } from '@/store/auth.store';
import type { CaseFormValues } from '@/schemas/case.schema';
import type { GestureKind, Status } from '@/types';

export function CaseEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const update = useCasesStore((s) => s.update);
  const user = useAuthStore((s) => s.user);
  const existing = useCasesStore(useShallow((s) => s.cases.find((c) => c.id === id)));

  if (!existing) return <Navigate to="/cases" replace />;

  const handleSubmit = (values: CaseFormValues) => {
    update(
      existing.id,
      {
        caseNumber: values.caseNumber,
        channel: values.channel,
        firstContact: values.firstContact,
        market: values.market,
        resp: values.resp,
        bu: values.bu,
        status: values.status as Status,
        comment: values.comment,
        gesture: {
          kind: values.gesture.kind as GestureKind,
          value: Number(values.gesture.value),
          currency: 'EUR',
        },
        whStoreCourier: values.whStoreCourier,
        sku: values.sku,
        category: values.category,
        description: values.description,
      },
      user,
    );
    navigate(`/cases?id=${existing.id}`);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="text-sm font-semibold uppercase tracking-label">
          Edit case · <span className="font-mono normal-case">{existing.caseNumber}</span>
        </div>
        <div className="text-2xs text-text-muted">Updates will be reflected in the history panel.</div>
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-auto bg-bg">
        <CaseForm
          submitLabel="Save changes"
          onCancel={() => navigate(`/cases?id=${existing.id}`)}
          onSubmit={handleSubmit}
          initial={{
            caseNumber: existing.caseNumber,
            channel: existing.channel,
            firstContact: existing.firstContact,
            market: existing.market,
            resp: existing.resp,
            bu: existing.bu,
            status: existing.status,
            comment: existing.comment,
            gesture: existing.gesture,
            whStoreCourier: existing.whStoreCourier,
            sku: existing.sku,
            category: existing.category,
            description: existing.description,
          }}
        />
      </div>
    </div>
  );
}
