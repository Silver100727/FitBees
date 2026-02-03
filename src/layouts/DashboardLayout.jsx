import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Skeleton } from '@/components/ui';

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-bg-tertiary border-t-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="ml-70 min-h-screen overflow-x-hidden bg-background">
        <Outlet />
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
