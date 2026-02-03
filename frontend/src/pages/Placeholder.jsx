import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

export default function Placeholder({ title }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: 'calc(100vh - 45px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex items-center justify-center mb-6"
        style={{
          width: '80px',
          height: '80px',
          background: 'var(--color-accent-glow)',
          borderRadius: '12px',
          color: 'var(--color-accent)'
        }}
      >
        <Construction size={36} />
      </div>
      <h2
        className="font-display text-xl font-medium mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Coming Soon
      </h2>
      <p
        className="text-sm max-w-xs"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        The {title} page is currently under development.
      </p>
    </motion.div>
  );
}
