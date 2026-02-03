import { motion } from 'framer-motion';
import { DollarSign, UserPlus, AlertCircle, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton } from '@/components/ui';
import { useActivities } from '@/hooks/useQueries';
import { cn } from '@/lib/utils';

const iconMap = {
  sale: DollarSign,
  user: UserPlus,
  alert: AlertCircle,
  shipped: Package,
};

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

const iconColorStyles = {
  sale: { background: 'rgba(52, 199, 89, 0.1)', color: 'var(--color-success)' },
  user: { background: 'rgba(100, 210, 255, 0.1)', color: 'var(--color-info)' },
  alert: { background: 'rgba(255, 159, 10, 0.1)', color: 'var(--color-warning)' },
  shipped: { background: 'rgba(100, 210, 255, 0.1)', color: 'var(--color-info)' },
};

function ActivitySkeleton() {
  return (
    <div className="flex flex-col">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 py-3 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityFeed() {
  const { data: activities, isLoading, error } = useActivities();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card className="hover:translate-y-0 hover:shadow-none">
        <CardHeader className="flex-row items-center justify-between pb-4">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ActivitySkeleton />
          ) : error ? (
            <div className="h-75 flex items-center justify-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Failed to load activities
            </div>
          ) : (
            <motion.div
              className="flex flex-col"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {activities?.map((activity) => {
                const IconComponent = iconMap[activity.type] || DollarSign;
                const iconStyle = iconColorStyles[activity.type] || iconColorStyles.sale;

                return (
                  <motion.div
                    key={activity.id}
                    className="flex gap-3 py-3 last:border-0"
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    variants={itemVariants}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={iconStyle}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--color-text-secondary)' }}
                        dangerouslySetInnerHTML={{ __html: activity.text }}
                      />
                      <span
                        className="mt-1 block text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {activity.time}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
