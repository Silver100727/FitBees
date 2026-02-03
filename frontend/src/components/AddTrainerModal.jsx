import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  Clock,
  FileText,
  Plus,
  Trash2,
  Dumbbell,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from '@/components/ui';
import { useCreateTrainer } from '../hooks/useQueries';

const roleOptions = [
  { value: 'Junior Trainer', label: 'Junior Trainer' },
  { value: 'Personal Trainer', label: 'Personal Trainer' },
  { value: 'Senior Trainer', label: 'Senior Trainer' },
  { value: 'Lead Trainer', label: 'Lead Trainer' },
];

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'In Session', label: 'In Session' },
  { value: 'Off Duty', label: 'Off Duty' },
];

const specialtyOptions = [
  { value: 'Strength Training', label: 'Strength Training', icon: Dumbbell },
  { value: 'HIIT', label: 'HIIT', icon: Zap },
  { value: 'Yoga', label: 'Yoga', icon: Heart },
  { value: 'Pilates', label: 'Pilates', icon: Heart },
  { value: 'Boxing', label: 'Boxing', icon: Target },
  { value: 'Cardio', label: 'Cardio', icon: TrendingUp },
  { value: 'Nutrition', label: 'Nutrition', icon: Heart },
  { value: 'Weight Loss', label: 'Weight Loss', icon: TrendingUp },
  { value: 'CrossFit', label: 'CrossFit', icon: Zap },
  { value: 'Functional', label: 'Functional', icon: Target },
  { value: 'Dance Fitness', label: 'Dance Fitness', icon: Heart },
  { value: 'Aerobics', label: 'Aerobics', icon: Zap },
  { value: 'Bodybuilding', label: 'Bodybuilding', icon: Dumbbell },
  { value: 'Competition Prep', label: 'Competition Prep', icon: Award },
  { value: 'Rehabilitation', label: 'Rehabilitation', icon: Heart },
  { value: 'Senior Fitness', label: 'Senior Fitness', icon: Users },
];

const colorOptions = [
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EF4444', label: 'Red' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#F97316', label: 'Orange' },
];

export default function AddTrainerModal({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'Available',
    specialties: [],
    yearsExp: '',
    certifications: [''],
    bio: '',
    color: '#F59E0B',
  });

  const [errors, setErrors] = useState({});
  const createTrainer = useCreateTrainer();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleSpecialty = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ''],
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const updateCertification = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => (i === index ? value : cert)),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (formData.specialties.length === 0) newErrors.specialties = 'Select at least one specialty';
    if (!formData.yearsExp) newErrors.yearsExp = 'Experience is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Split name into firstName and lastName
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      await createTrainer.mutateAsync({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        specialties: formData.specialties,
        yearsOfExperience: parseInt(formData.yearsExp),
        certifications: formData.certifications.filter((c) => c.trim()),
        bio: formData.bio,
      });

      // Reset form and close
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        status: 'Available',
        specialties: [],
        yearsExp: '',
        certifications: [''],
        bio: '',
        color: '#F59E0B',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create trainer:', error);
      alert(error.message || 'Failed to create trainer');
    }
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {/* Header */}
        <DialogHeader
          className="px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 flex items-center justify-center"
                style={{ background: `${formData.color}20` }}
              >
                <User size={18} style={{ color: formData.color }} />
              </div>
              <div>
                <DialogTitle
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Add New Trainer
                </DialogTitle>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Fill in the trainer details below
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 transition-colors hover:bg-bg-tertiary rounded"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {/* Profile Color */}
            <div>
              <Label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                Profile Color
              </Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.value)}
                    className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: color.value,
                      boxShadow: formData.color === color.value ? `0 0 0 2px var(--color-bg-secondary), 0 0 0 4px ${color.value}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Full Name *
                </Label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Smith"
                    className="pl-9"
                    style={{
                      borderColor: errors.name ? 'var(--color-error)' : undefined,
                    }}
                  />
                </div>
                {errors.name && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.name}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@fitbees.com"
                    className="pl-9"
                    style={{
                      borderColor: errors.email ? 'var(--color-error)' : undefined,
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="pl-9"
                    style={{
                      borderColor: errors.phone ? 'var(--color-error)' : undefined,
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.phone}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Years of Experience *
                </Label>
                <div className="relative">
                  <Clock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExp}
                    onChange={(e) => handleChange('yearsExp', e.target.value)}
                    placeholder="5"
                    className="pl-9"
                    style={{
                      borderColor: errors.yearsExp ? 'var(--color-error)' : undefined,
                    }}
                  />
                </div>
                {errors.yearsExp && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.yearsExp}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Role *
                </Label>
                <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                  <SelectTrigger
                    style={{
                      borderColor: errors.role ? 'var(--color-error)' : undefined,
                    }}
                  >
                    <Briefcase size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.role}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
            </div>

            {/* Specialties */}
            <div>
              <Label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                Specialties * <span className="text-text-muted">(Select all that apply)</span>
              </Label>
              <div
                className="grid grid-cols-4 gap-2 p-3"
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: errors.specialties ? '1px solid var(--color-error)' : '1px solid var(--color-border-subtle)',
                }}
              >
                {specialtyOptions.map((spec) => {
                  const Icon = spec.icon;
                  const isSelected = formData.specialties.includes(spec.value);
                  return (
                    <button
                      key={spec.value}
                      type="button"
                      onClick={() => toggleSpecialty(spec.value)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-[0.65rem] font-medium transition-colors"
                      style={{
                        background: isSelected ? formData.color : 'var(--color-bg-secondary)',
                        color: isSelected ? 'white' : 'var(--color-text-secondary)',
                        border: `1px solid ${isSelected ? formData.color : 'var(--color-border-subtle)'}`,
                      }}
                    >
                      <Icon size={10} />
                      {spec.label}
                    </button>
                  );
                })}
              </div>
              {errors.specialties && (
                <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.specialties}</p>
              )}
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Certifications
                </Label>
                <button
                  type="button"
                  onClick={addCertification}
                  className="flex items-center gap-1 text-[0.65rem] font-medium transition-colors"
                  style={{ color: formData.color }}
                >
                  <Plus size={10} />
                  Add Certification
                </button>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {formData.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex-1">
                        <Award
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--color-text-muted)' }}
                        />
                        <Input
                          value={cert}
                          onChange={(e) => updateCertification(index, e.target.value)}
                          placeholder="e.g., NASM-CPT, ACE, CrossFit L1"
                          className="pl-9"
                        />
                      </div>
                      {formData.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="p-2 transition-colors hover:bg-bg-tertiary rounded"
                          style={{ color: 'var(--color-error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Bio / Description
              </Label>
              <div className="relative">
                <FileText
                  size={14}
                  className="absolute left-3 top-3"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Brief description about the trainer's background and approach..."
                  className="pl-9 min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-5 py-4 border-t flex items-center justify-end gap-3 flex-shrink-0"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-9 px-4 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-4 text-xs gap-1.5"
              style={{
                background: formData.color,
                color: 'white',
              }}
              disabled={createTrainer.isPending}
            >
              <Plus size={14} />
              {createTrainer.isPending ? 'Adding...' : 'Add Trainer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
