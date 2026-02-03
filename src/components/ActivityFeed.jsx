import { motion } from 'framer-motion';
import { DollarSign, UserPlus, AlertCircle, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

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

const iconStyles = {
  sale: 'bg-success/10 text-success',
  user: 'bg-info/10 text-info',
  alert: 'bg-warning/10 text-warning',
};

export default function ActivityFeed() {
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
          <motion.div
            className="flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                className="flex gap-3 border-b border-border-subtle py-3 last:border-0"
                variants={itemVariants}
              >
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  iconStyles[activity.type]
                )}>
                  <activity.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-text-secondary leading-relaxed [&_strong]:font-semibold [&_strong]:text-text-primary"
                    dangerouslySetInnerHTML={{ __html: activity.text }}
                  />
                  <span className="mt-1 block text-xs text-text-muted">
                    {activity.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
