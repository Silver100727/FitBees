import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Dumbbell,
  Activity
} from 'lucide-react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import { useDashboardStats } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui';

function StatSkeleton() {
  return (
    <div
      className="px-4 py-3"
      style={{
        background: 'var(--color-bg-secondary)',
        borderLeft: '3px solid var(--color-bg-tertiary)',
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-3 w-3" />
      </div>
      <Skeleton className="h-8 w-20 mb-1" />
      <Skeleton className="h-2.5 w-24" />
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  const statsData = stats ? [
    {
      icon: Users,
      value: stats.totalClients,
      label: 'Total Client',
      change: stats.totalClientsChange,
      changeType: stats.totalClientsChange?.startsWith('+') ? 'positive' : 'negative'
    },
    {
      icon: UserCheck,
      value: stats.activeClients,
      label: 'Active Client',
      change: stats.activeClientsChange,
      changeType: stats.activeClientsChange?.startsWith('+') ? 'positive' : 'negative'
    },
    {
      icon: Dumbbell,
      value: stats.totalTrainers,
      label: 'Total Trainer',
      change: stats.totalTrainersChange,
      changeType: stats.totalTrainersChange?.startsWith('+') ? 'positive' : 'negative'
    },
    {
      icon: Activity,
      value: stats.activeTrainers,
      label: 'Active Trainer',
      change: stats.activeTrainersChange,
      changeType: stats.activeTrainersChange?.startsWith('+') ? 'positive' : 'negative'
    }
  ] : [];

  return (
    <>
      <Topbar title="Dashboard" />
      <motion.div
        className="p-6 max-w-full overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            statsData.map((stat, index) => (
              <StatCard key={stat.label} {...stat} delay={index * 0.1} />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
