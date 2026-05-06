import { format, parseISO } from 'date-fns';
import type { Gesture, Status } from '@/types';

export function fmtDate(iso: string | null | undefined, pattern = 'yyyy-MM-dd'): string {
  if (!iso) return '—';
  try {
    return format(parseISO(iso), pattern);
  } catch {
    return iso;
  }
}

export function fmtDateTime(iso: string | null | undefined): string {
  return fmtDate(iso, 'yyyy-MM-dd HH:mm');
}

export function fmtMoney(amount: number, currency: string = 'EUR'): string {
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function fmtGesture(g: Gesture): string {
  if (g.kind === 'percentage') return `${g.value}%`;
  const label = g.kind === 'fixed' ? 'Discount' : 'Gift card';
  return `${label} · ${fmtMoney(g.value, g.currency)}`;
}

export function statusLabel(s: Status): string {
  return s;
}
