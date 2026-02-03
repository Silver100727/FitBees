import { motion } from 'framer-motion';
import { Search, Bell, Settings, ChevronRight } from 'lucide-react';

export default function Topbar({ title, breadcrumbs = [] }) {
  return (
    <motion.header
      className="topbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="topbar-left">
        <div>
          <h1 className="page-title">{title}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="breadcrumb">
              <span>Dashboard</span>
              {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  <ChevronRight size={14} className="breadcrumb-separator" />
                  <span className={index === breadcrumbs.length - 1 ? 'breadcrumb-current' : ''}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>

        <div className="topbar-actions">
          <motion.button
            className="icon-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
            <span className="badge" />
          </motion.button>
          <motion.button
            className="icon-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
