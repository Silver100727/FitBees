import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import ActivityFeed from '../components/ActivityFeed';
import DataTable from '../components/DataTable';

const stats = [
  {
    icon: DollarSign,
    value: '$84,254',
    label: 'Total Revenue',
    change: '+12.5%',
    changeType: 'positive'
  },
  {
    icon: Users,
    value: '2,345',
    label: 'Total Customers',
    change: '+8.2%',
    changeType: 'positive'
  },
  {
    icon: ShoppingBag,
    value: '1,247',
    label: 'Total Orders',
    change: '+23.1%',
    changeType: 'positive'
  },
  {
    icon: TrendingUp,
    value: '18.2%',
    label: 'Conversion Rate',
    change: '-2.4%',
    changeType: 'negative'
  }
];

export default function Dashboard() {
  return (
    <>
      <Topbar title="Dashboard" />
      <motion.div
        className="page-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="dashboard-grid">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>

        <div className="charts-row">
          <RevenueChart />
          <ActivityFeed />
        </div>

        <DataTable />
      </motion.div>
    </>
  );
}
