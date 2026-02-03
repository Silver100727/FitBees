import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import Topbar from '../components/Topbar';

export default function Placeholder({ title }) {
  return (
    <>
      <Topbar title={title} breadcrumbs={[title]} />
      <motion.div
        className="page-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            width: '100px',
            height: '100px',
            background: 'var(--color-accent-glow)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-xl)',
            color: 'var(--color-accent)'
          }}
        >
          <Construction size={48} />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: '2rem',
            marginBottom: 'var(--space-md)'
          }}
        >
          Coming Soon
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: 'var(--color-text-tertiary)',
            maxWidth: '400px',
            lineHeight: 1.6
          }}
        >
          The {title} page is currently under development.
          Check back soon for updates.
        </motion.p>
      </motion.div>
    </>
  );
}
