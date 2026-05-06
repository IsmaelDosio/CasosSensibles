import { useNavigate } from 'react-router-dom';
import { CaseForm } from '@/components/cases/CaseForm';
import { useCasesStore } from '@/store/cases.store';
import { useAuthStore } from '@/store/auth.store';
import type { CaseFormValues } from '@/schemas/case.schema';
import type { GestureKind, Status } from '@/types';

export function CaseCreatePage() {
  const navigate = useNavigate();
  const add = useCasesStore((s) => s.add);
  const user = useAuthStore((s) => s.user);

  const handleSubmit = (values: CaseFormValues) => {
    const created = add(
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
    navigate(`/cases?id=${created.id}`);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="text-sm font-semibold uppercase tracking-label">New case</div>
        <div className="text-2xs text-text-muted">Phase 0 prototype · all fields required</div>
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-auto bg-bg">
        <CaseForm
          submitLabel="Create case"
          onCancel={() => navigate(-1)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
