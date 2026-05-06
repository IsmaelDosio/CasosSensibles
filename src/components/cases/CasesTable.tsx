import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import type { Case } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { fmtDate, fmtGesture } from '@/lib/format';
import { cn } from '@/lib/cn';

interface Props {
  data: Case[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  showRestore?: boolean;
  canDelete?: boolean;
  emptyHint?: string;
}

export function CasesTable({
  data,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
  showRestore,
  canDelete,
  emptyHint,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'firstContact', desc: true }]);

  const columns = useMemo<ColumnDef<Case>[]>(
    () => [
      {
        accessorKey: 'caseNumber',
        header: 'CASE',
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-text">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'firstContact',
        header: 'FIRST CONTACT',
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{fmtDate(String(getValue()))}</span>
        ),
      },
      { accessorKey: 'channel', header: 'CHANNEL' },
      { accessorKey: 'market', header: 'MARKET' },
      { accessorKey: 'resp', header: 'RESP' },
      { accessorKey: 'bu', header: 'BU' },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: 'category', header: 'CATEGORY' },
      {
        id: 'gesture',
        header: 'GESTURE',
        cell: ({ row }) => <span className="text-xs">{fmtGesture(row.original.gesture)}</span>,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100">
            {showRestore && onRestore ? (
              <RowAction
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(row.original.id);
                }}
              >
                Restore
              </RowAction>
            ) : (
              <>
                {onEdit && (
                  <RowAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row.original.id);
                    }}
                  >
                    Edit
                  </RowAction>
                )}
                {onDelete && canDelete && (
                  <RowAction
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row.original.id);
                    }}
                  >
                    Delete
                  </RowAction>
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    [onEdit, onDelete, onRestore, showRestore, canDelete],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-text-subtle">
        {emptyHint ?? 'No cases match the current filters.'}
      </div>
    );
  }

  return (
    <div className="scroll-thin overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead className="sticky top-0 z-10 bg-surface-2">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const sortable = h.column.getCanSort();
                const dir = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    onClick={sortable ? h.column.getToggleSortingHandler() : undefined}
                    className={cn(
                      'h-8 border-b border-border px-3 text-2xs font-semibold uppercase tracking-label text-text-muted',
                      sortable && 'cursor-pointer hover:text-text',
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {dir === 'asc' && <span>▲</span>}
                      {dir === 'desc' && <span>▼</span>}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isSelected = row.original.id === selectedId;
            return (
              <tr
                key={row.id}
                onClick={() => onSelect(row.original.id)}
                className={cn(
                  'group cursor-pointer',
                  isSelected ? 'bg-surface-2' : 'hover:bg-surface-2',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="h-9 border-b border-border px-3 text-text"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RowAction({
  children,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  danger?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-6 rounded-sm border border-border-strong bg-surface px-2 text-2xs font-medium uppercase tracking-label transition-colors',
        danger
          ? 'text-status-ur hover:bg-status-ur hover:text-bg hover:border-status-ur'
          : 'text-text-muted hover:text-text hover:bg-surface-2',
      )}
    >
      {children}
    </button>
  );
}
