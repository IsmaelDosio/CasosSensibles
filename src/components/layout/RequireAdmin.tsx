import { Navigate } from 'react-router-dom';
import { useRole } from '@/store/auth.store';
import type { ReactNode } from 'react';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const role = useRole();
  if (role !== 'admin') {
    return <Navigate to="/cases" replace />;
  }
  return <>{children}</>;
}
