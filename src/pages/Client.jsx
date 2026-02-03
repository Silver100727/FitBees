import { useState } from 'react';
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
import { useClients } from '../hooks/useQueries';
import AddClientModal from '../components/AddClientModal';

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
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data, isLoading } = useClients(1, search);
  const clients = data?.data || [];

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div
        className="mb-4 p-4"
        style={{
          background: 'var(--color-bg-secondary)',
          borderLeft: '3px solid var(--color-accent)',
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-subtle)',
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              style={{
                background: 'transparent',
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Filter size={14} />
              Filter
            </Button>
            <Button
              size="sm"
              className="h-9 gap-2"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg-primary)',
              }}
            >
              <Plus size={14} />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {isLoading ? '—' : clients.length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Total
            </span>
          </div>
          <div className="h-6 w-px" style={{ background: 'var(--color-border-subtle)' }} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold" style={{ color: 'var(--color-success)' }}>
              {isLoading ? '—' : clients.filter(c => c.status === 'Active').length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Active
            </span>
          </div>
          <div className="h-6 w-px" style={{ background: 'var(--color-border-subtle)' }} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold" style={{ color: 'var(--color-warning)' }}>
              {isLoading ? '—' : clients.filter(c => c.status === 'Inactive').length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Inactive
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="w-12"></TableHead>
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
                  className="border-b border-border-subtle transition-colors hover:bg-bg-tertiary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
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
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                          <Eye size={12} />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                          <Edit2 size={12} />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-xs cursor-pointer"
                          style={{ color: 'var(--color-error)' }}
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
    </motion.div>
  );
}
