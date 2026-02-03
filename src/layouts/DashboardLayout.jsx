import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)'
      }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
