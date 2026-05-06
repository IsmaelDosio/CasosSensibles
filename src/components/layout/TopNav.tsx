import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore, useCurrentUser, useRole } from '@/store/auth.store';
import { reseed } from '@/lib/seed';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/cases', label: 'Cases' },
  { to: '/dashboard', label: 'Dashboard' },
];
const adminItems = [
  { to: '/archived', label: 'Archived' },
  { to: '/admin/catalogs', label: 'Catalogs' },
];

export function TopNav() {
  const role = useRole();
  const user = useCurrentUser();
  const setRole = useAuthStore((s) => s.setRole);
  const [menuOpen, setMenuOpen] = useState(false);

  const items = role === 'admin' ? [...navItems, ...adminItems] : navItems;

  const handleReset = () => {
    if (confirm('Reset demo data? This restores the seeded 150 cases and original catalogs.')) {
      reseed();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="flex h-12 items-center gap-6 px-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-text" />
          <span className="text-sm font-semibold uppercase tracking-label">
            Sensitive Cases
          </span>
          <span className="ml-1 hidden text-2xs uppercase tracking-label text-text-subtle md:inline">
            / Phase 0
          </span>
        </div>

        <nav className="flex items-center gap-0.5">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  'h-12 px-3 text-sm flex items-center border-b-2 -mb-px transition-colors',
                  isActive
                    ? 'border-text text-text font-medium'
                    : 'border-transparent text-text-muted hover:text-text',
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-sm border border-border-strong bg-surface p-0.5">
            <RoleChip active={role === 'editor'} onClick={() => setRole('editor')}>
              Editor
            </RoleChip>
            <RoleChip active={role === 'admin'} onClick={() => setRole('admin')}>
              Admin
            </RoleChip>
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 text-xs text-text-muted hover:text-text"
              onClick={() => setMenuOpen((o) => !o)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            >
              <span className="hidden md:inline">{user}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-border-strong bg-surface-2 text-2xs font-semibold uppercase">
                {user.slice(0, 2)}
              </span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-9 w-48 border border-border-strong bg-surface py-1"
                style={{ boxShadow: 'var(--shadow-popover)' }}
              >
                <button
                  className="block w-full px-3 py-2 text-left text-xs text-text hover:bg-surface-2"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleReset}
                >
                  Reset demo data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function RoleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-6 rounded-sm px-2 text-2xs font-semibold uppercase tracking-label transition-colors',
        active ? 'bg-text text-bg' : 'text-text-muted hover:text-text',
      )}
    >
      {children}
    </button>
  );
}
