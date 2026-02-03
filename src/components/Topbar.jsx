import { motion } from 'framer-motion';
import { Search, Bell, Settings, ChevronRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function Topbar({ title, breadcrumbs = [] }) {
  return (
    <motion.header
      className="sticky top-0 z-40 flex items-center justify-between border-b border-border-default bg-card px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-6">
        <div>
          <h1 className="font-display text-2xl font-medium">{title}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-text-tertiary">
              <span>Dashboard</span>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-text-muted" />
                  <span className={cn(index === breadcrumbs.length - 1 && "text-text-primary")}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            type="text"
            placeholder="Search anything..."
            className="w-70 rounded-full pl-10 transition-all duration-250 focus:w-80"
          />
        </div>

        <div className="flex items-center gap-1">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-card bg-accent" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
