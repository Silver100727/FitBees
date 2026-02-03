import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';
import './styles/components.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="orders" element={<Placeholder title="Orders" />} />
            <Route path="products" element={<Placeholder title="Products" />} />
            <Route path="customers" element={<Placeholder title="Customers" />} />
            <Route path="transactions" element={<Placeholder title="Transactions" />} />
            <Route path="reports" element={<Placeholder title="Reports" />} />
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Placeholder title="Help Center" />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
