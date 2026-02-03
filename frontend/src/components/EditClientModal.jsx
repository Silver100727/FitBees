import { useState, useEffect } from 'react';
import { Edit3, Crown, Star, User, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Avatar,
  AvatarFallback,
  ScrollArea,
  DatePicker,
  NumberInput,
} from '@/components/ui';
import { useUpdateClient } from '../hooks/useQueries';

const membershipOptions = [
  { value: 'Premium', label: 'Premium', icon: Crown, color: 'var(--color-accent)' },
  { value: 'Standard', label: 'Standard', icon: Star, color: 'var(--color-info)' },
  { value: 'Basic', label: 'Basic', icon: User, color: 'var(--color-text-muted)' },
];

const trainerOptions = [
  { value: 'Mike Chen', initials: 'MC', specialty: 'Strength' },
  { value: 'Lisa Park', initials: 'LP', specialty: 'Cardio' },
  { value: 'John Smith', initials: 'JS', specialty: 'CrossFit' },
  { value: 'Sarah Kim', initials: 'SK', specialty: 'Yoga' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const goalOptions = [
  { value: 'Weight Loss', label: 'Weight Loss' },
  { value: 'Muscle Gain', label: 'Muscle Gain' },
  { value: 'Endurance', label: 'Endurance' },
  { value: 'Flexibility', label: 'Flexibility' },
  { value: 'General Fitness', label: 'General Fitness' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Expired', label: 'Expired' },
];

const inputStyle = {
  background: 'var(--color-bg-tertiary)',
  border: '1px solid var(--color-border-subtle)',
};

export default function EditClientModal({ open, onOpenChange, client }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    membership: 'Standard',
    membershipStart: '',
    membershipEnd: '',
    trainer: '',
    goal: '',
    weight: '',
    height: '',
    notes: '',
    status: 'Active',
  });

  const updateClient = useUpdateClient();

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        dateOfBirth: client.dateOfBirth || '',
        gender: client.gender || '',
        address: client.address || '',
        emergencyName: client.emergencyName || '',
        emergencyPhone: client.emergencyPhone || '',
        membership: client.membership || 'Standard',
        membershipStart: client.membershipStart || '',
        membershipEnd: client.membershipEnd || '',
        trainer: client.trainer || '',
        goal: client.goal || '',
        weight: client.weight || '',
        height: client.height || '',
        notes: client.notes || '',
        status: client.status || 'Active',
      });
    }
  }, [client]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const initials = formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    await updateClient.mutateAsync({
      id: client.id,
      ...formData,
      initials,
    });

    onOpenChange(false);
  };

  const SectionTitle = ({ children }) => (
    <div
      className="text-[0.6rem] font-semibold uppercase tracking-widest mb-2 mt-1"
      style={{ color: 'var(--color-accent)' }}
    >
      {children}
    </div>
  );

  const FieldLabel = ({ children }) => (
    <Label
      className="text-[0.6rem] font-medium uppercase tracking-wider"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {children}
    </Label>
  );

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center h-7 w-7"
              style={{
                background: 'var(--color-accent-glow)',
                color: 'var(--color-accent)',
              }}
            >
              <Edit3 size={14} />
            </div>
            <DialogTitle className="text-sm">Edit Client</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[65vh]">
            <div className="px-4 py-3 space-y-3">
              {/* Personal Information */}
              <SectionTitle>Personal Information</SectionTitle>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-1">
                  <FieldLabel>Full Name *</FieldLabel>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    className="h-8"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Date of Birth</FieldLabel>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={handleSelectChange('dateOfBirth')}
                    placeholder="Select date"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Gender</FieldLabel>
                  <Select value={formData.gender} onValueChange={handleSelectChange('gender')}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <FieldLabel>Email *</FieldLabel>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    className="h-8"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Phone *</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    required
                    className="h-8"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <FieldLabel>Address</FieldLabel>
                <Input
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleChange('address')}
                  className="h-8"
                  style={inputStyle}
                />
              </div>

              {/* Membership & Status */}
              <SectionTitle>Membership & Status</SectionTitle>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <FieldLabel>Membership Plan *</FieldLabel>
                  <Select value={formData.membership} onValueChange={handleSelectChange('membership')}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {membershipOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-1.5">
                              <Icon size={12} style={{ color: option.color }} />
                              {option.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <FieldLabel>Status *</FieldLabel>
                  <Select value={formData.status} onValueChange={handleSelectChange('status')}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <FieldLabel>Assigned Trainer</FieldLabel>
                  <Select value={formData.trainer} onValueChange={handleSelectChange('trainer')}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainerOptions.map((trainer) => (
                        <SelectItem key={trainer.value} value={trainer.value}>
                          <span className="flex items-center gap-1.5">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback
                                className="text-[0.4rem] font-semibold"
                                style={{
                                  background: 'var(--color-accent-glow)',
                                  color: 'var(--color-accent)',
                                }}
                              >
                                {trainer.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{trainer.value}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <FieldLabel>Membership Start</FieldLabel>
                  <DatePicker
                    value={formData.membershipStart}
                    onChange={handleSelectChange('membershipStart')}
                    placeholder="Start date"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Membership End</FieldLabel>
                  <DatePicker
                    value={formData.membershipEnd}
                    onChange={handleSelectChange('membershipEnd')}
                    placeholder="End date"
                    className="h-8"
                  />
                </div>
              </div>

              {/* Fitness Profile */}
              <SectionTitle>Fitness Profile</SectionTitle>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <FieldLabel>Fitness Goal</FieldLabel>
                  <Select value={formData.goal} onValueChange={handleSelectChange('goal')}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <FieldLabel>Weight (kg)</FieldLabel>
                  <NumberInput
                    value={formData.weight}
                    onChange={handleSelectChange('weight')}
                    placeholder="70"
                    min={0}
                    max={300}
                    step={0.5}
                    suffix="kg"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Height (cm)</FieldLabel>
                  <NumberInput
                    value={formData.height}
                    onChange={handleSelectChange('height')}
                    placeholder="175"
                    min={0}
                    max={250}
                    step={1}
                    suffix="cm"
                    className="h-8"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <SectionTitle>Emergency Contact</SectionTitle>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <FieldLabel>Contact Name</FieldLabel>
                  <Input
                    placeholder="Jane Doe"
                    value={formData.emergencyName}
                    onChange={handleChange('emergencyName')}
                    className="h-8"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <FieldLabel>Contact Phone</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 987-6543"
                    value={formData.emergencyPhone}
                    onChange={handleChange('emergencyPhone')}
                    className="h-8"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <SectionTitle>Additional Notes</SectionTitle>

              <div className="space-y-1">
                <textarea
                  placeholder="Medical conditions, allergies, special requirements..."
                  value={formData.notes}
                  onChange={handleChange('notes')}
                  rows={2}
                  className="w-full px-2 py-1.5 text-xs! resize-none"
                  style={{
                    ...inputStyle,
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs px-3"
              onClick={() => onOpenChange(false)}
              style={{
                background: 'transparent',
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-7 text-xs px-3"
              disabled={updateClient.isPending}
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg-primary)',
              }}
            >
              {updateClient.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
