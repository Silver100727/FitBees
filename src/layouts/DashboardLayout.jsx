import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const pageConfig = {
  '/dashboard': { title: 'Dashboard', breadcrumbs: [] },
  '/dashboard/client': { title: 'Client', breadcrumbs: ['Client'] },
  '/dashboard/staff-trainer': { title: 'Staff Trainer', breadcrumbs: ['Staff Trainer'] },
  '/dashboard/payments': { title: 'Payments', breadcrumbs: ['Payments'] },
  '/dashboard/reports': { title: 'Reports', breadcrumbs: ['Reports'] },
};

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const config = pageConfig[location.pathname] || { title: 'Dashboard', breadcrumbs: [] };
  const { title, breadcrumbs } = config;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div
          className="h-10 w-10 animate-spin rounded-full"
          style={{ border: '2px solid var(--color-bg-tertiary)', borderTopColor: 'var(--color-accent)' }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <main className="h-screen overflow-hidden" style={{ marginLeft: '220px', background: 'var(--color-bg-primary)' }}>
        <Topbar title={title} breadcrumbs={breadcrumbs} />
        <Outlet />
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
