import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/react/shallow';
import { caseFormSchema, type CaseFormValues } from '@/schemas/case.schema';
import { useCatalogsStore, selectActiveByCatalog } from '@/store/catalogs.store';
import { FieldGroup } from '@/components/ui/FieldGroup';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { GestureField } from './GestureField';
import type { Status } from '@/types';

interface Props {
  initial?: Partial<CaseFormValues>;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (v: CaseFormValues) => void;
}

const STATUS_OPTIONS = [
  { value: 'UR', label: 'UR' },
  { value: 'CLOSED', label: 'CLOSED' },
  { value: 'CUFC', label: 'CUFC' },
];

const DEFAULTS: CaseFormValues = {
  caseNumber: '',
  channel: '',
  firstContact: '',
  market: '',
  resp: '',
  bu: '',
  status: 'UR' as Status,
  comment: '',
  gesture: { kind: 'percentage', value: 10, currency: 'EUR' },
  whStoreCourier: '',
  sku: '',
  category: '',
  description: '',
};

export function CaseForm({ initial, submitLabel, onCancel, onSubmit }: Props) {
  const channels = useCatalogsStore(useShallow(selectActiveByCatalog('CHANNEL')));
  const markets = useCatalogsStore(useShallow(selectActiveByCatalog('MARKET')));
  const resps = useCatalogsStore(useShallow(selectActiveByCatalog('RESP')));
  const categories = useCatalogsStore(useShallow(selectActiveByCatalog('CATEGORY')));

  const methods = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: { ...DEFAULTS, ...initial },
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const opts = (vals: { value: string }[], placeholder: string) => ({
    placeholder,
    options: vals.map((v) => ({ value: v.value, label: v.value })),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl px-6 py-6">
        <Section title="Identification">
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="CASE" required error={errors.caseNumber?.message}>
              <Input placeholder="SC-2026-00001" invalid={!!errors.caseNumber} {...register('caseNumber')} />
            </FieldGroup>
            <FieldGroup label="FIRST CONTACT (FIRST)" required error={errors.firstContact?.message}>
              <Input type="date" invalid={!!errors.firstContact} {...register('firstContact')} />
            </FieldGroup>
            <FieldGroup label="STATUS" required error={errors.status?.message as string | undefined}>
              <Select
                options={STATUS_OPTIONS}
                invalid={!!errors.status}
                {...register('status')}
              />
            </FieldGroup>
            <FieldGroup label="CATEGORY" required error={errors.category?.message}>
              <Select
                {...opts(categories, 'Select category…')}
                invalid={!!errors.category}
                {...register('category')}
              />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="CHANNEL" required error={errors.channel?.message}>
              <Select
                {...opts(channels, 'Select channel…')}
                invalid={!!errors.channel}
                {...register('channel')}
              />
            </FieldGroup>
            <FieldGroup label="MARKET" required error={errors.market?.message}>
              <Select
                {...opts(markets, 'Select market…')}
                invalid={!!errors.market}
                {...register('market')}
              />
            </FieldGroup>
            <FieldGroup label="RESP" required error={errors.resp?.message}>
              <Select
                {...opts(resps, 'Select responsible owner…')}
                invalid={!!errors.resp}
                {...register('resp')}
              />
            </FieldGroup>
            <FieldGroup label="BU" required error={errors.bu?.message}>
              <Input placeholder="WOMAN, MAN, KIDS…" invalid={!!errors.bu} {...register('bu')} />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Operations">
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="WH / STORE / COURIER" required error={errors.whStoreCourier?.message}>
              <Input placeholder="WH-MAD-01" invalid={!!errors.whStoreCourier} {...register('whStoreCourier')} />
            </FieldGroup>
            <FieldGroup label="SKU" required error={errors.sku?.message}>
              <Input placeholder="1234/567/890" invalid={!!errors.sku} {...register('sku')} />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Gesture">
          <GestureField />
        </Section>

        <Section title="Comment">
          <FieldGroup label="COMMENT" hint="Short operational note (max 280 chars)" required error={errors.comment?.message}>
            <Input
              placeholder="Pending courier response"
              maxLength={280}
              invalid={!!errors.comment}
              {...register('comment')}
            />
          </FieldGroup>
        </Section>

        <Section title="Description">
          <FieldGroup label="DESCRIPTION" required error={errors.description?.message}>
            <Textarea rows={6} invalid={!!errors.description} {...register('description')} />
          </FieldGroup>
        </Section>

        <div className="sticky bottom-0 -mx-6 mt-6 flex items-center justify-end gap-2 border-t border-border bg-surface px-6 py-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 border-b border-border pb-6 last:border-0 last:pb-0">
      <div className="label-caps mb-3">{title}</div>
      {children}
    </section>
  );
}
