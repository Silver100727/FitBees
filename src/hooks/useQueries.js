import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API functions - replace with actual API calls
const api = {
  async fetchDashboardStats() {
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalRevenue: '$84,254',
      totalCustomers: '2,345',
      totalOrders: '1,247',
      conversionRate: '18.2%',
      revenueChange: '+12.5%',
      customersChange: '+8.2%',
      ordersChange: '+23.1%',
      conversionChange: '-2.4%',
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

  async fetchClients() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0 },
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
};

// Query Keys
export const queryKeys = {
  dashboardStats: ['dashboard', 'stats'],
  transactions: (page) => ['transactions', page],
  revenueData: (period) => ['revenue', period],
  activities: ['activities'],
  clients: (page) => ['clients', page],
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
export function useClients(page = 1) {
  return useQuery({
    queryKey: queryKeys.clients(page),
    queryFn: () => api.fetchClients(page),
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
