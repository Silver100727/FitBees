import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  Avatar,
  AvatarFallback,
  Separator,
  ScrollArea,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Client', path: '/dashboard/client' },
  { icon: Dumbbell, label: 'Staff Trainer', path: '/dashboard/staff-trainer' },
  { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
];

const sidebarVariants = {
  hidden: { x: -220, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        className="fixed top-0 left-0 z-50 flex h-screen w-55 flex-col"
        style={{ background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border-default)' }}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header / Logo */}
        <motion.div
          className="flex items-center gap-2 px-4 py-4"
          style={{ borderBottom: '1px solid var(--color-border-default)' }}
          variants={itemVariants}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md font-display text-base font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))', color: 'var(--color-bg-primary)' }}
          >
            F
          </div>
          <span className="font-display text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
            FitBees
          </span>
        </motion.div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <motion.nav className="flex flex-col gap-0.5" variants={itemVariants}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-200"
                  )
                }
                style={({ isActive }) => isActive ? {
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)'
                } : {
                  color: 'var(--color-text-secondary)'
                }}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={18}
                      className="shrink-0 transition-opacity group-hover:opacity-100"
                      style={{ opacity: isActive ? 1 : 0.7, color: isActive ? 'var(--color-accent)' : 'inherit' }}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </motion.nav>
        </ScrollArea>

        {/* Footer / User */}
        <motion.div
          className="p-3"
          style={{ borderTop: '1px solid var(--color-border-default)' }}
          variants={itemVariants}
        >
          <div className="flex items-center gap-2.5 rounded-md p-2 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.initials || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="truncate text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {user?.name || 'User'}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {user?.role || 'Member'}
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-7 w-7 shrink-0"
                >
                  <LogOut size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      </motion.aside>
    </TooltipProvider>
  );
}
