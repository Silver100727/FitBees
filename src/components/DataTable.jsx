import { motion } from 'framer-motion';
import { MoreHorizontal, ArrowUpRight, RefreshCw } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Skeleton,
} from '@/components/ui';
import { useTransactions } from '@/hooks/useQueries';

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="border-b border-border-subtle">
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function DataTable() {
  const { data, isLoading, error, refetch, isFetching } = useTransactions();
  const transactions = data?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <Card className="overflow-hidden hover:translate-y-0 hover:shadow-none">
        <CardHeader className="flex-row items-center justify-between border-b pb-4" style={{ borderColor: 'var(--color-border-default)' }}>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            </Button>
            <Button variant="secondary" size="sm">
              Export
              <ArrowUpRight size={14} />
            </Button>
            <Button size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ background: 'var(--color-bg-tertiary)' }}>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8" style={{ color: 'var(--color-error)' }}>
                    Failed to load transactions. Please try again.
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8" style={{ color: 'var(--color-text-tertiary)' }}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b transition-colors"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {customer.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            {customer.name}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {customer.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.statusType} className="gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ color: 'var(--color-text-secondary)' }}>
                      {customer.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit transaction</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem style={{ color: 'var(--color-error)' }}>
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
