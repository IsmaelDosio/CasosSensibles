import { z } from 'zod';
import { GESTURE_KINDS, STATUS_VALUES } from '@/types';

export const gestureSchema = z
  .object({
    kind: z.enum(GESTURE_KINDS as unknown as [string, ...string[]]),
    value: z.coerce.number({ invalid_type_error: 'Numeric value required' }).min(0, 'Must be ≥ 0'),
    currency: z.literal('EUR'),
  })
  .superRefine((g, ctx) => {
    if (g.kind === 'percentage' && g.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Percentage must be 0–100',
        path: ['value'],
      });
    }
  });

export const caseFormSchema = z.object({
  caseNumber: z
    .string()
    .min(1, 'Required')
    .regex(/^[A-Z0-9-]+$/i, 'Letters, numbers and dashes only'),
  channel: z.string().min(1, 'Required'),
  firstContact: z
    .string()
    .min(1, 'Required')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date')
    .refine((v) => Date.parse(v) <= Date.now(), 'Cannot be in the future'),
  market: z.string().min(1, 'Required'),
  resp: z.string().min(1, 'Required'),
  bu: z.string().min(1, 'Required').max(60),
  status: z.enum(STATUS_VALUES as unknown as [string, ...string[]]),
  comment: z.string().min(1, 'Required').max(280, 'Max 280 characters'),
  gesture: gestureSchema,
  whStoreCourier: z.string().min(1, 'Required').max(80),
  sku: z
    .string()
    .min(1, 'Required')
    .regex(/^[A-Z0-9./-]+$/i, 'Letters, numbers and . / - only')
    .max(40),
  category: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required').max(4000, 'Max 4000 characters'),
});

export type CaseFormValues = z.infer<typeof caseFormSchema>;
