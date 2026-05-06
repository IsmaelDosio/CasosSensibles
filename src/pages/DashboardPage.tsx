import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { format, parseISO, startOfWeek } from 'date-fns';
import { useCasesStore } from '@/store/cases.store';
import { applyCasesQuery, useCasesQuery } from '@/components/cases/useCasesQuery';
import { CasesFilters } from '@/components/cases/CasesFilters';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ChartCard, HBar, PeriodLine, VBar } from '@/components/dashboard/Charts';
import { fmtMoney } from '@/lib/format';
import type { Case } from '@/types';

export function DashboardPage() {
  const allCases = useCasesStore(useShallow((s) => s.cases));
  const active = useMemo(() => allCases.filter((c) => !c.deletedAt), [allCases]);
  const archivedCount = allCases.length - active.length;

  const { query, setQuery, reset } = useCasesQuery();
  const filtered = useMemo(() => applyCasesQuery(active, query), [active, query]);

  const totals = useMemo(() => {
    const byStatus = countBy(filtered, (c) => c.status);
    const byChannel = countBy(filtered, (c) => c.channel);
    const byMarket = countBy(filtered, (c) => c.market);
    const byOwner = countBy(filtered, (c) => c.resp);
    const byCategory = countBy(filtered, (c) => c.category);
    const byPeriod = bucketByWeek(filtered);
    return { byStatus, byChannel, byMarket, byOwner, byCategory, byPeriod };
  }, [filtered]);

  const gesture = useMemo(() => {
    const withGesture = filtered;
    const byKind = countBy(withGesture, (c) => c.gesture.kind);
    const pcts = withGesture.filter((c) => c.gesture.kind === 'percentage').map((c) => c.gesture.value);
    const avgPct = pcts.length ? pcts.reduce((a, b) => a + b, 0) / pcts.length : 0;
    const monetary = withGesture.filter((c) => c.gesture.kind === 'fixed' || c.gesture.kind === 'giftcard');
    const currencies = new Set(monetary.map((c) => c.gesture.currency));
    const uniformCurrency = currencies.size <= 1 ? [...currencies][0] ?? 'EUR' : null;
    const totalAmount = monetary.reduce((sum, c) => sum + c.gesture.value, 0);
    return {
      withGestureCount: withGesture.length,
      byKind,
      avgPct,
      pctCount: pcts.length,
      totalAmount,
      uniformCurrency,
      monetaryCount: monetary.length,
    };
  }, [filtered]);

  const total = filtered.length;
  const ur = totals.byStatus.find((d) => d.name === 'UR')?.value ?? 0;
  const closed = totals.byStatus.find((d) => d.name === 'CLOSED')?.value ?? 0;
  const cufc = totals.byStatus.find((d) => d.name === 'CUFC')?.value ?? 0;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border bg-surface px-4 py-2">
        <div className="text-sm font-semibold uppercase tracking-label">Dashboard</div>
        <div className="text-2xs text-text-muted">
          Active cases only — archived cases are excluded from charts and shown as a separate KPI.
        </div>
      </div>

      <CasesFilters
        query={query}
        setQuery={setQuery}
        reset={reset}
        resultCount={filtered.length}
        totalCount={active.length}
      />

      <div className="scroll-thin min-h-0 flex-1 overflow-auto bg-bg p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <KpiCard label="Total active" value={total} />
          <KpiCard label="Open · UR" value={ur} tone="ur" />
          <KpiCard label="Closed" value={closed} tone="closed" />
          <KpiCard label="CUFC" value={cufc} tone="cufc" />
          <KpiCard label="Archived" value={archivedCount} tone="muted" hint="not in charts" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <ChartCard title="By status">
            <HBar data={totals.byStatus} />
          </ChartCard>
          <ChartCard title="By channel">
            <VBar data={totals.byChannel} />
          </ChartCard>
          <ChartCard title="By market">
            <VBar data={totals.byMarket} />
          </ChartCard>
          <ChartCard title="By responsible owner">
            <HBar data={totals.byOwner.slice(0, 8)} />
          </ChartCard>
          <ChartCard title="By category">
            <HBar data={totals.byCategory} />
          </ChartCard>
          <ChartCard title="By period (per week)">
            <PeriodLine data={totals.byPeriod} />
          </ChartCard>
        </div>

        <div className="mt-4">
          <div className="label-caps mb-2">Gesture</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <KpiCard
              label="Cases with gesture"
              value={gesture.withGestureCount}
              hint={`${total ? Math.round((gesture.withGestureCount / total) * 100) : 0}% of active`}
            />
            <div className="md:col-span-1 row-span-1">
              <ChartCard title="By gesture type">
                <VBar data={gesture.byKind} />
              </ChartCard>
            </div>
            <KpiCard
              label="Avg. % discount"
              value={gesture.pctCount ? `${gesture.avgPct.toFixed(1)}%` : '—'}
              hint={gesture.pctCount ? `${gesture.pctCount} cases` : 'no percentage gestures'}
            />
            <KpiCard
              label="Total amount (fixed + giftcard)"
              value={
                gesture.monetaryCount === 0
                  ? '—'
                  : gesture.uniformCurrency
                    ? fmtMoney(gesture.totalAmount, gesture.uniformCurrency)
                    : 'Mixed currencies'
              }
              hint={gesture.monetaryCount ? `${gesture.monetaryCount} cases` : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function countBy<T>(items: T[], keyFn: (item: T) => string): { name: string; value: number }[] {
  const map = new Map<string, number>();
  items.forEach((it) => {
    const k = keyFn(it);
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function bucketByWeek(items: Case[]) {
  const map = new Map<string, number>();
  items.forEach((c) => {
    try {
      const d = parseISO(c.firstContact);
      const wk = startOfWeek(d, { weekStartsOn: 1 });
      const key = format(wk, 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + 1);
    } catch {
      /* skip */
    }
  });
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([key, value]) => ({ name: key.slice(5), value }));
}
