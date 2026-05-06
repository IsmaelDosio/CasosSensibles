import { Controller, useFormContext } from 'react-hook-form';
import { FieldGroup } from '@/components/ui/FieldGroup';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { CaseFormValues } from '@/schemas/case.schema';

const GESTURE_OPTIONS = [
  { value: 'percentage', label: 'Percentage discount (%)' },
  { value: 'fixed', label: 'Fixed discount (EUR)' },
  { value: 'giftcard', label: 'Gift card (EUR)' },
];

export function GestureField() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CaseFormValues>();

  const kind = watch('gesture.kind');
  const isPct = kind === 'percentage';

  return (
    <div className="grid grid-cols-2 gap-3">
      <FieldGroup
        label="Gesture type"
        required
        error={errors.gesture?.kind?.message as string | undefined}
      >
        <Controller
          control={control}
          name="gesture.kind"
          render={({ field }) => (
            <Select
              options={GESTURE_OPTIONS}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
                setValue('gesture.currency', 'EUR');
              }}
              invalid={!!errors.gesture?.kind}
            />
          )}
        />
      </FieldGroup>

      <FieldGroup
        label={isPct ? 'Percentage (0–100)' : 'Amount (EUR)'}
        required
        hint={isPct ? undefined : 'Currency: EUR'}
        error={errors.gesture?.value?.message as string | undefined}
      >
        <Controller
          control={control}
          name="gesture.value"
          render={({ field }) => (
            <Input
              type="number"
              step={isPct ? 1 : '0.01'}
              min={0}
              max={isPct ? 100 : undefined}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              invalid={!!errors.gesture?.value}
            />
          )}
        />
      </FieldGroup>
    </div>
  );
}
