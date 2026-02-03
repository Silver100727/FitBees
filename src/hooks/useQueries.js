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
      { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', initials: 'SJ', membership: 'Premium', status: 'Active', trainer: 'Mike Chen', joinDate: 'Jan 15, 2024', lastVisit: '2 hours ago' },
      { id: 2, name: 'David Wilson', email: 'david.w@email.com', phone: '+1 (555) 234-5678', initials: 'DW', membership: 'Basic', status: 'Active', trainer: 'Lisa Park', joinDate: 'Feb 20, 2024', lastVisit: '1 day ago' },
      { id: 3, name: 'Emma Davis', email: 'emma.d@email.com', phone: '+1 (555) 345-6789', initials: 'ED', membership: 'Premium', status: 'Active', trainer: 'Mike Chen', joinDate: 'Mar 10, 2024', lastVisit: '3 hours ago' },
      { id: 4, name: 'James Miller', email: 'james.m@email.com', phone: '+1 (555) 456-7890', initials: 'JM', membership: 'Standard', status: 'Inactive', trainer: 'John Smith', joinDate: 'Dec 05, 2023', lastVisit: '2 weeks ago' },
      { id: 5, name: 'Olivia Brown', email: 'olivia.b@email.com', phone: '+1 (555) 567-8901', initials: 'OB', membership: 'Premium', status: 'Active', trainer: 'Lisa Park', joinDate: 'Apr 18, 2024', lastVisit: '5 hours ago' },
      { id: 6, name: 'Michael Taylor', email: 'michael.t@email.com', phone: '+1 (555) 678-9012', initials: 'MT', membership: 'Basic', status: 'Expired', trainer: 'Mike Chen', joinDate: 'Nov 22, 2023', lastVisit: '1 month ago' },
      { id: 7, name: 'Sophia Anderson', email: 'sophia.a@email.com', phone: '+1 (555) 789-0123', initials: 'SA', membership: 'Standard', status: 'Active', trainer: 'John Smith', joinDate: 'May 30, 2024', lastVisit: '1 day ago' },
      { id: 8, name: 'William Martinez', email: 'william.m@email.com', phone: '+1 (555) 890-1234', initials: 'WM', membership: 'Premium', status: 'Active', trainer: 'Lisa Park', joinDate: 'Jun 12, 2024', lastVisit: '6 hours ago' },
      { id: 9, name: 'Isabella Garcia', email: 'isabella.g@email.com', phone: '+1 (555) 901-2345', initials: 'IG', membership: 'Premium', status: 'Active', trainer: 'Mike Chen', joinDate: 'Jul 08, 2024', lastVisit: '1 hour ago' },
      { id: 10, name: 'Benjamin Lee', email: 'benjamin.l@email.com', phone: '+1 (555) 012-3456', initials: 'BL', membership: 'Standard', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Aug 15, 2024', lastVisit: '4 hours ago' },
      { id: 11, name: 'Mia Thompson', email: 'mia.t@email.com', phone: '+1 (555) 111-2222', initials: 'MT', membership: 'Basic', status: 'Active', trainer: 'John Smith', joinDate: 'Sep 01, 2024', lastVisit: '2 days ago' },
      { id: 12, name: 'Ethan White', email: 'ethan.w@email.com', phone: '+1 (555) 222-3333', initials: 'EW', membership: 'Premium', status: 'Active', trainer: 'Lisa Park', joinDate: 'Oct 12, 2024', lastVisit: '30 min ago' },
      { id: 13, name: 'Charlotte Harris', email: 'charlotte.h@email.com', phone: '+1 (555) 333-4444', initials: 'CH', membership: 'Standard', status: 'Inactive', trainer: 'Mike Chen', joinDate: 'Nov 20, 2023', lastVisit: '3 weeks ago' },
      { id: 14, name: 'Alexander Clark', email: 'alexander.c@email.com', phone: '+1 (555) 444-5555', initials: 'AC', membership: 'Premium', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Dec 05, 2024', lastVisit: '1 hour ago' },
      { id: 15, name: 'Amelia Lewis', email: 'amelia.l@email.com', phone: '+1 (555) 555-6666', initials: 'AL', membership: 'Basic', status: 'Expired', trainer: 'John Smith', joinDate: 'Aug 22, 2023', lastVisit: '2 months ago' },
      { id: 16, name: 'Daniel Robinson', email: 'daniel.r@email.com', phone: '+1 (555) 666-7777', initials: 'DR', membership: 'Standard', status: 'Active', trainer: 'Lisa Park', joinDate: 'Jan 28, 2024', lastVisit: '5 hours ago' },
      { id: 17, name: 'Harper Walker', email: 'harper.w@email.com', phone: '+1 (555) 777-8888', initials: 'HW', membership: 'Premium', status: 'Active', trainer: 'Mike Chen', joinDate: 'Feb 14, 2024', lastVisit: '45 min ago' },
      { id: 18, name: 'Matthew Hall', email: 'matthew.h@email.com', phone: '+1 (555) 888-9999', initials: 'MH', membership: 'Basic', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Mar 22, 2024', lastVisit: '1 day ago' },
      { id: 19, name: 'Evelyn Young', email: 'evelyn.y@email.com', phone: '+1 (555) 999-0000', initials: 'EY', membership: 'Premium', status: 'Active', trainer: 'John Smith', joinDate: 'Apr 05, 2024', lastVisit: '2 hours ago' },
      { id: 20, name: 'Joseph King', email: 'joseph.k@email.com', phone: '+1 (555) 101-2020', initials: 'JK', membership: 'Standard', status: 'Inactive', trainer: 'Lisa Park', joinDate: 'May 18, 2024', lastVisit: '1 week ago' },
      { id: 21, name: 'Abigail Wright', email: 'abigail.w@email.com', phone: '+1 (555) 202-3030', initials: 'AW', membership: 'Premium', status: 'Active', trainer: 'Mike Chen', joinDate: 'Jun 30, 2024', lastVisit: '3 hours ago' },
      { id: 22, name: 'Christopher Scott', email: 'chris.s@email.com', phone: '+1 (555) 303-4040', initials: 'CS', membership: 'Basic', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Jul 15, 2024', lastVisit: '6 hours ago' },
      { id: 23, name: 'Emily Green', email: 'emily.g@email.com', phone: '+1 (555) 404-5050', initials: 'EG', membership: 'Standard', status: 'Active', trainer: 'John Smith', joinDate: 'Aug 08, 2024', lastVisit: '1 day ago' },
      { id: 24, name: 'Andrew Adams', email: 'andrew.a@email.com', phone: '+1 (555) 505-6060', initials: 'AA', membership: 'Premium', status: 'Expired', trainer: 'Lisa Park', joinDate: 'Sep 12, 2023', lastVisit: '1 month ago' },
      { id: 25, name: 'Elizabeth Baker', email: 'elizabeth.b@email.com', phone: '+1 (555) 606-7070', initials: 'EB', membership: 'Basic', status: 'Active', trainer: 'Mike Chen', joinDate: 'Oct 25, 2024', lastVisit: '4 hours ago' },
      { id: 26, name: 'Ryan Nelson', email: 'ryan.n@email.com', phone: '+1 (555) 707-8080', initials: 'RN', membership: 'Premium', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Nov 10, 2024', lastVisit: '2 hours ago' },
      { id: 27, name: 'Sofia Carter', email: 'sofia.c@email.com', phone: '+1 (555) 808-9090', initials: 'SC', membership: 'Standard', status: 'Active', trainer: 'John Smith', joinDate: 'Dec 01, 2024', lastVisit: '1 hour ago' },
      { id: 28, name: 'Nicholas Mitchell', email: 'nick.m@email.com', phone: '+1 (555) 909-1010', initials: 'NM', membership: 'Premium', status: 'Inactive', trainer: 'Lisa Park', joinDate: 'Jan 05, 2024', lastVisit: '2 weeks ago' },
      { id: 29, name: 'Avery Perez', email: 'avery.p@email.com', phone: '+1 (555) 121-3131', initials: 'AP', membership: 'Basic', status: 'Active', trainer: 'Mike Chen', joinDate: 'Feb 28, 2024', lastVisit: '5 hours ago' },
      { id: 30, name: 'Joshua Roberts', email: 'joshua.r@email.com', phone: '+1 (555) 131-4141', initials: 'JR', membership: 'Standard', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Mar 15, 2024', lastVisit: '3 hours ago' },
      { id: 31, name: 'Scarlett Turner', email: 'scarlett.t@email.com', phone: '+1 (555) 141-5151', initials: 'ST', membership: 'Premium', status: 'Active', trainer: 'John Smith', joinDate: 'Apr 22, 2024', lastVisit: '1 hour ago' },
      { id: 32, name: 'Tyler Phillips', email: 'tyler.p@email.com', phone: '+1 (555) 151-6161', initials: 'TP', membership: 'Basic', status: 'Expired', trainer: 'Lisa Park', joinDate: 'Jul 10, 2023', lastVisit: '3 months ago' },
      { id: 33, name: 'Grace Campbell', email: 'grace.c@email.com', phone: '+1 (555) 161-7171', initials: 'GC', membership: 'Premium', status: 'Active', trainer: 'Mike Chen', joinDate: 'May 05, 2024', lastVisit: '30 min ago' },
      { id: 34, name: 'Brandon Parker', email: 'brandon.p@email.com', phone: '+1 (555) 171-8181', initials: 'BP', membership: 'Standard', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Jun 18, 2024', lastVisit: '4 hours ago' },
      { id: 35, name: 'Chloe Evans', email: 'chloe.e@email.com', phone: '+1 (555) 181-9191', initials: 'CE', membership: 'Premium', status: 'Active', trainer: 'John Smith', joinDate: 'Jul 28, 2024', lastVisit: '2 hours ago' },
      { id: 36, name: 'Justin Edwards', email: 'justin.e@email.com', phone: '+1 (555) 191-0202', initials: 'JE', membership: 'Basic', status: 'Inactive', trainer: 'Lisa Park', joinDate: 'Aug 12, 2024', lastVisit: '1 week ago' },
      { id: 37, name: 'Lily Collins', email: 'lily.c@email.com', phone: '+1 (555) 202-1313', initials: 'LC', membership: 'Standard', status: 'Active', trainer: 'Mike Chen', joinDate: 'Sep 25, 2024', lastVisit: '6 hours ago' },
      { id: 38, name: 'Aaron Stewart', email: 'aaron.s@email.com', phone: '+1 (555) 212-2424', initials: 'AS', membership: 'Premium', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Oct 08, 2024', lastVisit: '1 hour ago' },
      { id: 39, name: 'Zoey Sanchez', email: 'zoey.s@email.com', phone: '+1 (555) 222-3535', initials: 'ZS', membership: 'Premium', status: 'Active', trainer: 'John Smith', joinDate: 'Nov 15, 2024', lastVisit: '45 min ago' },
      { id: 40, name: 'Dylan Morris', email: 'dylan.m@email.com', phone: '+1 (555) 232-4646', initials: 'DM', membership: 'Basic', status: 'Active', trainer: 'Lisa Park', joinDate: 'Dec 10, 2024', lastVisit: '3 hours ago' },
      { id: 41, name: 'Natalie Rogers', email: 'natalie.r@email.com', phone: '+1 (555) 242-5757', initials: 'NR', membership: 'Standard', status: 'Expired', trainer: 'Mike Chen', joinDate: 'Jun 05, 2023', lastVisit: '2 months ago' },
      { id: 42, name: 'Kevin Reed', email: 'kevin.r@email.com', phone: '+1 (555) 252-6868', initials: 'KR', membership: 'Premium', status: 'Active', trainer: 'Sarah Kim', joinDate: 'Jan 20, 2024', lastVisit: '2 hours ago' },
      { id: 43, name: 'Hannah Cook', email: 'hannah.c@email.com', phone: '+1 (555) 262-7979', initials: 'HC', membership: 'Premium', status: 'Active', trainer: 'John Smith', joinDate: 'Feb 08, 2024', lastVisit: '1 hour ago' },
      { id: 44, name: 'Jason Morgan', email: 'jason.m@email.com', phone: '+1 (555) 272-8080', initials: 'JM', membership: 'Basic', status: 'Inactive', trainer: 'Lisa Park', joinDate: 'Mar 28, 2024', lastVisit: '10 days ago' },
      { id: 45, name: 'Victoria Bell', email: 'victoria.b@email.com', phone: '+1 (555) 282-9191', initials: 'VB', membership: 'Standard', status: 'Active', trainer: 'Mike Chen', joinDate: 'Apr 15, 2024', lastVisit: '5 hours ago' },
      { id: 46, name: 'Sean Murphy', email: 'sean.m@email.com', phone: '+1 (555) 292-0202', initials: 'SM', membership: 'Premium', status: 'Active', trainer: 'Sarah Kim', joinDate: 'May 22, 2024', lastVisit: '30 min ago' },
      { id: 47, name: 'Audrey Bailey', email: 'audrey.b@email.com', phone: '+1 (555) 302-1313', initials: 'AB', membership: 'Premium', status: 'Active', trainer: 'John Smith', joinDate: 'Jun 08, 2024', lastVisit: '2 hours ago' },
      { id: 48, name: 'Eric Rivera', email: 'eric.r@email.com', phone: '+1 (555) 312-2424', initials: 'ER', membership: 'Basic', status: 'Active', trainer: 'Lisa Park', joinDate: 'Jul 20, 2024', lastVisit: '4 hours ago' },
      { id: 49, name: 'Leah Cooper', email: 'leah.c@email.com', phone: '+1 (555) 322-3535', initials: 'LC', membership: 'Standard', status: 'Active', trainer: 'Mike Chen', joinDate: 'Aug 30, 2024', lastVisit: '1 day ago' },
      { id: 50, name: 'Patrick Richardson', email: 'patrick.r@email.com', phone: '+1 (555) 332-4646', initials: 'PR', membership: 'Premium', status: 'Inactive', trainer: 'Sarah Kim', joinDate: 'Sep 15, 2024', lastVisit: '5 days ago' },
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
    mutationFn: (data) => api.updateClient(data.id, data),
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
