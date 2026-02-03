import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, value, label, change, changeType, delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="stat-header">
        <div className="stat-icon">
          <Icon size={24} />
        </div>
        {change && (
          <div className={`stat-change ${changeType}`}>
            {changeType === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
      <motion.div
        className="stat-value"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
      >
        {value}
      </motion.div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
