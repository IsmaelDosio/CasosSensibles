import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Case, Status } from '@/types';

export interface CasesQuery {
  q: string;
  channel: string;
  market: string;
  resp: string;
  category: string;
  status: string;
  from: string;
  to: string;
}

const EMPTY: CasesQuery = {
  q: '',
  channel: '',
  market: '',
  resp: '',
  category: '',
  status: '',
  from: '',
  to: '',
};

const KEYS = Object.keys(EMPTY) as (keyof CasesQuery)[];

export function useCasesQuery() {
  const [params, setParams] = useSearchParams();

  const query = useMemo<CasesQuery>(() => {
    const q: CasesQuery = { ...EMPTY };
    KEYS.forEach((k) => {
      const v = params.get(k);
      if (v !== null) q[k] = v;
    });
    return q;
  }, [params]);

  const setQuery = (patch: Partial<CasesQuery>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, String(v));
      else next.delete(k);
    });
    setParams(next, { replace: true });
  };

  const reset = () => {
    const next = new URLSearchParams();
    const id = params.get('id');
    if (id) next.set('id', id);
    setParams(next, { replace: true });
  };

  return { query, setQuery, reset };
}

export function applyCasesQuery(cases: Case[], q: CasesQuery): Case[] {
  const term = q.q.trim().toLowerCase();
  const fromTs = q.from ? Date.parse(q.from) : null;
  const toTs = q.to ? Date.parse(q.to) + 86_400_000 - 1 : null;
  return cases.filter((c) => {
    if (q.channel && c.channel !== q.channel) return false;
    if (q.market && c.market !== q.market) return false;
    if (q.resp && c.resp !== q.resp) return false;
    if (q.category && c.category !== q.category) return false;
    if (q.status && c.status !== (q.status as Status)) return false;
    if (fromTs !== null && Date.parse(c.firstContact) < fromTs) return false;
    if (toTs !== null && Date.parse(c.firstContact) > toTs) return false;
    if (term) {
      const haystack = `${c.caseNumber} ${c.comment} ${c.description} ${c.sku} ${c.bu}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}
