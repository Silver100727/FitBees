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
  hidden: { x: -280, opacity: 0 },
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
        className="fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-border-default bg-card"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header / Logo */}
        <motion.div
          className="flex items-center gap-3 border-b border-border-default px-6 py-6"
          variants={itemVariants}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark font-display text-xl font-semibold text-bg-primary">
            F
          </div>
          <span className="font-display text-2xl font-medium tracking-wide text-text-primary">
            FitBees
          </span>
        </motion.div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <motion.nav className="flex flex-col gap-1" variants={itemVariants}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-all duration-200",
                    "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
                    isActive && "bg-accent-glow text-accent"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      className={cn(
                        "shrink-0 opacity-70 transition-opacity group-hover:opacity-100",
                        isActive && "opacity-100 text-accent"
                      )}
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
          className="border-t border-border-default p-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-bg-tertiary">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {user?.initials || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-semibold text-text-primary">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-text-tertiary">
                {user?.role || 'Member'}
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 shrink-0"
                >
                  <LogOut size={18} />
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
