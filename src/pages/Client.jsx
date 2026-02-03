import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Eye,
  ChevronDown,
  X,
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
import { useClients } from '../hooks/useQueries';
import AddClientModal from '../components/AddClientModal';
import ViewClientModal from '../components/ViewClientModal';
import EditClientModal from '../components/EditClientModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div>
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-12 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell><Skeleton className="h-3 w-14" /></TableCell>
          <TableCell><Skeleton className="h-3 w-14" /></TableCell>
          <TableCell><Skeleton className="h-6 w-6" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

const membershipColors = {
  Premium: 'default',
  Standard: 'info',
  Basic: 'secondary',
};

const statusColors = {
  Active: 'success',
  Inactive: 'warning',
  Expired: 'error',
};

// Filter options
const membershipOptions = ['Premium', 'Standard', 'Basic'];
const statusOptions = ['Active', 'Inactive', 'Expired'];

// Column Filter Component
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
        className="w-32"
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

export default function Client() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const { data, isLoading } = useClients(1, search);
  const clients = data?.data || [];

  // Get unique trainers from data
  const trainerOptions = useMemo(() => {
    const trainers = [...new Set(clients.map(c => c.trainer).filter(Boolean))];
    return trainers;
  }, [clients]);

  const handleView = (client) => {
    navigate(`/dashboard/client/${client.id}`);
  };

  const handleQuickView = (client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  // Define columns
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Client',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback
                style={{
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              >
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {client.name}
              </p>
              <p className="text-[0.65rem] flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                <Mail size={9} />
                {client.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1 text-[0.7rem]" style={{ color: 'var(--color-text-secondary)' }}>
          <Phone size={9} />
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'membership',
      header: ({ column }) => <ColumnFilter column={column} title="Membership" options={membershipOptions} />,
      cell: ({ getValue }) => (
        <Badge variant={membershipColors[getValue()]}>
          {getValue()}
        </Badge>
      ),
      filterFn: 'equals',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <ColumnFilter column={column} title="Status" options={statusOptions} />,
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <Badge variant={statusColors[status]}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  status === 'Active'
                    ? 'var(--color-success)'
                    : status === 'Inactive'
                    ? 'var(--color-warning)'
                    : 'var(--color-error)',
              }}
            />
            {status}
          </Badge>
        );
      },
      filterFn: 'equals',
    },
    {
      accessorKey: 'trainer',
      header: ({ column }) => <ColumnFilter column={column} title="Trainer" options={trainerOptions} />,
      cell: ({ getValue }) => (
        <span className="text-[0.7rem]" style={{ color: 'var(--color-text-secondary)' }}>
          {getValue()}
        </span>
      ),
      filterFn: 'equals',
    },
    {
      accessorKey: 'joinDate',
      header: 'Joined',
      cell: ({ getValue }) => (
        <span className="text-[0.65rem]" style={{ color: 'var(--color-text-muted)' }}>
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'lastVisit',
      header: 'Last Visit',
      cell: ({ getValue }) => (
        <span className="text-[0.65rem]" style={{ color: 'var(--color-text-muted)' }}>
          {getValue()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const client = row.original;
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
              <DropdownMenuItem
                className="gap-2 text-xs cursor-pointer"
                onClick={() => handleView(client)}
              >
                <Eye size={12} />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-xs cursor-pointer"
                onClick={() => handleEdit(client)}
              >
                <Edit2 size={12} />
                Edit Client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-xs cursor-pointer"
                style={{ color: 'var(--color-error)' }}
                onClick={() => handleDelete(client)}
              >
                <Trash2 size={12} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [trainerOptions]);

  // Create table instance
  const table = useReactTable({
    data: clients,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      {/* Header Section */}
      <div
        className="mb-3 px-3 py-2 flex items-center justify-between gap-4"
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
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {isLoading ? '—' : filteredRows.length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {activeFiltersCount > 0 ? 'Filtered' : 'Total'}
            </span>
          </div>
          <div className="h-4 w-px" style={{ background: 'var(--color-border-subtle)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold" style={{ color: 'var(--color-success)' }}>
              {isLoading ? '—' : filteredRows.filter(r => r.original.status === 'Active').length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Active
            </span>
          </div>
          <div className="h-4 w-px" style={{ background: 'var(--color-border-subtle)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold" style={{ color: 'var(--color-warning)' }}>
              {isLoading ? '—' : filteredRows.filter(r => r.original.status === 'Inactive').length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Inactive
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

        {/* Add Button */}
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
          Add Client
        </Button>
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
            {isLoading ? (
              <TableSkeleton />
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    {search || activeFiltersCount > 0
                      ? 'No clients found matching your criteria.'
                      : 'No clients yet.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className="border-b border-border-subtle transition-colors hover:bg-bg-tertiary cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  onDoubleClick={() => handleView(row.original)}
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

      <AddClientModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      <ViewClientModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        client={selectedClient}
      />
      <EditClientModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        client={selectedClient}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        client={selectedClient}
      />
    </motion.div>
  );
}
