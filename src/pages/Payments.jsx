import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  Download,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  X,
  Filter,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Skeleton,
} from '@/components/ui';
import AddPaymentModal from '../components/AddPaymentModal';

// Mock payment data
const paymentsData = [
  { id: 1, clientName: 'Sarah Johnson', clientInitials: 'SJ', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Credit Card', status: 'Completed', date: '2025-01-15', invoiceNo: 'INV-2025-001' },
  { id: 2, clientName: 'David Wilson', clientInitials: 'DW', amount: 49.00, type: 'Membership', plan: 'Basic Monthly', method: 'Debit Card', status: 'Completed', date: '2025-01-15', invoiceNo: 'INV-2025-002' },
  { id: 3, clientName: 'Emma Davis', clientInitials: 'ED', amount: 150.00, type: 'Personal Training', plan: '5 Sessions', method: 'Cash', status: 'Completed', date: '2025-01-14', invoiceNo: 'INV-2025-003' },
  { id: 4, clientName: 'James Miller', clientInitials: 'JM', amount: 79.00, type: 'Membership', plan: 'Standard Monthly', method: 'Credit Card', status: 'Pending', date: '2025-01-14', invoiceNo: 'INV-2025-004' },
  { id: 5, clientName: 'Olivia Brown', clientInitials: 'OB', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Bank Transfer', status: 'Completed', date: '2025-01-13', invoiceNo: 'INV-2025-005' },
  { id: 6, clientName: 'Michael Taylor', clientInitials: 'MT', amount: 49.00, type: 'Membership', plan: 'Basic Monthly', method: 'Credit Card', status: 'Failed', date: '2025-01-13', invoiceNo: 'INV-2025-006' },
  { id: 7, clientName: 'Sophia Anderson', clientInitials: 'SA', amount: 200.00, type: 'Personal Training', plan: '10 Sessions', method: 'Credit Card', status: 'Completed', date: '2025-01-12', invoiceNo: 'INV-2025-007' },
  { id: 8, clientName: 'William Martinez', clientInitials: 'WM', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Debit Card', status: 'Completed', date: '2025-01-12', invoiceNo: 'INV-2025-008' },
  { id: 9, clientName: 'Isabella Garcia', clientInitials: 'IG', amount: 35.00, type: 'Day Pass', plan: 'Single Day', method: 'Cash', status: 'Completed', date: '2025-01-11', invoiceNo: 'INV-2025-009' },
  { id: 10, clientName: 'Benjamin Lee', clientInitials: 'BL', amount: 79.00, type: 'Membership', plan: 'Standard Monthly', method: 'Credit Card', status: 'Refunded', date: '2025-01-11', invoiceNo: 'INV-2025-010' },
  { id: 11, clientName: 'Mia Thompson', clientInitials: 'MT', amount: 49.00, type: 'Membership', plan: 'Basic Monthly', method: 'Bank Transfer', status: 'Completed', date: '2025-01-10', invoiceNo: 'INV-2025-011' },
  { id: 12, clientName: 'Ethan White', clientInitials: 'EW', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Credit Card', status: 'Completed', date: '2025-01-10', invoiceNo: 'INV-2025-012' },
  { id: 13, clientName: 'Charlotte Harris', clientInitials: 'CH', amount: 300.00, type: 'Personal Training', plan: '20 Sessions', method: 'Credit Card', status: 'Pending', date: '2025-01-09', invoiceNo: 'INV-2025-013' },
  { id: 14, clientName: 'Alexander Clark', clientInitials: 'AC', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Debit Card', status: 'Completed', date: '2025-01-09', invoiceNo: 'INV-2025-014' },
  { id: 15, clientName: 'Amelia Lewis', clientInitials: 'AL', amount: 49.00, type: 'Membership', plan: 'Basic Monthly', method: 'Cash', status: 'Completed', date: '2025-01-08', invoiceNo: 'INV-2025-015' },
  { id: 16, clientName: 'Daniel Robinson', clientInitials: 'DR', amount: 79.00, type: 'Membership', plan: 'Standard Monthly', method: 'Credit Card', status: 'Completed', date: '2025-01-08', invoiceNo: 'INV-2025-016' },
  { id: 17, clientName: 'Harper Walker', clientInitials: 'HW', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Bank Transfer', status: 'Completed', date: '2025-01-07', invoiceNo: 'INV-2025-017' },
  { id: 18, clientName: 'Matthew Hall', clientInitials: 'MH', amount: 50.00, type: 'Personal Training', plan: '1 Session', method: 'Cash', status: 'Completed', date: '2025-01-07', invoiceNo: 'INV-2025-018' },
  { id: 19, clientName: 'Evelyn Young', clientInitials: 'EY', amount: 99.00, type: 'Membership', plan: 'Premium Monthly', method: 'Credit Card', status: 'Completed', date: '2025-01-06', invoiceNo: 'INV-2025-019' },
  { id: 20, clientName: 'Joseph King', clientInitials: 'JK', amount: 79.00, type: 'Membership', plan: 'Standard Monthly', method: 'Debit Card', status: 'Failed', date: '2025-01-06', invoiceNo: 'INV-2025-020' },
];

const statusConfig = {
  Completed: { color: 'var(--color-success)', bg: 'var(--color-success)', icon: CheckCircle },
  Pending: { color: 'var(--color-warning)', bg: 'var(--color-warning)', icon: Clock },
  Failed: { color: 'var(--color-error)', bg: 'var(--color-error)', icon: XCircle },
  Refunded: { color: 'var(--color-info)', bg: 'var(--color-info)', icon: AlertCircle },
};

const typeConfig = {
  Membership: { color: 'var(--color-accent)', icon: CreditCard },
  'Personal Training': { color: 'var(--color-success)', icon: Banknote },
  'Day Pass': { color: 'var(--color-info)', icon: Receipt },
};

const methodIcons = {
  'Credit Card': CreditCard,
  'Debit Card': CreditCard,
  'Bank Transfer': Banknote,
  'Cash': DollarSign,
};

// Filter options
const statusOptions = ['Completed', 'Pending', 'Failed', 'Refunded'];
const typeOptions = ['Membership', 'Personal Training', 'Day Pass'];
const methodOptions = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'];

function ColumnFilter({ column, title, options }) {
  const filterValue = column.getFilterValue();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 hover:text-text-primary transition-colors"
          style={{ color: filterValue ? 'var(--color-accent)' : 'inherit' }}
        >
          {title}
          {filterValue ? (
            <span className="text-[0.5rem] px-1 py-0.5 rounded" style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}>
              {filterValue}
            </span>
          ) : (
            <ChevronDown size={10} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-36"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {filterValue && (
          <>
            <DropdownMenuItem
              className="gap-2 text-xs cursor-pointer"
              onClick={() => column.setFilterValue(undefined)}
              style={{ color: 'var(--color-error)' }}
            >
              <X size={10} />
              Clear Filter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            className="gap-2 text-xs cursor-pointer"
            onClick={() => column.setFilterValue(option)}
            style={{
              background: filterValue === option ? 'var(--color-bg-tertiary)' : 'transparent',
            }}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--color-bg-secondary)',
          borderLeft: `3px solid ${color}`,
        }}
      >
        {/* Subtle diagonal accent */}
        <div
          className="absolute -right-8 -top-8 h-24 w-24 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]"
          style={{
            background: color,
            transform: 'rotate(45deg)',
          }}
        />

        <div className="relative px-4 py-3 h-18 flex flex-col justify-center">
          {/* Label row with icon */}
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {label}
            </span>
            <Icon
              size={14}
              className="opacity-30 group-hover:opacity-50 transition-opacity"
              style={{ color }}
            />
          </div>

          {/* Value */}
          <div
            className="font-display text-2xl font-light tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {value}
          </div>

          {/* Change indicator */}
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              <span
                className="text-[11px] font-medium flex items-center gap-0.5"
                style={{
                  color: trend > 0 ? 'var(--color-success)' : 'var(--color-error)'
                }}
              >
                {trend > 0 ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                vs last month
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Payments() {
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const total = paymentsData.reduce((acc, p) => p.status === 'Completed' ? acc + p.amount : acc, 0);
    const pending = paymentsData.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
    const completed = paymentsData.filter(p => p.status === 'Completed').length;
    const failed = paymentsData.filter(p => p.status === 'Failed').length;
    return { total, pending, completed, failed };
  }, []);

  // Define columns
  const columns = useMemo(() => [
    {
      accessorKey: 'invoiceNo',
      header: 'Invoice',
      cell: ({ getValue }) => (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-primary)' }}>
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback
                style={{
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                }}
              >
                {payment.clientInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {payment.clientName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting()}
        >
          Amount
          <ArrowUpDown size={10} />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
          ${getValue().toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <ColumnFilter column={column} title="Type" options={typeOptions} />,
      cell: ({ getValue }) => {
        const type = getValue();
        const config = typeConfig[type] || typeConfig.Membership;
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-1.5">
            <Icon size={12} style={{ color: config.color }} />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {type}
            </span>
          </div>
        );
      },
      filterFn: 'equals',
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ getValue }) => (
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'method',
      header: ({ column }) => <ColumnFilter column={column} title="Method" options={methodOptions} />,
      cell: ({ getValue }) => {
        const method = getValue();
        const Icon = methodIcons[method] || CreditCard;
        return (
          <div className="flex items-center gap-1.5">
            <Icon size={12} style={{ color: 'var(--color-text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {method}
            </span>
          </div>
        );
      },
      filterFn: 'equals',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <ColumnFilter column={column} title="Status" options={statusOptions} />,
      cell: ({ getValue }) => {
        const status = getValue();
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
          <div
            className="inline-flex items-center gap-1.5 px-2 py-1 text-[0.65rem] font-medium"
            style={{
              background: `${config.bg}15`,
              color: config.color,
            }}
          >
            <Icon size={10} />
            {status}
          </div>
        );
      },
      filterFn: 'equals',
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting()}
        >
          Date
          <ArrowUpDown size={10} />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {new Date(getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <Eye size={12} />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <Download size={12} />
                Download Invoice
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <Receipt size={12} />
                Send Receipt
              </DropdownMenuItem>
              {payment.status === 'Completed' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-xs cursor-pointer"
                    style={{ color: 'var(--color-warning)' }}
                  >
                    <AlertCircle size={12} />
                    Refund
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  // Create table instance
  const table = useReactTable({
    data: paymentsData,
    columns,
    state: {
      columnFilters,
      sorting,
      globalFilter: search,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredRows = table.getRowModel().rows;
  const activeFiltersCount = columnFilters.length;

  return (
    <motion.div
      className="p-4 h-[calc(100vh-41px)] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Payments
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Track and manage all transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            style={{
              background: 'transparent',
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Download size={12} />
            Export
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-bg-primary)',
            }}
          >
            <Plus size={12} />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats.total.toLocaleString()}`}
          color="var(--color-success)"
          trend={12.5}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={`$${stats.pending.toLocaleString()}`}
          color="var(--color-warning)"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed}
          color="var(--color-info)"
          trend={8.3}
        />
        <StatCard
          icon={XCircle}
          label="Failed"
          value={stats.failed}
          color="var(--color-error)"
          trend={-2.1}
        />
      </div>

      {/* Filters Bar */}
      <div
        className="flex items-center justify-between gap-4 mb-3 px-3 py-2"
        style={{
          background: 'var(--color-bg-secondary)',
          borderLeft: '3px solid var(--color-accent)',
        }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <Input
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          />
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {filteredRows.length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {activeFiltersCount > 0 ? 'Filtered' : 'Total'}
            </span>
          </div>
          {activeFiltersCount > 0 && (
            <>
              <div className="h-4 w-px" style={{ background: 'var(--color-border-subtle)' }} />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[0.65rem] gap-1"
                onClick={() => setColumnFilters([])}
                style={{ color: 'var(--color-error)' }}
              >
                <X size={10} />
                Clear Filters
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.id === 'actions' ? 'w-12' : ''}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <Receipt size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto' }} />
                  <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {search || activeFiltersCount > 0
                      ? 'No payments found matching your criteria.'
                      : 'No payments yet.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className="border-b border-border-subtle transition-colors hover:bg-bg-tertiary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.2 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </motion.div>
  );
}
