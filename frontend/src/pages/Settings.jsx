import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  return (
    <>
      <Topbar title="Settings" breadcrumbs={['Settings']} />
      <motion.div
        className="page-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: 'var(--space-xl)',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-md)',
              height: 'fit-content'
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  background: activeTab === tab.id ? 'var(--color-accent-glow)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  transition: 'all var(--transition-base)',
                  marginBottom: 'var(--space-xs)'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)'
            }}
          >
            {activeTab === 'profile' && (
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  marginBottom: 'var(--space-xs)'
                }}>Profile Settings</h2>
                <p style={{
                  color: 'var(--color-text-tertiary)',
                  marginBottom: 'var(--space-xl)'
                }}>
                  Manage your account information and preferences
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xl)',
                  marginBottom: 'var(--space-xl)',
                  paddingBottom: 'var(--space-xl)',
                  borderBottom: '1px solid var(--color-border)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--color-bg-primary)'
                  }}>
                    {user?.initials || 'U'}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: 'var(--space-xs)' }}>{user?.name || 'User'}</h3>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                      {user?.role || 'Member'}
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }}>
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue={user?.name || ''} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" placeholder="City, Country" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xl)' }}>
                  <button className="btn btn-primary">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                  Notification Preferences
                </h2>
                <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-xl)' }}>
                  Choose what notifications you want to receive
                </p>

                {[
                  { label: 'Email Notifications', description: 'Receive updates via email' },
                  { label: 'Push Notifications', description: 'Receive push notifications on your device' },
                  { label: 'Order Updates', description: 'Get notified about order status changes' },
                  { label: 'Marketing Emails', description: 'Receive promotional content and offers' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-lg)',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-md)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                        {item.description}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={index < 3}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--color-accent)' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                  Security Settings
                </h2>
                <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-xl)' }}>
                  Manage your account security
                </p>

                <div style={{
                  padding: 'var(--space-xl)',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-lg)'
                }}>
                  <h3 style={{ marginBottom: 'var(--space-md)' }}>Change Password</h3>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                  <button className="btn btn-primary">Update Password</button>
                </div>

                <div style={{
                  padding: 'var(--space-xl)',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <h3 style={{ marginBottom: 'var(--space-sm)' }}>Two-Factor Authentication</h3>
                  <p style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: '0.875rem',
                    marginBottom: 'var(--space-md)'
                  }}>
                    Add an extra layer of security to your account
                  </p>
                  <button className="btn btn-secondary">Enable 2FA</button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                  Appearance
                </h2>
                <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-xl)' }}>
                  Customize your dashboard appearance
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--space-md)'
                }}>
                  {[
                    { name: 'Dark', active: true },
                    { name: 'Light', active: false },
                    { name: 'System', active: false }
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      style={{
                        padding: 'var(--space-xl)',
                        background: theme.active ? 'var(--color-accent-glow)' : 'var(--color-bg-tertiary)',
                        border: `2px solid ${theme.active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        color: theme.active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        fontWeight: 600,
                        transition: 'all var(--transition-base)'
                      }}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
