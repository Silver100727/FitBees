import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Crown,
  Star,
  Target,
  Activity,
  Edit2,
  CreditCard,
  Clock,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  ScrollArea,
} from '@/components/ui';
import { useClients } from '../hooks/useQueries';
import EditClientModal from '../components/EditClientModal';

const membershipIcons = {
  Premium: Crown,
  Standard: Star,
  Basic: User,
};

const membershipColors = {
  Premium: 'var(--color-accent)',
  Standard: 'var(--color-info)',
  Basic: 'var(--color-text-muted)',
};

const statusColors = {
  Active: 'success',
  Inactive: 'warning',
  Expired: 'error',
};

// Mock attendance data
const mockAttendance = [
  { id: 1, date: 'Jan 15, 2025', time: '09:30 AM', type: 'Check-in', duration: '1h 45m' },
  { id: 2, date: 'Jan 14, 2025', time: '07:00 AM', type: 'Check-in', duration: '2h 00m' },
  { id: 3, date: 'Jan 12, 2025', time: '06:30 PM', type: 'Check-in', duration: '1h 30m' },
  { id: 4, date: 'Jan 10, 2025', time: '08:00 AM', type: 'Check-in', duration: '1h 15m' },
  { id: 5, date: 'Jan 8, 2025', time: '07:30 AM', type: 'Check-in', duration: '2h 00m' },
];

// Mock payment data
const mockPayments = [
  { id: 1, date: 'Jan 1, 2025', amount: '$99.00', type: 'Premium Monthly', status: 'Completed' },
  { id: 2, date: 'Dec 1, 2024', amount: '$99.00', type: 'Premium Monthly', status: 'Completed' },
  { id: 3, date: 'Nov 1, 2024', amount: '$99.00', type: 'Premium Monthly', status: 'Completed' },
  { id: 4, date: 'Oct 15, 2024', amount: '$50.00', type: 'Personal Training', status: 'Completed' },
  { id: 5, date: 'Oct 1, 2024', amount: '$99.00', type: 'Premium Monthly', status: 'Completed' },
];

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data } = useClients(1);
  const clients = data?.data || [];
  const client = clients.find((c) => c.id === parseInt(id));

  if (!client) {
    return (
      <motion.div
        className="p-4 flex items-center justify-center h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <p style={{ color: 'var(--color-text-muted)' }}>Client not found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate('/dashboard/client')}
          >
            Back to Clients
          </Button>
        </div>
      </motion.div>
    );
  }

  const MembershipIcon = membershipIcons[client.membership] || User;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'payments', label: 'Payments' },
    { id: 'progress', label: 'Progress' },
  ];

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div
        className="flex items-center justify-center h-8 w-8 shrink-0"
        style={{ background: 'var(--color-bg-tertiary)' }}
      >
        <Icon size={14} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <div>
        <div
          className="text-[0.65rem] font-medium uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </div>
        <div className="text-sm mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
          {value || '—'}
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div
      className="p-4"
      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center h-10 w-10"
          style={{ background: `${color}15` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <div className="text-xl font-semibold" style={{ color }}>{value}</div>
          <div className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="p-4 h-[calc(100vh-41px)] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/dashboard/client')}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Client Profile
        </h1>
      </div>

      {/* Client Header Card */}
      <div
        className="p-4 mb-4"
        style={{
          background: 'var(--color-bg-secondary)',
          borderLeft: '3px solid var(--color-accent)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback
                className="text-lg font-semibold"
                style={{
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                }}
              >
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {client.name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={statusColors[client.status]}>{client.status}</Badge>
                <div
                  className="flex items-center gap-1 text-sm"
                  style={{ color: membershipColors[client.membership] }}
                >
                  <MembershipIcon size={14} />
                  {client.membership}
                </div>
              </div>
              <div
                className="text-xs mt-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Member since {client.joinDate} • Last visit {client.lastVisit}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditModalOpen(true)}
            style={{
              background: 'transparent',
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Edit2 size={14} />
            Edit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-4 p-1"
        style={{ background: 'var(--color-bg-tertiary)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-xs font-medium transition-colors"
            style={{
              background: activeTab === tab.id ? 'var(--color-bg-secondary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-4">
          {/* Contact Info */}
          <div
            className="col-span-2 p-4"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
          >
            <h3
              className="text-[0.65rem] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={client.email} />
              <InfoItem icon={Phone} label="Phone" value={client.phone} />
              <InfoItem icon={MapPin} label="Address" value={client.address} />
              <InfoItem icon={Calendar} label="Date of Birth" value={client.dateOfBirth} />
            </div>

            <Separator className="my-4" />

            <h3
              className="text-[0.65rem] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Fitness Profile
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <InfoItem icon={Target} label="Goal" value={client.goal} />
              <InfoItem icon={Activity} label="Weight" value={client.weight ? `${client.weight} kg` : null} />
              <InfoItem icon={Activity} label="Height" value={client.height ? `${client.height} cm` : null} />
            </div>

            <Separator className="my-4" />

            <h3
              className="text-[0.65rem] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Emergency Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={User} label="Name" value={client.emergencyName} />
              <InfoItem icon={Phone} label="Phone" value={client.emergencyPhone} />
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <StatCard icon={CheckCircle} label="Total Check-ins" value="48" color="var(--color-accent)" />
            <StatCard icon={Clock} label="This Month" value="12" color="var(--color-info)" />
            <StatCard icon={CreditCard} label="Total Spent" value="$1,188" color="var(--color-success)" />
            <StatCard icon={TrendingUp} label="Avg. Duration" value="1h 45m" color="var(--color-warning)" />
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div
          className="p-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
        >
          <h3
            className="text-[0.65rem] font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Attendance History
          </h3>
          <div className="space-y-2">
            {mockAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3"
                style={{ background: 'var(--color-bg-tertiary)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center h-8 w-8"
                    style={{ background: 'var(--color-accent-glow)' }}
                  >
                    <CheckCircle size={14} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {record.type}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {record.date} at {record.time}
                    </div>
                  </div>
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Duration: {record.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div
          className="p-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
        >
          <h3
            className="text-[0.65rem] font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Payment History
          </h3>
          <div className="space-y-2">
            {mockPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3"
                style={{ background: 'var(--color-bg-tertiary)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center h-8 w-8"
                    style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                  >
                    <CreditCard size={14} style={{ color: 'var(--color-success)' }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {payment.type}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {payment.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>
                    {payment.amount}
                  </div>
                  <Badge variant="success" className="text-[0.6rem]">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div
          className="p-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}
        >
          <h3
            className="text-[0.65rem] font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Fitness Progress
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 text-center" style={{ background: 'var(--color-bg-tertiary)' }}>
              <div className="text-2xl font-semibold" style={{ color: 'var(--color-accent)' }}>
                -5.2
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>kg Lost</div>
            </div>
            <div className="p-4 text-center" style={{ background: 'var(--color-bg-tertiary)' }}>
              <div className="text-2xl font-semibold" style={{ color: 'var(--color-info)' }}>
                +8%
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Strength Gain</div>
            </div>
            <div className="p-4 text-center" style={{ background: 'var(--color-bg-tertiary)' }}>
              <div className="text-2xl font-semibold" style={{ color: 'var(--color-success)' }}>
                92%
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Goal Progress</div>
            </div>
          </div>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
            Detailed progress charts coming soon...
          </p>
        </div>
      )}

      <EditClientModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        client={client}
      />
    </motion.div>
  );
}
