import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Client', path: '/dashboard/client' },
  { icon: Dumbbell, label: 'Staff Trainer', path: '/dashboard/staff-trainer' },
  { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
];

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      className="sidebar"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="sidebar-header">
        <motion.div className="sidebar-logo" variants={itemVariants}>
          <div className="logo-mark">F</div>
          <span className="logo-text">FitBees</span>
        </motion.div>
      </div>

      <nav className="sidebar-nav">
        <motion.div variants={itemVariants}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/dashboard'}
            >
              <item.icon className="nav-icon" size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </motion.div>
      </nav>

      <div className="sidebar-footer">
        <motion.div
          className="user-menu"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="user-avatar">
            {user?.initials || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{user?.role || 'Member'}</div>
          </div>
          <button
            onClick={handleLogout}
            className="icon-button"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </motion.div>
      </div>
    </motion.aside>
  );
}
