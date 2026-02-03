import { motion } from 'framer-motion';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
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
} from '@/components/ui';

const customers = [
  {
    id: 1,
    name: 'Victoria Chen',
    email: 'v.chen@example.com',
    initials: 'VC',
    amount: '$12,450',
    status: 'Completed',
    statusType: 'success',
    date: 'Dec 24, 2024'
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    email: 'm.thompson@example.com',
    initials: 'MT',
    amount: '$8,900',
    status: 'Processing',
    statusType: 'warning',
    date: 'Dec 23, 2024'
  },
  {
    id: 3,
    name: 'Alexandra Mills',
    email: 'a.mills@example.com',
    initials: 'AM',
    amount: '$6,250',
    status: 'Completed',
    statusType: 'success',
    date: 'Dec 22, 2024'
  },
  {
    id: 4,
    name: 'James Sterling',
    email: 'j.sterling@example.com',
    initials: 'JS',
    amount: '$15,800',
    status: 'Pending',
    statusType: 'info',
    date: 'Dec 21, 2024'
  },
  {
    id: 5,
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@example.com',
    initials: 'ER',
    amount: '$4,200',
    status: 'Failed',
    statusType: 'error',
    date: 'Dec 20, 2024'
  }
];

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

export default function DataTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <Card className="overflow-hidden hover:translate-y-0 hover:shadow-none">
        <CardHeader className="flex-row items-center justify-between border-b border-border-default pb-4">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <div className="flex gap-2">
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
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-b border-border-subtle transition-colors hover:bg-bg-tertiary"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {customer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-text-primary">
                          {customer.name}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-text-primary">
                    {customer.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.statusType} className="gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.date}</TableCell>
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
                        <DropdownMenuItem className="text-error">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
