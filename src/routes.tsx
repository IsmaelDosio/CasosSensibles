import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAdmin } from '@/components/layout/RequireAdmin';
import { CasesPage } from '@/pages/CasesPage';
import { CaseCreatePage } from '@/pages/CaseCreatePage';
import { CaseEditPage } from '@/pages/CaseEditPage';
import { DeletedCasesPage } from '@/pages/DeletedCasesPage';
import { AdminCatalogsPage } from '@/pages/AdminCatalogsPage';
import { DashboardPage } from '@/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/cases" replace /> },
      { path: 'cases', element: <CasesPage /> },
      { path: 'cases/new', element: <CaseCreatePage /> },
      { path: 'cases/:id/edit', element: <CaseEditPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'archived',
        element: (
          <RequireAdmin>
            <DeletedCasesPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'admin/catalogs',
        element: (
          <RequireAdmin>
            <AdminCatalogsPage />
          </RequireAdmin>
        ),
      },
      { path: '*', element: <Navigate to="/cases" replace /> },
    ],
  },
]);
