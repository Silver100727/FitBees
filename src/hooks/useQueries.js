import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API functions - replace with actual API calls
const api = {
  async fetchDashboardStats() {
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalClients: '1,248',
      activeClients: '892',
      totalTrainers: '45',
      activeTrainers: '38',
      totalClientsChange: '+12.5%',
      activeClientsChange: '+8.2%',
      totalTrainersChange: '+4.5%',
      activeTrainersChange: '+2.1%',
    };
  },

  async fetchTransactions(page = 1, limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
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
      ],
      pagination: {
        page,
        limit,
        total: 50,
        totalPages: 5,
      },
    };
  },

  async fetchRevenueData(period = '1Y') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { name: 'Jan', revenue: 4000, orders: 240 },
      { name: 'Feb', revenue: 3000, orders: 198 },
      { name: 'Mar', revenue: 5000, orders: 320 },
      { name: 'Apr', revenue: 4500, orders: 278 },
      { name: 'May', revenue: 6000, orders: 389 },
      { name: 'Jun', revenue: 5500, orders: 349 },
      { name: 'Jul', revenue: 7000, orders: 420 },
      { name: 'Aug', revenue: 6500, orders: 398 },
      { name: 'Sep', revenue: 8000, orders: 489 },
      { name: 'Oct', revenue: 7500, orders: 456 },
      { name: 'Nov', revenue: 9000, orders: 534 },
      { name: 'Dec', revenue: 8500, orders: 510 },
    ];
  },

  async fetchActivities() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        type: 'sale',
        text: '<strong>New order</strong> received from Victoria Chen for $2,450',
        time: '2 minutes ago'
      },
      {
        id: 2,
        type: 'user',
        text: '<strong>New customer</strong> registered: Marcus Thompson',
        time: '15 minutes ago'
      },
      {
        id: 3,
        type: 'alert',
        text: '<strong>Low stock alert</strong> for Premium Collection items',
        time: '1 hour ago'
      },
      {
        id: 4,
        type: 'sale',
        text: '<strong>Payment received</strong> of $8,900 from Sterling Corp',
        time: '2 hours ago'
      },
      {
        id: 5,
        type: 'user',
        text: '<strong>Order shipped</strong> to Alexandra Mills - Express delivery',
        time: '3 hours ago'
      }
    ];
  },

  async fetchClients(page = 1, search = '') {
    await new Promise(resolve => setTimeout(resolve, 400));
    const allClients = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        initials: 'SJ',
        membership: 'Premium',
        status: 'Active',
        trainer: 'Mike Chen',
        joinDate: 'Jan 15, 2024',
        lastVisit: '2 hours ago',
      },
      {
        id: 2,
        name: 'David Wilson',
        email: 'david.w@email.com',
        phone: '+1 (555) 234-5678',
        initials: 'DW',
        membership: 'Basic',
        status: 'Active',
        trainer: 'Lisa Park',
        joinDate: 'Feb 20, 2024',
        lastVisit: '1 day ago',
      },
      {
        id: 3,
        name: 'Emma Davis',
        email: 'emma.d@email.com',
        phone: '+1 (555) 345-6789',
        initials: 'ED',
        membership: 'Premium',
        status: 'Active',
        trainer: 'Mike Chen',
        joinDate: 'Mar 10, 2024',
        lastVisit: '3 hours ago',
      },
      {
        id: 4,
        name: 'James Miller',
        email: 'james.m@email.com',
        phone: '+1 (555) 456-7890',
        initials: 'JM',
        membership: 'Standard',
        status: 'Inactive',
        trainer: 'John Smith',
        joinDate: 'Dec 05, 2023',
        lastVisit: '2 weeks ago',
      },
      {
        id: 5,
        name: 'Olivia Brown',
        email: 'olivia.b@email.com',
        phone: '+1 (555) 567-8901',
        initials: 'OB',
        membership: 'Premium',
        status: 'Active',
        trainer: 'Lisa Park',
        joinDate: 'Apr 18, 2024',
        lastVisit: '5 hours ago',
      },
      {
        id: 6,
        name: 'Michael Taylor',
        email: 'michael.t@email.com',
        phone: '+1 (555) 678-9012',
        initials: 'MT',
        membership: 'Basic',
        status: 'Expired',
        trainer: 'Mike Chen',
        joinDate: 'Nov 22, 2023',
        lastVisit: '1 month ago',
      },
      {
        id: 7,
        name: 'Sophia Anderson',
        email: 'sophia.a@email.com',
        phone: '+1 (555) 789-0123',
        initials: 'SA',
        membership: 'Standard',
        status: 'Active',
        trainer: 'John Smith',
        joinDate: 'May 30, 2024',
        lastVisit: '1 day ago',
      },
      {
        id: 8,
        name: 'William Martinez',
        email: 'william.m@email.com',
        phone: '+1 (555) 890-1234',
        initials: 'WM',
        membership: 'Premium',
        status: 'Active',
        trainer: 'Lisa Park',
        joinDate: 'Jun 12, 2024',
        lastVisit: '6 hours ago',
      },
    ];

    let filtered = allClients;
    if (search) {
      const s = search.toLowerCase();
      filtered = allClients.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.includes(s)
      );
    }

    return {
      data: filtered,
      pagination: { page, limit: 10, total: filtered.length, totalPages: 1 },
    };
  },

  async createClient(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: Date.now(), ...data };
  },

  async updateClient(id, data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, ...data };
  },

  async deleteClient(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  async fetchNotifications() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        type: 'client',
        title: 'New Client Registration',
        message: 'Sarah Johnson has registered as a new client',
        time: '2 min ago',
        read: false,
      },
      {
        id: 2,
        type: 'trainer',
        title: 'Trainer Session Complete',
        message: 'Mike Chen completed a session with 3 clients',
        time: '15 min ago',
        read: false,
      },
      {
        id: 3,
        type: 'payment',
        title: 'Payment Received',
        message: '$450 payment from David Wilson',
        time: '1 hour ago',
        read: false,
      },
      {
        id: 4,
        type: 'alert',
        title: 'Membership Expiring',
        message: '5 client memberships expire this week',
        time: '2 hours ago',
        read: true,
      },
      {
        id: 5,
        type: 'client',
        title: 'Client Check-in',
        message: 'Emma Davis checked in for her session',
        time: '3 hours ago',
        read: true,
      },
    ];
  },

  async markNotificationRead(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true, id };
  },

  async markAllNotificationsRead() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },
};

// Query Keys
export const queryKeys = {
  dashboardStats: ['dashboard', 'stats'],
  transactions: (page) => ['transactions', page],
  revenueData: (period) => ['revenue', period],
  activities: ['activities'],
  clients: (page) => ['clients', page],
  notifications: ['notifications'],
};

// Dashboard Stats Hook
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: api.fetchDashboardStats,
  });
}

// Transactions Hook
export function useTransactions(page = 1) {
  return useQuery({
    queryKey: queryKeys.transactions(page),
    queryFn: () => api.fetchTransactions(page),
  });
}

// Revenue Data Hook
export function useRevenueData(period = '1Y') {
  return useQuery({
    queryKey: queryKeys.revenueData(period),
    queryFn: () => api.fetchRevenueData(period),
  });
}

// Activities Hook
export function useActivities() {
  return useQuery({
    queryKey: queryKeys.activities,
    queryFn: api.fetchActivities,
  });
}

// Clients Hooks
export function useClients(page = 1, search = '') {
  return useQuery({
    queryKey: [...queryKeys.clients(page), search],
    queryFn: () => api.fetchClients(page, search),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

// Notifications Hooks
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: api.fetchNotifications,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}
