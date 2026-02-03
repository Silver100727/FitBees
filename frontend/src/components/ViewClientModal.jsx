import { User, Mail, Phone, MapPin, Calendar, Crown, Star, Target, Activity, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  Avatar,
  AvatarFallback,
  ScrollArea,
  Separator,
} from '@/components/ui';

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

export default function ViewClientModal({ open, onOpenChange, client }) {
  if (!client) return null;

  const MembershipIcon = membershipIcons[client.membership] || User;

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div
        className="flex items-center justify-center h-7 w-7 shrink-0"
        style={{ background: 'var(--color-bg-tertiary)' }}
      >
        <Icon size={14} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[0.6rem] font-medium uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
          {value || '—'}
        </div>
      </div>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <div
      className="text-[0.6rem] font-semibold uppercase tracking-widest mb-3"
      style={{ color: 'var(--color-accent)' }}
    >
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="px-4 py-3">
          <DialogTitle className="text-sm">Client Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="px-4 py-3 space-y-4">
            {/* Client Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback
                  className="text-lg font-semibold"
                  style={{
                    background: 'var(--color-accent-glow)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {client.initials || client.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {client.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusColors[client.status]}>{client.status}</Badge>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: membershipColors[client.membership] }}
                  >
                    <MembershipIcon size={12} />
                    {client.membership}
                  </div>
                </div>
                <div
                  className="text-[0.65rem] mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Member since {client.joinDate}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <SectionTitle>Contact Information</SectionTitle>
              <div className="space-y-3">
                <InfoRow icon={Mail} label="Email" value={client.email} />
                <InfoRow icon={Phone} label="Phone" value={client.phone} />
                <InfoRow icon={MapPin} label="Address" value={client.address} />
              </div>
            </div>

            <Separator />

            {/* Personal Details */}
            <div>
              <SectionTitle>Personal Details</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow icon={Calendar} label="Date of Birth" value={client.dateOfBirth} />
                <InfoRow icon={User} label="Gender" value={client.gender} />
              </div>
            </div>

            <Separator />

            {/* Membership Details */}
            <div>
              <SectionTitle>Membership Details</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow icon={Crown} label="Plan" value={client.membership} />
                <InfoRow icon={User} label="Trainer" value={client.trainer} />
                <InfoRow icon={Calendar} label="Start Date" value={client.membershipStart} />
                <InfoRow icon={Calendar} label="End Date" value={client.membershipEnd} />
              </div>
            </div>

            <Separator />

            {/* Fitness Profile */}
            <div>
              <SectionTitle>Fitness Profile</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <InfoRow icon={Target} label="Goal" value={client.goal} />
                <InfoRow icon={Activity} label="Weight" value={client.weight ? `${client.weight} kg` : null} />
                <InfoRow icon={Activity} label="Height" value={client.height ? `${client.height} cm` : null} />
              </div>
            </div>

            <Separator />

            {/* Emergency Contact */}
            <div>
              <SectionTitle>Emergency Contact</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow icon={User} label="Name" value={client.emergencyName} />
                <InfoRow icon={Phone} label="Phone" value={client.emergencyPhone} />
              </div>
            </div>

            {client.notes && (
              <>
                <Separator />
                <div>
                  <SectionTitle>Notes</SectionTitle>
                  <div
                    className="text-xs p-3"
                    style={{
                      background: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {client.notes}
                  </div>
                </div>
              </>
            )}

            {/* Activity Summary */}
            <Separator />
            <div>
              <SectionTitle>Activity</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className="p-3 text-center"
                  style={{ background: 'var(--color-bg-tertiary)' }}
                >
                  <div
                    className="text-lg font-semibold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {client.totalVisits || 0}
                  </div>
                  <div
                    className="text-[0.6rem] uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Total Visits
                  </div>
                </div>
                <div
                  className="p-3 text-center"
                  style={{ background: 'var(--color-bg-tertiary)' }}
                >
                  <div
                    className="text-lg font-semibold"
                    style={{ color: 'var(--color-info)' }}
                  >
                    {client.thisMonth || 0}
                  </div>
                  <div
                    className="text-[0.6rem] uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    This Month
                  </div>
                </div>
                <div
                  className="p-3 text-center"
                  style={{ background: 'var(--color-bg-tertiary)' }}
                >
                  <div
                    className="text-xs font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {client.lastVisit || 'Never'}
                  </div>
                  <div
                    className="text-[0.6rem] uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Last Visit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
