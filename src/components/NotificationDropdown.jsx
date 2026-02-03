import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, UserPlus, Dumbbell, CreditCard, AlertTriangle, Check, X } from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useQueries';

const iconMap = {
  client: UserPlus,
  trainer: Dumbbell,
  payment: CreditCard,
  alert: AlertTriangle,
};

const iconStyles = {
  client: { background: 'rgba(100, 210, 255, 0.1)', color: 'var(--color-info)' },
  trainer: { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-accent)' },
  payment: { background: 'rgba(52, 199, 89, 0.1)', color: 'var(--color-success)' },
  alert: { background: 'rgba(255, 159, 10, 0.1)', color: 'var(--color-warning)' },
};

function NotificationSkeleton() {
  return (
    <div className="px-3 py-2.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-2.5 py-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-default)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-3 py-2.5"
                style={{ borderBottom: '1px solid var(--color-border-default)' }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-accent)' }}
                    onClick={handleMarkAllRead}
                  >
                    <Check size={10} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <NotificationSkeleton />
                ) : notifications?.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      No notifications
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    {notifications?.map((notification, index) => {
                      const IconComponent = iconMap[notification.type] || Bell;
                      const style = iconStyles[notification.type] || iconStyles.alert;

                      return (
                        <motion.div
                          key={notification.id}
                          className="group relative flex gap-2.5 px-3 py-2.5 transition-colors"
                          style={{
                            background: notification.read ? 'transparent' : 'rgba(212, 175, 55, 0.03)',
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {/* Unread indicator */}
                          {!notification.read && (
                            <div
                              className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2"
                              style={{ background: 'var(--color-accent)' }}
                            />
                          )}

                          {/* Icon */}
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                            style={style}
                          >
                            <IconComponent size={14} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-medium leading-tight"
                              style={{ color: 'var(--color-text-primary)' }}
                            >
                              {notification.title}
                            </p>
                            <p
                              className="mt-0.5 text-[11px] leading-snug line-clamp-2"
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {notification.message}
                            </p>
                            <p
                              className="mt-1 text-[10px]"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {notification.time}
                            </p>
                          </div>

                          {/* Mark as read button */}
                          {!notification.read && (
                            <button
                              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center"
                              onClick={() => handleMarkRead(notification.id)}
                            >
                              <X size={12} style={{ color: 'var(--color-text-muted)' }} />
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications?.length > 0 && (
                <div
                  className="px-3 py-2"
                  style={{ borderTop: '1px solid var(--color-border-default)' }}
                >
                  <button
                    className="w-full text-center text-[11px] font-medium transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
