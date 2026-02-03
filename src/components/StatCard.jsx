import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, value, label, change, changeType, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-glow text-accent">
            <Icon size={24} />
          </div>
          {change && (
            <Badge
              variant={changeType === 'positive' ? 'success' : 'error'}
              className="flex items-center gap-1"
            >
              {changeType === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </Badge>
          )}
        </div>
        <motion.div
          className="font-display text-4xl font-semibold text-text-primary mb-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >
          {value}
        </motion.div>
        <div className="text-sm text-text-tertiary uppercase tracking-[0.05em]">
          {label}
        </div>
      </Card>
    </motion.div>
  );
}
