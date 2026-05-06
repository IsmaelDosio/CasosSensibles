import { addDays, formatISO, subMonths } from 'date-fns';
import type { Case, CatalogKey, CatalogValue, Gesture, GestureKind, Status } from '@/types';
import { uid } from './id';
import { STORAGE_KEYS } from './storage';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(0xc0ffee);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const pickWeighted = <T>(items: readonly { v: T; w: number }[]): T => {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = rng() * total;
  for (const it of items) {
    r -= it.w;
    if (r <= 0) return it.v;
  }
  return items[items.length - 1].v;
};
const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

const CHANNELS = ['CALL', 'CHAT', 'EMAIL', 'H.REC', 'SM', 'WHATS'] as const;
const MARKETS = ['ES', 'PT', 'DE', 'NL', 'US'] as const;
const STATUSES: readonly Status[] = ['UR', 'CLOSED', 'CUFC'];
const RESP_VALUES = ['M. García', 'L. Pereira', 'A. Schulz', 'J. Vermeer', 'R. Mora', 'P. Costa', 'S. Adams'];
const CATEGORIES = [
  'Logistics',
  'Quality',
  'Returns',
  'Payment',
  'Damaged',
  'Lost parcel',
  'Wrong item',
  'Customer experience',
];
const BUS = ['WOMAN', 'MAN', 'KIDS', 'HOME', 'BEAUTY'];
const WH_STORE_COURIER = ['WH-MAD-01', 'WH-LIS-02', 'STORE-0142', 'STORE-0871', 'COURIER-DHL', 'COURIER-UPS', 'COURIER-SEUR'];
const USERS = ['M. García', 'L. Pereira', 'A. Schulz', 'J. Vermeer', 'R. Mora', 'admin@scm'];

const CHANNEL_WEIGHTS = [
  { v: 'CALL' as const, w: 22 },
  { v: 'CHAT' as const, w: 24 },
  { v: 'EMAIL' as const, w: 18 },
  { v: 'H.REC' as const, w: 6 },
  { v: 'SM' as const, w: 12 },
  { v: 'WHATS' as const, w: 18 },
];
const MARKET_WEIGHTS = [
  { v: 'ES' as const, w: 36 },
  { v: 'PT' as const, w: 22 },
  { v: 'DE' as const, w: 16 },
  { v: 'NL' as const, w: 14 },
  { v: 'US' as const, w: 12 },
];
const STATUS_WEIGHTS = [
  { v: 'UR' as Status, w: 30 },
  { v: 'CLOSED' as Status, w: 50 },
  { v: 'CUFC' as Status, w: 20 },
];

function randomGesture(): Gesture {
  const kind = pickWeighted<GestureKind>([
    { v: 'percentage', w: 50 },
    { v: 'fixed', w: 30 },
    { v: 'giftcard', w: 20 },
  ]);
  if (kind === 'percentage') {
    return { kind, value: pick([5, 10, 15, 20, 25, 30]), currency: 'EUR' };
  }
  if (kind === 'fixed') {
    return { kind, value: pick([10, 15, 20, 25, 30, 40, 50, 75]), currency: 'EUR' };
  }
  return { kind, value: pick([20, 30, 50, 75, 100]), currency: 'EUR' };
}

function makeCaseNumber(i: number) {
  const year = 2026;
  return `SC-${year}-${String(i).padStart(5, '0')}`;
}

const COMMENT_FRAGMENTS = [
  'Pending courier response',
  'Awaiting WH confirmation',
  'Customer agreed to gesture',
  'Escalated to BU lead',
  'Refund processed',
  'Replacement dispatched',
  'Pending QC review',
  'Customer unreachable',
  'Compensation approved',
  'Manual reroute',
];

const DESCRIPTION_FRAGMENTS = [
  'Customer reports their parcel was delivered to the wrong address. Tracking shows delivery completed, but customer denies receipt. Courier opened internal investigation.',
  'Item arrived with visible packaging damage. Product itself appears intact, but customer requests partial compensation due to gift purpose.',
  'Order shows two units billed but only one was received. Warehouse audit pending; logistics partner reviewing dispatch manifest.',
  'Quality complaint regarding fabric defect noticed after first wash. Photos provided. Sent to QC for batch validation.',
  'Customer received a different SKU. Likely WH picking error. Replacement dispatched, return label issued for the wrong item.',
  'Refund requested due to delayed delivery beyond promised window. Carrier confirmed exception at hub.',
  'Customer not satisfied with previous gesture; case reopened for review by responsible owner.',
];

function generateCases(count: number): Case[] {
  const today = new Date();
  const start = subMonths(today, 6);
  const cases: Case[] = [];
  for (let i = 1; i <= count; i++) {
    const channel = pickWeighted(CHANNEL_WEIGHTS);
    const market = pickWeighted(MARKET_WEIGHTS);
    const status = pickWeighted(STATUS_WEIGHTS);
    const resp = pick(RESP_VALUES);
    const category = pick(CATEGORIES);
    const bu = pick(BUS);
    const whStoreCourier = pick(WH_STORE_COURIER);
    const firstContactDate = addDays(start, randInt(0, 180));
    const createdAt = formatISO(addDays(firstContactDate, randInt(0, 2)));
    const updatedAt = formatISO(addDays(firstContactDate, randInt(2, 14)));
    const createdBy = pick(USERS);
    const updatedBy = rng() > 0.5 ? pick(USERS) : createdBy;
    const deleted = rng() < 0.06;
    const c: Case = {
      id: uid('c'),
      caseNumber: makeCaseNumber(i),
      channel,
      firstContact: formatISO(firstContactDate, { representation: 'date' }),
      market,
      resp,
      bu,
      status,
      comment: pick(COMMENT_FRAGMENTS),
      gesture: randomGesture(),
      whStoreCourier,
      sku: `${randInt(1000, 9999)}/${randInt(100, 999)}/${randInt(100, 999)}`,
      category,
      description: pick(DESCRIPTION_FRAGMENTS),
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt: deleted ? formatISO(addDays(firstContactDate, randInt(15, 30))) : null,
      deletedBy: deleted ? 'admin@scm' : null,
    };
    cases.push(c);
  }
  cases.sort((a, b) => (a.firstContact < b.firstContact ? 1 : -1));
  return cases;
}

function generateCatalogs(): CatalogValue[] {
  const out: CatalogValue[] = [];
  const add = (catalog: CatalogKey, values: readonly string[]) => {
    values.forEach((value) => {
      out.push({ id: uid('cv'), catalog, value, active: true });
    });
  };
  add('CHANNEL', CHANNELS);
  add('MARKET', MARKETS);
  add('RESP', RESP_VALUES);
  add('CATEGORY', CATEGORIES);
  add('STATUS', STATUSES);
  return out;
}

export function ensureSeed() {
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;
  const cases = generateCases(150);
  const catalogs = generateCatalogs();
  localStorage.setItem(
    STORAGE_KEYS.cases,
    JSON.stringify({ state: { cases }, version: 1 }),
  );
  localStorage.setItem(
    STORAGE_KEYS.catalogs,
    JSON.stringify({ state: { values: catalogs }, version: 1 }),
  );
  localStorage.setItem(STORAGE_KEYS.seeded, '1');
}

export function reseed() {
  localStorage.removeItem(STORAGE_KEYS.seeded);
  localStorage.removeItem(STORAGE_KEYS.cases);
  localStorage.removeItem(STORAGE_KEYS.catalogs);
  ensureSeed();
}

export const SEED_USERS = USERS;
