import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Client from './pages/Client';
import ClientProfile from './pages/ClientProfile';
import Staff from './pages/Staff';
import Payments from './pages/Payments';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="client" element={<Client />} />
            <Route path="client/:id" element={<ClientProfile />} />
            <Route path="staff-trainer" element={<Staff />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Placeholder title="Reports" />} />
            <Route path="my-websites" element={<Placeholder title="My Websites" />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
