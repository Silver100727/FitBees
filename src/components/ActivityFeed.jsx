import { motion } from 'framer-motion';
import { DollarSign, UserPlus, AlertCircle, Package } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'sale',
    icon: DollarSign,
    text: '<strong>New order</strong> received from Victoria Chen for $2,450',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'user',
    icon: UserPlus,
    text: '<strong>New customer</strong> registered: Marcus Thompson',
    time: '15 minutes ago'
  },
  {
    id: 3,
    type: 'alert',
    icon: AlertCircle,
    text: '<strong>Low stock alert</strong> for Premium Collection items',
    time: '1 hour ago'
  },
  {
    id: 4,
    type: 'sale',
    icon: DollarSign,
    text: '<strong>Payment received</strong> of $8,900 from Sterling Corp',
    time: '2 hours ago'
  },
  {
    id: 5,
    type: 'user',
    icon: Package,
    text: '<strong>Order shipped</strong> to Alexandra Mills - Express delivery',
    time: '3 hours ago'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function ActivityFeed() {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">Recent Activity</h3>
        <button className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>
          View All
        </button>
      </div>
      <motion.div
        className="activity-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            className="activity-item"
            variants={itemVariants}
          >
            <div className={`activity-icon ${activity.type}`}>
              <activity.icon size={16} />
            </div>
            <div className="activity-content">
              <p
                className="activity-text"
                dangerouslySetInnerHTML={{ __html: activity.text }}
              />
              <span className="activity-time">{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
