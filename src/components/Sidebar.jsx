import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  CreditCard,
  Package,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    section: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
      { icon: ShoppingCart, label: 'Orders', path: '/dashboard/orders', badge: '12' },
      { icon: Package, label: 'Products', path: '/dashboard/products' },
    ]
  },
  {
    section: 'Management',
    items: [
      { icon: Users, label: 'Customers', path: '/dashboard/customers' },
      { icon: CreditCard, label: 'Transactions', path: '/dashboard/transactions' },
      { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
    ]
  },
  {
    section: 'System',
    items: [
      { icon: Bell, label: 'Notifications', path: '/dashboard/notifications', badge: '3' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
      { icon: HelpCircle, label: 'Help Center', path: '/dashboard/help' },
    ]
  }
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
        {navItems.map((section, sectionIndex) => (
          <motion.div
            key={section.section}
            className="nav-section"
            variants={itemVariants}
          >
            <span className="nav-section-title">{section.section}</span>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/dashboard'}
              >
                <item.icon className="nav-icon" size={20} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </motion.div>
        ))}
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
            style={{
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
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
