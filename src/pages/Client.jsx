import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Eye,
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
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div>
                <Skeleton className="h-3.5 w-28 mb-1.5" />
                <Skeleton className="h-2.5 w-36" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-3 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell><Skeleton className="h-3 w-16" /></TableCell>
          <TableCell><Skeleton className="h-3 w-20" /></TableCell>
          <TableCell><Skeleton className="h-7 w-7" /></TableCell>
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

export default function Client() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { data, isLoading } = useClients(1, search);
  const clients = data?.data || [];

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
              {isLoading ? '—' : clients.length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Total
            </span>
          </div>
          <div className="h-4 w-px" style={{ background: 'var(--color-border-subtle)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold" style={{ color: 'var(--color-success)' }}>
              {isLoading ? '—' : clients.filter(c => c.status === 'Active').length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Active
            </span>
          </div>
          <div className="h-4 w-px" style={{ background: 'var(--color-border-subtle)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-semibold" style={{ color: 'var(--color-warning)' }}>
              {isLoading ? '—' : clients.filter(c => c.status === 'Inactive').length}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Inactive
            </span>
          </div>
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
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Client</TableHead>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Phone</TableHead>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Membership</TableHead>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Status</TableHead>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Trainer</TableHead>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Joined</TableHead>
              <TableHead style={{ background: 'var(--color-bg-secondary)' }}>Last Visit</TableHead>
              <TableHead className="w-12" style={{ background: 'var(--color-bg-secondary)' }}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    {search ? 'No clients found matching your search.' : 'No clients yet.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  className="border-b border-border-subtle transition-colors hover:bg-bg-tertiary cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  onDoubleClick={() => handleView(client)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          style={{
                            background: 'var(--color-accent-glow)',
                            color: 'var(--color-accent)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {client.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {client.name}
                        </p>
                        <p
                          className="text-xs flex items-center gap-1"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          <Mail size={10} />
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <Phone size={10} />
                      {client.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={membershipColors[client.membership]}>
                      {client.membership}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[client.status]}>
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            client.status === 'Active'
                              ? 'var(--color-success)'
                              : client.status === 'Inactive'
                              ? 'var(--color-warning)'
                              : 'var(--color-error)',
                        }}
                      />
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {client.trainer}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {client.joinDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {client.lastVisit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          <MoreHorizontal size={14} />
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
                  </TableCell>
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
