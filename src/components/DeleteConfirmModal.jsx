import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  Button,
  Avatar,
  AvatarFallback,
} from '@/components/ui';
import { useDeleteClient } from '../hooks/useQueries';

export default function DeleteConfirmModal({ open, onOpenChange, client }) {
  const deleteClient = useDeleteClient();

  const handleDelete = async () => {
    if (client?.id) {
      await deleteClient.mutateAsync(client.id);
      onOpenChange(false);
    }
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center h-7 w-7"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--color-error)',
              }}
            >
              <AlertTriangle size={14} />
            </div>
            <DialogTitle className="text-sm">Delete Client</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback
                className="text-sm font-semibold"
                style={{
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                }}
              >
                {client.initials || client.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {client.name}
              </div>
              <div
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {client.email}
              </div>
            </div>
          </div>

          <p
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Are you sure you want to delete this client? This action cannot be undone and will permanently remove all associated data including attendance history and payment records.
          </p>
        </div>

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
            type="button"
            size="sm"
            className="h-7 text-xs px-3"
            onClick={handleDelete}
            disabled={deleteClient.isPending}
            style={{
              background: 'var(--color-error)',
              color: 'white',
            }}
          >
            {deleteClient.isPending ? 'Deleting...' : 'Delete Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
