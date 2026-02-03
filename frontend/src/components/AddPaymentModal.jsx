import { useState, useMemo } from 'react';
import {
  X,
  User,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
  Receipt,
  Plus,
  Loader2,
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
import { useClients, useCreatePayment } from '@/hooks/useQueries';

const typeOptions = [
  { value: 'Membership', label: 'Membership' },
  { value: 'Personal Training', label: 'Personal Training' },
  { value: 'Day Pass', label: 'Day Pass' },
  { value: 'Product', label: 'Product Sale' },
  { value: 'Other', label: 'Other' },
];

const planOptions = {
  Membership: [
    { value: 'Basic Monthly', label: 'Basic Monthly - $49', amount: 49 },
    { value: 'Standard Monthly', label: 'Standard Monthly - $79', amount: 79 },
    { value: 'Premium Monthly', label: 'Premium Monthly - $99', amount: 99 },
    { value: 'Basic Annual', label: 'Basic Annual - $470', amount: 470 },
    { value: 'Standard Annual', label: 'Standard Annual - $758', amount: 758 },
    { value: 'Premium Annual', label: 'Premium Annual - $950', amount: 950 },
  ],
  'Personal Training': [
    { value: '1 Session', label: '1 Session - $50', amount: 50 },
    { value: '5 Sessions', label: '5 Sessions - $150', amount: 150 },
    { value: '10 Sessions', label: '10 Sessions - $200', amount: 200 },
    { value: '20 Sessions', label: '20 Sessions - $300', amount: 300 },
  ],
  'Day Pass': [
    { value: 'Single Day', label: 'Single Day - $35', amount: 35 },
    { value: 'Week Pass', label: 'Week Pass - $100', amount: 100 },
  ],
  Product: [],
  Other: [],
};

const methodOptions = [
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Debit Card', label: 'Debit Card' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cash', label: 'Cash' },
];

const statusOptions = [
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
];

export default function AddPaymentModal({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    clientId: '',
    type: '',
    plan: '',
    amount: '',
    method: '',
    status: 'Completed',
    date: new Date(),
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch clients for dropdown
  const { data: clientsResponse } = useClients(1, '', { limit: 100 });
  const createPayment = useCreatePayment();

  const clientOptions = useMemo(() => {
    if (!clientsResponse?.data) return [];
    return clientsResponse.data.map(client => ({
      value: client.id,
      label: client.name,
      initials: client.initials,
    }));
  }, [clientsResponse]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-fill amount when plan is selected
      if (field === 'plan' && prev.type && planOptions[prev.type]) {
        const selectedPlan = planOptions[prev.type].find(p => p.value === value);
        if (selectedPlan) {
          updated.amount = selectedPlan.amount.toString();
        }
      }

      // Reset plan when type changes
      if (field === 'type') {
        updated.plan = '';
        updated.amount = '';
      }

      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clientId) newErrors.clientId = 'Client is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.method) newErrors.method = 'Payment method is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPayment.mutateAsync({
        clientId: formData.clientId,
        amount: formData.amount,
        paymentType: formData.type,
        paymentMethod: formData.method,
        status: formData.status.toLowerCase(),
        planDetails: formData.plan ? { planName: formData.plan } : undefined,
        description: formData.notes,
        transactionDate: formData.date.toISOString(),
      });

      // Reset form and close
      setFormData({
        clientId: '',
        type: '',
        plan: '',
        amount: '',
        method: '',
        status: 'Completed',
        date: new Date(),
        notes: '',
      });
      onOpenChange(false);
    } catch (error) {
      alert(error.message || 'Failed to create payment');
    }
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  const currentPlanOptions = formData.type ? planOptions[formData.type] || [] : [];

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
                style={{ background: 'var(--color-success)15' }}
              >
                <DollarSign size={18} style={{ color: 'var(--color-success)' }} />
              </div>
              <div>
                <DialogTitle
                  className="text-base font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Record Payment
                </DialogTitle>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Add a new payment transaction
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
            {/* Client */}
            <div>
              <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Client *
              </Label>
              <Select value={formData.clientId} onValueChange={(v) => handleChange('clientId', v)}>
                <SelectTrigger
                  style={{
                    borderColor: errors.clientId ? 'var(--color-error)' : undefined,
                  }}
                >
                  <User size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.clientId}</p>
              )}
            </div>

            {/* Type & Plan */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Payment Type *
                </Label>
                <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                  <SelectTrigger
                    style={{
                      borderColor: errors.type ? 'var(--color-error)' : undefined,
                    }}
                  >
                    <Receipt size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.type}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Plan / Package
                </Label>
                <Select
                  value={formData.plan}
                  onValueChange={(v) => handleChange('plan', v)}
                  disabled={!formData.type || currentPlanOptions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={currentPlanOptions.length ? "Select plan" : "N/A"} />
                  </SelectTrigger>
                  <SelectContent>
                    {currentPlanOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount & Method */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Amount ($) *
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
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="pl-9"
                    style={{
                      borderColor: errors.amount ? 'var(--color-error)' : undefined,
                    }}
                  />
                </div>
                {errors.amount && (
                  <p className="text-[0.65rem] mt-1" style={{ color: 'var(--color-error)' }}>{errors.amount}</p>
                )}
              </div>
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
            </div>

            {/* Date & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                  Payment Date
                </Label>
                <DatePicker
                  value={formData.date}
                  onChange={(date) => handleChange('date', date)}
                />
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

            {/* Amount Preview */}
            {formData.amount && (
              <div
                className="p-3 flex items-center justify-between"
                style={{ background: 'var(--color-bg-tertiary)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Total Amount
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--color-success)' }}>
                  ${parseFloat(formData.amount || 0).toFixed(2)}
                </span>
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
                background: 'var(--color-success)',
                color: 'white',
              }}
              disabled={createPayment.isPending}
            >
              {createPayment.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Record Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
