import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Skeleton } from '@/components/ui';

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

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
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <main className="min-h-screen overflow-x-hidden" style={{ marginLeft: '220px', background: 'var(--color-bg-primary)' }}>
        <Outlet />
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
