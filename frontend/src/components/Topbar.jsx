import { ChevronRight } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Topbar({ title, breadcrumbs = [] }) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5"
      style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-default)' }}
    >
      <div className="flex items-center gap-4">
        <h1 className="font-display text-base font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h1>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>Dashboard</span>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5">
                <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ color: index === breadcrumbs.length - 1 ? 'var(--color-text-primary)' : 'inherit' }}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}
      </div>

      <NotificationDropdown />
    </header>
  );
}
