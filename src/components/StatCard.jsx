import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, value, label, change, changeType, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--color-bg-secondary)',
          borderLeft: '3px solid var(--color-accent)',
        }}
      >
        {/* Subtle diagonal accent */}
        <div
          className="absolute -right-8 -top-8 h-24 w-24 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]"
          style={{
            background: 'var(--color-accent)',
            transform: 'rotate(45deg)',
          }}
        />

        <div className="relative px-4 py-3">
          {/* Label row with icon */}
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {label}
            </span>
            <Icon
              size={14}
              className="opacity-30 group-hover:opacity-50 transition-opacity"
              style={{ color: 'var(--color-accent)' }}
            />
          </div>

          {/* Value */}
          <motion.div
            className="font-display text-3xl font-light tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.15, duration: 0.4 }}
          >
            {value}
          </motion.div>

          {/* Change indicator */}
          {change && (
            <div className="mt-1 flex items-center gap-1">
              <span
                className="text-[11px] font-medium"
                style={{
                  color: changeType === 'positive'
                    ? 'var(--color-success)'
                    : 'var(--color-error)'
                }}
              >
                {change}
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                vs last month
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
