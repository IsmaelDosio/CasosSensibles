export type Status = 'UR' | 'CLOSED' | 'CUFC';
export const STATUS_VALUES: readonly Status[] = ['UR', 'CLOSED', 'CUFC'] as const;

export type Role = 'editor' | 'admin';

export type CatalogKey = 'CHANNEL' | 'MARKET' | 'RESP' | 'CATEGORY' | 'STATUS';
export const CATALOG_KEYS: readonly CatalogKey[] = [
  'CHANNEL',
  'MARKET',
  'RESP',
  'CATEGORY',
  'STATUS',
] as const;
export const LOCKED_CATALOGS: readonly CatalogKey[] = ['STATUS'] as const;

export type GestureKind = 'percentage' | 'fixed' | 'giftcard';
export const GESTURE_KINDS: readonly GestureKind[] = ['percentage', 'fixed', 'giftcard'] as const;

export interface Gesture {
  kind: GestureKind;
  value: number;
  currency: 'EUR';
}

export interface Case {
  id: string;
  caseNumber: string;
  channel: string;
  firstContact: string;
  market: string;
  resp: string;
  bu: string;
  status: Status;
  comment: string;
  gesture: Gesture;
  whStoreCourier: string;
  sku: string;
  category: string;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface CatalogValue {
  id: string;
  catalog: CatalogKey;
  value: string;
  active: boolean;
}
