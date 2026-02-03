import { useState, useMemo } from 'react';
import {
  X,
  User,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
  Wallet,
  Plus,
  Minus,
  Calculator,
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
  DatePicker,
} from '@/components/ui';

const trainerOptions = [
  { value: '1', label: 'Mike Chen', initials: 'MC', baseSalary: 4500, role: 'Senior Trainer' },
  { value: '2', label: 'Lisa Park', initials: 'LP', baseSalary: 4200, role: 'Head Trainer' },
  { value: '3', label: 'John Smith', initials: 'JS', baseSalary: 3800, role: 'Trainer' },
  { value: '4', label: 'Sarah Kim', initials: 'SK', baseSalary: 4000, role: 'Senior Trainer' },
  { value: '5', label: 'Alex Rodriguez', initials: 'AR', baseSalary: 3500, role: 'Junior Trainer' },
  { value: '6', label: 'Emma Watson', initials: 'EW', baseSalary: 3800, role: 'Trainer' },
  { value: '7', label: 'David Lee', initials: 'DL', baseSalary: 4100, role: 'Senior Trainer' },
  { value: '8', label: 'Rachel Green', initials: 'RG', baseSalary: 3600, role: 'Trainer' },
];

const periodOptions = [
  { value: 'January 2025', label: 'January 2025' },
  { value: 'February 2025', label: 'February 2025' },
  { value: 'March 2025', label: 'March 2025' },
  { value: 'April 2025', label: 'April 2025' },
  { value: 'May 2025', label: 'May 2025' },
  { value: 'June 2025', label: 'June 2025' },
  { value: 'July 2025', label: 'July 2025' },
  { value: 'August 2025', label: 'August 2025' },
  { value: 'September 2025', label: 'September 2025' },
  { value: 'October 2025', label: 'October 2025' },
  { value: 'November 2025', label: 'November 2025' },
  { value: 'December 2025', label: 'December 2025' },
];

const methodOptions = [
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Check', label: 'Check' },
  { value: 'Direct Deposit', label: 'Direct Deposit' },
  { value: 'Cash', label: 'Cash' },
];

export default function ProcessSalaryModal({ open, onOpenChange, preSelectedTrainer = null }) {
  const [formData, setFormData] = useState({
    trainerId: preSelectedTrainer || '',
    period: '',
    baseSalary: '',
    bonuses: '',
    deductions: '',
    method: 'Bank Transfer',
    date: new Date(),
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Auto-fill base salary when trainer is selected
  const handleTrainerChange = (trainerId) => {
    const trainer = trainerOptions.find(t => t.value === trainerId);
    setFormData(prev => ({
      ...prev,
      trainerId,
      baseSalary: trainer ? trainer.baseSalary.toString() : '',
    }));
    if (errors.trainerId) {
      setErrors(prev => ({ ...prev, trainerId: '' }));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedTrainer = useMemo(() => {
    return trainerOptions.find(t => t.value === formData.trainerId);
  }, [formData.trainerId]);

  const calculations = useMemo(() => {
    const base = parseFloat(formData.baseSalary) || 0;
    const bonus = parseFloat(formData.bonuses) || 0;
    const deduction = parseFloat(formData.deductions) || 0;
    const gross = base + bonus;
    const net = gross - deduction;
    return { base, bonus, deduction, gross, net };
  }, [formData.baseSalary, formData.bonuses, formData.deductions]);

  const validate = () => {
    const newErrors = {};
    if (!formData.trainerId) newErrors.trainerId = 'Trainer is required';
    if (!formData.period) newErrors.period = 'Pay period is required';
    if (!formData.baseSalary || parseFloat(formData.baseSalary) <= 0) {
      newErrors.baseSalary = 'Valid base salary is required';
    }
    if (!formData.method) newErrors.method = 'Payment method is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const salaryData = {
      ...formData,
      trainerName: selectedTrainer?.label,
      trainerInitials: selectedTrainer?.initials,
      ...calculations,
      transactionId: `SAL-${Date.now().toString(36).toUpperCase()}`,
    };

    console.log('Salary Processed:', salaryData);
    // TODO: Call API to process salary

    // Reset form and close
    setFormData({
      trainerId: '',
      period: '',
      baseSalary: '',
      bonuses: '',
      deductions: '',
      method: 'Bank Transfer',
      date: new Date(),
      notes: '',
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0"
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
                style={{ background: 'var(--color-accent)15' }}
              >
                <Wallet size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <DialogTitle
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Process Salary
                </DialogTitle>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Pay salary to staff trainer
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
          <div className="px-5 py-4 space-y-4">
            {/* Trainer Selection */}
            <div>
              <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Select Trainer *
              </Label>
              <Select value={formData.trainerId} onValueChange={handleTrainerChange}>
                <SelectTrigger
                  style={{
                    borderColor: errors.trainerId ? 'var(--color-error)' : undefined,
                  }}
                >
                  <User size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <SelectValue placeholder="Choose a trainer" />
                </SelectTrigger>
                <SelectContent>
                  {trainerOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        {opt.label}
                        <span className="text-[0.65rem] px-1.5 py-0.5 rounded" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                          {opt.role}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.trainerId && (
                <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.trainerId}</p>
              )}
            </div>

            {/* Selected Trainer Info */}
            {selectedTrainer && (
              <div
                className="p-3 flex items-center gap-3"
                style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div
                  className="h-10 w-10 flex items-center justify-center text-xs font-semibold"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                >
                  {selectedTrainer.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {selectedTrainer.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {selectedTrainer.role} • Base: ${selectedTrainer.baseSalary.toLocaleString()}/month
                  </p>
                </div>
              </div>
            )}

            {/* Pay Period & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Pay Period *
                </Label>
                <Select value={formData.period} onValueChange={(v) => handleChange('period', v)}>
                  <SelectTrigger
                    style={{
                      borderColor: errors.period ? 'var(--color-error)' : undefined,
                    }}
                  >
                    <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.period && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.period}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Payment Date
                </Label>
                <DatePicker
                  value={formData.date}
                  onChange={(date) => handleChange('date', date)}
                />
              </div>
            </div>

            {/* Salary Breakdown */}
            <div
              className="p-4 space-y-3"
              style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={14} style={{ color: 'var(--color-accent)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Salary Breakdown
                </span>
              </div>

              {/* Base Salary */}
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Base Salary *
                </Label>
                <div className="relative">
                  <DollarSign
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.baseSalary}
                    onChange={(e) => handleChange('baseSalary', e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                    style={{
                      borderColor: errors.baseSalary ? 'var(--color-error)' : undefined,
                    }}
                  />
                </div>
                {errors.baseSalary && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.baseSalary}</p>
                )}
              </div>

              {/* Bonuses & Deductions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <Plus size={12} style={{ color: 'var(--color-success)' }} />
                    Bonuses
                  </Label>
                  <div className="relative">
                    <DollarSign
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--color-success)' }}
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.bonuses}
                      onChange={(e) => handleChange('bonuses', e.target.value)}
                      placeholder="0.00"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <Minus size={12} style={{ color: 'var(--color-error)' }} />
                    Deductions
                  </Label>
                  <div className="relative">
                    <DollarSign
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--color-error)' }}
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.deductions}
                      onChange={(e) => handleChange('deductions', e.target.value)}
                      placeholder="0.00"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Payment Method *
              </Label>
              <Select value={formData.method} onValueChange={(v) => handleChange('method', v)}>
                <SelectTrigger
                  style={{
                    borderColor: errors.method ? 'var(--color-error)' : undefined,
                  }}
                >
                  <CreditCard size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {methodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.method && (
                <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.method}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Notes (Optional)
              </Label>
              <div className="relative">
                <FileText
                  size={14}
                  className="absolute left-3 top-3"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add any additional notes..."
                  className="pl-9 min-h-[60px] resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Summary */}
            {formData.baseSalary && (
              <div
                className="p-4 space-y-2"
                style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)' }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--color-text-muted)' }}>Base Salary</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>${calculations.base.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {calculations.bonus > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--color-success)' }}>+ Bonuses</span>
                    <span style={{ color: 'var(--color-success)' }}>+${calculations.bonus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {calculations.deduction > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--color-error)' }}>- Deductions</span>
                    <span style={{ color: 'var(--color-error)' }}>-${calculations.deduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div
                  className="flex items-center justify-between pt-2 mt-2"
                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Net Pay
                  </span>
                  <span className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>
                    ${calculations.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
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
                background: 'var(--color-accent)',
                color: 'var(--color-bg-primary)',
              }}
            >
              <Wallet size={14} />
              Process Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
