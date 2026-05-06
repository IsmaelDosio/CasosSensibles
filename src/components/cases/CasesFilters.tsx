import { useShallow } from 'zustand/react/shallow';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCatalogsStore, selectActiveByCatalog } from '@/store/catalogs.store';
import type { CasesQuery } from './useCasesQuery';

interface Props {
  query: CasesQuery;
  setQuery: (patch: Partial<CasesQuery>) => void;
  reset: () => void;
  resultCount: number;
  totalCount: number;
}

export function CasesFilters({ query, setQuery, reset, resultCount, totalCount }: Props) {
  const channels = useCatalogsStore(useShallow(selectActiveByCatalog('CHANNEL')));
  const markets = useCatalogsStore(useShallow(selectActiveByCatalog('MARKET')));
  const resps = useCatalogsStore(useShallow(selectActiveByCatalog('RESP')));
  const categories = useCatalogsStore(useShallow(selectActiveByCatalog('CATEGORY')));

  const opts = (vals: { value: string }[]) => [{ value: '', label: 'All' }, ...vals.map((v) => ({ value: v.value, label: v.value }))];
  const statusOpts = [
    { value: '', label: 'All' },
    { value: 'UR', label: 'UR' },
    { value: 'CLOSED', label: 'CLOSED' },
    { value: 'CUFC', label: 'CUFC' },
  ];

  const isFiltered =
    !!query.q ||
    !!query.channel ||
    !!query.market ||
    !!query.resp ||
    !!query.category ||
    !!query.status ||
    !!query.from ||
    !!query.to;

  return (
    <div className="border-b border-border bg-surface">
      <div className="flex flex-wrap items-end gap-2 px-4 py-2.5">
        <div className="flex w-64 flex-col gap-1">
          <span className="label-caps">Search</span>
          <Input
            placeholder="CASE, COMMENT, DESCRIPTION, SKU…"
            value={query.q}
            onChange={(e) => setQuery({ q: e.target.value })}
          />
        </div>
        <FilterField label="Channel">
          <Select
            options={opts(channels)}
            value={query.channel}
            onChange={(e) => setQuery({ channel: e.target.value })}
          />
        </FilterField>
        <FilterField label="Market">
          <Select
            options={opts(markets)}
            value={query.market}
            onChange={(e) => setQuery({ market: e.target.value })}
          />
        </FilterField>
        <FilterField label="Resp">
          <Select
            options={opts(resps)}
            value={query.resp}
            onChange={(e) => setQuery({ resp: e.target.value })}
          />
        </FilterField>
        <FilterField label="Category">
          <Select
            options={opts(categories)}
            value={query.category}
            onChange={(e) => setQuery({ category: e.target.value })}
          />
        </FilterField>
        <FilterField label="Status">
          <Select
            options={statusOpts}
            value={query.status}
            onChange={(e) => setQuery({ status: e.target.value })}
          />
        </FilterField>
        <FilterField label="First contact from">
          <Input
            type="date"
            value={query.from}
            onChange={(e) => setQuery({ from: e.target.value })}
          />
        </FilterField>
        <FilterField label="To">
          <Input
            type="date"
            value={query.to}
            onChange={(e) => setQuery({ to: e.target.value })}
          />
        </FilterField>
        <div className="ml-auto flex items-center gap-2 self-end">
          <span className="text-xs text-text-muted">
            {resultCount} of {totalCount}
          </span>
          {isFiltered && (
            <Button size="sm" variant="ghost" onClick={reset}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-40 flex-col gap-1">
      <span className="label-caps">{label}</span>
      {children}
    </div>
  );
}
