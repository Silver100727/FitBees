import { motion } from 'framer-motion';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

const customers = [
  {
    id: 1,
    name: 'Victoria Chen',
    email: 'v.chen@example.com',
    initials: 'VC',
    amount: '$12,450',
    status: 'Completed',
    statusType: 'success',
    date: 'Dec 24, 2024'
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    email: 'm.thompson@example.com',
    initials: 'MT',
    amount: '$8,900',
    status: 'Processing',
    statusType: 'warning',
    date: 'Dec 23, 2024'
  },
  {
    id: 3,
    name: 'Alexandra Mills',
    email: 'a.mills@example.com',
    initials: 'AM',
    amount: '$6,250',
    status: 'Completed',
    statusType: 'success',
    date: 'Dec 22, 2024'
  },
  {
    id: 4,
    name: 'James Sterling',
    email: 'j.sterling@example.com',
    initials: 'JS',
    amount: '$15,800',
    status: 'Pending',
    statusType: 'info',
    date: 'Dec 21, 2024'
  },
  {
    id: 5,
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@example.com',
    initials: 'ER',
    amount: '$4,200',
    status: 'Failed',
    statusType: 'error',
    date: 'Dec 20, 2024'
  }
];

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

export default function DataTable() {
  return (
    <motion.div
      className="table-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div className="table-header">
        <h3 className="table-title">Recent Transactions</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary">
            Export
            <ArrowUpRight size={14} />
          </button>
          <button className="btn btn-primary">
            View All
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <motion.tr
                key={customer.id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
              >
                <td>
                  <div className="table-user">
                    <div className="table-avatar">{customer.initials}</div>
                    <div className="table-user-info">
                      <div className="name">{customer.name}</div>
                      <div className="email">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {customer.amount}
                </td>
                <td>
                  <span className={`status-badge ${customer.statusType}`}>
                    <span className="status-dot" />
                    {customer.status}
                  </span>
                </td>
                <td>{customer.date}</td>
                <td>
                  <button className="icon-button" style={{ width: '32px', height: '32px' }}>
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
