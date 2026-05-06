import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const TICK = { fill: '#5b5b5b', fontSize: 11 };
const GRID = '#e5e5e3';
const BAR = '#1f1f1f';
const LINE = '#1f1f1f';

interface Datum {
  name: string;
  value: number;
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface">
      <div className="flex h-9 items-center border-b border-border bg-surface-2 px-3">
        <span className="label-caps">{title}</span>
      </div>
      <div className="px-2 pb-3 pt-2" style={{ height: 240 }}>
        {children}
      </div>
    </div>
  );
}

export function VBar({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval={0} />
        <YAxis tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} allowDecimals={false} width={28} />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          contentStyle={{ background: '#fff', border: '1px solid #cfcfcd', borderRadius: 2, fontSize: 12 }}
        />
        <Bar dataKey="value" fill={BAR} radius={[2, 2, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HBar({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} allowDecimals={false} />
        <YAxis dataKey="name" type="category" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} width={90} />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          contentStyle={{ background: '#fff', border: '1px solid #cfcfcd', borderRadius: 2, fontSize: 12 }}
        />
        <Bar dataKey="value" fill={BAR} radius={[0, 2, 2, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PeriodLine({ data }: { data: Datum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={12} />
        <YAxis tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} allowDecimals={false} width={28} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #cfcfcd', borderRadius: 2, fontSize: 12 }} />
        <Line type="monotone" dataKey="value" stroke={LINE} strokeWidth={1.5} dot={{ r: 2, fill: LINE }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
