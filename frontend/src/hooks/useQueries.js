import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  dashboardAPI,
  clientsAPI,
  trainersAPI,
  paymentsAPI,
  notificationsAPI,
  analyticsAPI,
} from '../services/api';

// Query Keys
export const queryKeys = {
  dashboardStats: ['dashboard', 'stats'],
  dashboardRevenue: ['dashboard', 'revenue'],
  weeklySales: ['dashboard', 'weekly-sales'],
  activities: ['activities'],
  clients: (params) => ['clients', params],
  client: (id) => ['client', id],
  clientAttendance: (id) => ['client', id, 'attendance'],
  clientProgress: (id) => ['client', id, 'progress'],
  clientPayments: (id) => ['client', id, 'payments'],
  trainers: (params) => ['trainers', params],
  trainer: (id) => ['trainer', id],
  trainerStats: ['trainers', 'stats'],
  trainerClients: (id) => ['trainer', id, 'clients'],
  trainerSchedule: (id) => ['trainer', id, 'schedule'],
  payments: (params) => ['payments', params],
  payment: (id) => ['payment', id],
  paymentStats: ['payments', 'stats'],
  notifications: ['notifications'],
  unreadCount: ['notifications', 'unread-count'],
  analytics: {
    sales: (period) => ['analytics', 'sales', period],
    revenueByType: ['analytics', 'revenue-by-type'],
    membershipDistribution: ['analytics', 'membership-distribution'],
    clientGrowth: ['analytics', 'client-growth'],
    trainerPerformance: ['analytics', 'trainer-performance'],
    trafficSources: ['analytics', 'traffic-sources'],
  },
};

// ============ DASHBOARD HOOKS ============
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getStats();
        const data = response.data.data;
        // Transform to frontend format
        return {
          totalClients: data.totalClients.value.toLocaleString(),
          activeClients: data.activeClients.value.toLocaleString(),
          totalTrainers: data.totalTrainers.value.toLocaleString(),
          activeTrainers: data.activeTrainers.value.toLocaleString(),
          totalClientsChange: `${data.totalClients.change >= 0 ? '+' : ''}${data.totalClients.change.toFixed(1)}%`,
          activeClientsChange: `${data.activeClients.change >= 0 ? '+' : ''}${data.activeClients.change.toFixed(1)}%`,
          totalTrainersChange: `${data.totalTrainers.change >= 0 ? '+' : ''}${data.totalTrainers.change.toFixed(1)}%`,
          activeTrainersChange: `${data.activeTrainers.change >= 0 ? '+' : ''}${data.activeTrainers.change.toFixed(1)}%`,
        };
      } catch (error) {
        console.error('Dashboard stats error:', error);
        throw error;
      }
    },
  });
}

export function useDashboardRevenue() {
  return useQuery({
    queryKey: queryKeys.dashboardRevenue,
    queryFn: async () => {
      const response = await dashboardAPI.getRevenue();
      return response.data.data;
    },
  });
}

export function useWeeklySales() {
  return useQuery({
    queryKey: queryKeys.weeklySales,
    queryFn: async () => {
      const response = await dashboardAPI.getWeeklySales();
      return response.data.data;
    },
  });
}

export function useActivities(limit = 10) {
  return useQuery({
    queryKey: queryKeys.activities,
    queryFn: async () => {
      const response = await dashboardAPI.getActivities(limit);
      return response.data.data.map((activity) => ({
        id: activity._id,
        type: activity.type.includes('payment') ? 'sale' : activity.type.includes('client') ? 'user' : 'alert',
        text: activity.description,
        time: formatTimeAgo(activity.createdAt),
      }));
    },
  });
}

// ============ CLIENTS HOOKS ============
export function useClients(page = 1, search = '', filters = {}) {
  return useQuery({
    queryKey: queryKeys.clients({ page, search, ...filters }),
    queryFn: async () => {
      const response = await clientsAPI.getAll({
        page,
        limit: 10,
        search,
        ...filters,
      });
      const { data, pagination } = response.data;
      return {
        data: data.map(transformClient),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.pages,
        },
      };
    },
  });
}

export function useClient(id) {
  return useQuery({
    queryKey: queryKeys.client(id),
    queryFn: async () => {
      const response = await clientsAPI.getById(id);
      return transformClient(response.data.data);
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await clientsAPI.create(transformClientToAPI(data));
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await clientsAPI.update(id, transformClientToAPI(data));
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.client(variables.id) });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await clientsAPI.delete(id);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useClientAttendance(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.clientAttendance(id),
    queryFn: async () => {
      const response = await clientsAPI.getAttendance(id, params);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useClientProgress(id) {
  return useQuery({
    queryKey: queryKeys.clientProgress(id),
    queryFn: async () => {
      const response = await clientsAPI.getProgress(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useClientPayments(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.clientPayments(id),
    queryFn: async () => {
      const response = await clientsAPI.getPayments(id, params);
      return response.data;
    },
    enabled: !!id,
  });
}

// ============ TRAINERS HOOKS ============
export function useTrainers(params = {}) {
  return useQuery({
    queryKey: queryKeys.trainers(params),
    queryFn: async () => {
      const response = await trainersAPI.getAll(params);
      const { data, pagination } = response.data;
      return {
        data: data.map(transformTrainer),
        pagination,
      };
    },
  });
}

export function useTrainer(id) {
  return useQuery({
    queryKey: queryKeys.trainer(id),
    queryFn: async () => {
      const response = await trainersAPI.getById(id);
      return transformTrainer(response.data.data);
    },
    enabled: !!id,
  });
}

export function useTrainerStats() {
  return useQuery({
    queryKey: queryKeys.trainerStats,
    queryFn: async () => {
      const response = await trainersAPI.getStats();
      return response.data.data;
    },
  });
}

export function useCreateTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await trainersAPI.create(transformTrainerToAPI(data));
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trainerStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdateTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await trainersAPI.update(id, transformTrainerToAPI(data));
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trainer(variables.id) });
    },
  });
}

export function useDeleteTrainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await trainersAPI.delete(id);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trainerStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useTrainerClients(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.trainerClients(id),
    queryFn: async () => {
      const response = await trainersAPI.getClients(id, params);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useTrainerSchedule(id, params = {}) {
  return useQuery({
    queryKey: queryKeys.trainerSchedule(id),
    queryFn: async () => {
      const response = await trainersAPI.getSchedule(id, params);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useProcessSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await trainersAPI.processSalary(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trainer(variables.id) });
    },
  });
}

export function useUpdateTrainerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await trainersAPI.updateStatus(id, status);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trainerStats });
    },
  });
}

// ============ PAYMENTS HOOKS ============
export function usePayments(params = {}) {
  return useQuery({
    queryKey: queryKeys.payments(params),
    queryFn: async () => {
      const response = await paymentsAPI.getAll(params);
      const { data, pagination } = response.data;
      return {
        data: data.map(transformPayment),
        pagination,
      };
    },
  });
}

export function usePayment(id) {
  return useQuery({
    queryKey: queryKeys.payment(id),
    queryFn: async () => {
      const response = await paymentsAPI.getById(id);
      return transformPayment(response.data.data);
    },
    enabled: !!id,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: queryKeys.paymentStats,
    queryFn: async () => {
      const response = await paymentsAPI.getStats();
      return response.data.data;
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await paymentsAPI.create(transformPaymentToAPI(data));
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardRevenue });
    },
  });
}

export function useProcessRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason, amount }) => {
      const response = await paymentsAPI.processRefund(id, { reason, amount });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentStats });
    },
  });
}

export function useSendReceipt() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await paymentsAPI.sendReceipt(id);
      return response.data;
    },
  });
}

// ============ NOTIFICATIONS HOOKS ============
export function useNotifications(params = {}) {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      const response = await notificationsAPI.getAll(params);
      const { data, unreadCount } = response.data;
      return {
        notifications: data.map((n) => ({
          id: n._id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: formatTimeAgo(n.createdAt),
          read: n.isRead,
        })),
        unreadCount,
      };
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: async () => {
      const response = await notificationsAPI.getUnreadCount();
      return response.data.data.count;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await notificationsAPI.markAsRead(id);
      return { success: true, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await notificationsAPI.markAllAsRead();
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}

// ============ ANALYTICS HOOKS ============
export function useAnalyticsSales(period = 'week') {
  return useQuery({
    queryKey: queryKeys.analytics.sales(period),
    queryFn: async () => {
      const response = await analyticsAPI.getWeeklySales(period);
      return response.data.data;
    },
  });
}

export function useRevenueByType() {
  return useQuery({
    queryKey: queryKeys.analytics.revenueByType,
    queryFn: async () => {
      const response = await analyticsAPI.getRevenueByType();
      return response.data.data;
    },
  });
}

export function useMembershipDistribution() {
  return useQuery({
    queryKey: queryKeys.analytics.membershipDistribution,
    queryFn: async () => {
      const response = await analyticsAPI.getMembershipDistribution();
      return response.data.data;
    },
  });
}

export function useClientGrowth() {
  return useQuery({
    queryKey: queryKeys.analytics.clientGrowth,
    queryFn: async () => {
      const response = await analyticsAPI.getClientGrowth();
      return response.data.data;
    },
  });
}

export function useTrainerPerformance() {
  return useQuery({
    queryKey: queryKeys.analytics.trainerPerformance,
    queryFn: async () => {
      const response = await analyticsAPI.getTrainerPerformance();
      return response.data.data;
    },
  });
}

export function useTrafficSources() {
  return useQuery({
    queryKey: queryKeys.analytics.trafficSources,
    queryFn: async () => {
      const response = await analyticsAPI.getTrafficSources();
      return response.data.data;
    },
  });
}

// Legacy hooks for backwards compatibility with existing revenue data usage
export function useTransactions(page = 1) {
  return usePayments({ page, limit: 10 });
}

export function useRevenueData(period = '1Y') {
  return useAnalyticsSales(period === '1Y' ? 'year' : period === '1M' ? 'month' : 'week');
}

// ============ HELPER FUNCTIONS ============

// Transform client from API to frontend format
function transformClient(client) {
  return {
    id: client._id,
    name: client.fullName || `${client.firstName} ${client.lastName}`,
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    phone: client.phone,
    initials: client.initials,
    membership: capitalizeFirst(client.membershipType),
    membershipType: client.membershipType,
    status: capitalizeFirst(client.status),
    statusLower: client.status,
    trainer: client.assignedTrainer
      ? `${client.assignedTrainer.firstName} ${client.assignedTrainer.lastName}`
      : 'Unassigned',
    trainerId: client.assignedTrainer?._id,
    joinDate: formatDate(client.membershipStartDate),
    lastVisit: client.lastVisit ? formatTimeAgo(client.lastVisit) : 'Never',
    dateOfBirth: client.dateOfBirth,
    gender: client.gender,
    address: client.address,
    fitnessGoal: client.fitnessGoal,
    currentWeight: client.currentWeight,
    targetWeight: client.targetWeight,
    height: client.height,
    fitnessLevel: client.fitnessLevel,
    membershipStartDate: client.membershipStartDate,
    membershipEndDate: client.membershipEndDate,
    emergencyContact: client.emergencyContact,
    medicalNotes: client.medicalNotes,
    notes: client.notes,
  };
}

// Transform client from frontend to API format
function transformClientToAPI(data) {
  // Handle name field - split into firstName and lastName if needed
  let firstName = data.firstName;
  let lastName = data.lastName;

  if (!firstName && !lastName && data.name) {
    const nameParts = data.name.trim().split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
  }

  // Handle membership dates - form uses membershipStart/End, API expects membershipStartDate/EndDate
  let membershipStartDate = data.membershipStartDate || data.membershipStart;
  let membershipEndDate = data.membershipEndDate || data.membershipEnd;

  // Ensure dates are proper Date objects or ISO strings
  if (membershipStartDate && !(membershipStartDate instanceof Date)) {
    membershipStartDate = new Date(membershipStartDate).toISOString();
  }
  if (membershipEndDate && !(membershipEndDate instanceof Date)) {
    membershipEndDate = new Date(membershipEndDate).toISOString();
  }

  // Handle dateOfBirth
  let dateOfBirth = data.dateOfBirth;
  if (dateOfBirth && !(dateOfBirth instanceof Date)) {
    dateOfBirth = new Date(dateOfBirth).toISOString();
  }

  // Handle emergency contact - form uses separate fields
  let emergencyContact = data.emergencyContact;
  if (!emergencyContact && (data.emergencyName || data.emergencyPhone)) {
    emergencyContact = {
      name: data.emergencyName || '',
      phone: data.emergencyPhone || '',
      relationship: 'Emergency Contact',
    };
  }

  // Handle address - convert string to object if needed
  let address = data.address;
  if (typeof address === 'string' && address.trim()) {
    address = { street: address, city: '', state: '', zipCode: '', country: 'USA' };
  }

  // Map fitness goal from display name to enum value
  const goalMap = {
    'Weight Loss': 'weight_loss',
    'Muscle Gain': 'muscle_gain',
    'Endurance': 'endurance',
    'Flexibility': 'flexibility',
    'General Fitness': 'general_fitness',
    'Sports Training': 'sports_training',
  };

  const fitnessGoal = data.fitnessGoal || goalMap[data.goal] || data.goal?.toLowerCase().replace(/\s+/g, '_') || 'general_fitness';

  // Map gender
  const genderMap = {
    'Male': 'male',
    'Female': 'female',
    'Other': 'other',
  };
  const gender = genderMap[data.gender] || data.gender?.toLowerCase() || 'other';

  return {
    firstName,
    lastName,
    email: data.email,
    phone: data.phone,
    dateOfBirth,
    gender,
    address,
    fitnessGoal,
    currentWeight: data.currentWeight || data.weight ? parseFloat(data.currentWeight || data.weight) : undefined,
    targetWeight: data.targetWeight ? parseFloat(data.targetWeight) : undefined,
    height: data.height ? parseFloat(data.height) : undefined,
    fitnessLevel: data.fitnessLevel || 'beginner',
    membershipType: data.membershipType?.toLowerCase() || data.membership?.toLowerCase(),
    membershipStartDate,
    membershipEndDate,
    assignedTrainer: data.trainerId || data.assignedTrainer || data.trainer || null,
    emergencyContact,
    medicalNotes: data.medicalNotes,
    notes: data.notes,
    status: data.status?.toLowerCase() || 'active',
  };
}

// Transform trainer from API to frontend format
function transformTrainer(trainer) {
  return {
    id: trainer._id,
    name: trainer.fullName || `${trainer.firstName} ${trainer.lastName}`,
    firstName: trainer.firstName,
    lastName: trainer.lastName,
    email: trainer.email,
    phone: trainer.phone,
    initials: trainer.initials,
    avatar: trainer.avatar,
    role: formatRole(trainer.role),
    roleLower: trainer.role,
    specialties: trainer.specialties || [],
    certifications: trainer.certifications || [],
    yearsOfExperience: trainer.yearsOfExperience,
    bio: trainer.bio,
    status: formatTrainerStatus(trainer.status),
    statusLower: trainer.status,
    rating: trainer.rating,
    totalRatings: trainer.totalRatings,
    totalClients: trainer.totalClients || trainer.assignedClientsCount || 0,
    sessionsThisWeek: trainer.sessionsThisWeek,
    totalSessions: trainer.totalSessions,
    salary: trainer.salary,
    workingHours: trainer.workingHours,
    joiningDate: formatDate(trainer.joiningDate),
  };
}

// Transform trainer from frontend to API format
function transformTrainerToAPI(data) {
  // Map frontend role names to backend enum values
  const roleMap = {
    'Junior Trainer': 'junior_trainer',
    'Personal Trainer': 'trainer',
    'Senior Trainer': 'senior_trainer',
    'Lead Trainer': 'head_trainer',
    'Head Trainer': 'head_trainer',
  };

  // Map frontend specialty names to backend enum values
  const specialtyMap = {
    'Strength Training': 'weight_training',
    'HIIT': 'cardio',
    'Yoga': 'yoga',
    'Pilates': 'pilates',
    'Boxing': 'boxing',
    'Cardio': 'cardio',
    'Nutrition': 'nutrition',
    'Weight Loss': 'weight_training',
    'CrossFit': 'crossfit',
    'Functional': 'personal_training',
    'Dance Fitness': 'group_classes',
    'Aerobics': 'group_classes',
    'Bodybuilding': 'weight_training',
    'Competition Prep': 'personal_training',
    'Rehabilitation': 'rehabilitation',
    'Senior Fitness': 'senior_fitness',
  };

  // Map frontend status to backend enum values
  const statusMap = {
    'Available': 'available',
    'In Session': 'in_session',
    'Off Duty': 'off_duty',
    'On Leave': 'on_leave',
  };

  // Transform specialties array
  const transformedSpecialties = data.specialties?.map(s =>
    specialtyMap[s] || s.toLowerCase().replace(/\s+/g, '_')
  ) || [];

  // Transform certifications - backend expects array of objects
  const transformedCertifications = data.certifications?.map(cert => {
    if (typeof cert === 'string') {
      return { name: cert, issuedBy: 'Unknown', issuedDate: new Date() };
    }
    return cert;
  }).filter(c => c.name) || [];

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender?.toLowerCase(),
    address: data.address,
    role: roleMap[data.role] || data.role?.toLowerCase().replace(/\s+/g, '_') || data.roleLower || 'trainer',
    specialties: transformedSpecialties,
    certifications: transformedCertifications,
    yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : 0,
    bio: data.bio,
    employmentType: data.employmentType,
    salary: data.salary,
    status: statusMap[data.status] || data.status?.toLowerCase().replace(/\s+/g, '_') || data.statusLower || 'available',
  };
}

// Transform payment from API to frontend format
function transformPayment(payment) {
  const statusMap = {
    completed: { label: 'Completed', type: 'success' },
    pending: { label: 'Pending', type: 'warning' },
    failed: { label: 'Failed', type: 'error' },
    refunded: { label: 'Refunded', type: 'info' },
    cancelled: { label: 'Cancelled', type: 'error' },
  };
  const status = statusMap[payment.status] || { label: payment.status, type: 'info' };

  return {
    id: payment._id,
    invoiceNumber: payment.invoiceNumber,
    name: payment.client
      ? `${payment.client.firstName} ${payment.client.lastName}`
      : 'Unknown Client',
    email: payment.client?.email,
    initials: payment.client
      ? `${payment.client.firstName[0]}${payment.client.lastName[0]}`
      : '??',
    clientId: payment.client?._id,
    amount: `$${payment.amount.toLocaleString()}`,
    amountRaw: payment.amount,
    status: status.label,
    statusType: status.type,
    statusLower: payment.status,
    paymentType: capitalizeFirst(payment.paymentType?.replace('_', ' ')),
    paymentTypeLower: payment.paymentType,
    paymentMethod: capitalizeFirst(payment.paymentMethod?.replace('_', ' ')),
    paymentMethodLower: payment.paymentMethod,
    date: formatDate(payment.transactionDate),
    planDetails: payment.planDetails,
    description: payment.description,
    receiptSent: payment.receiptSent,
  };
}

// Transform payment from frontend to API format
function transformPaymentToAPI(data) {
  return {
    client: data.clientId || data.client,
    amount: parseFloat(data.amount),
    paymentType: data.paymentType?.toLowerCase().replace(' ', '_'),
    paymentMethod: data.paymentMethod?.toLowerCase().replace(' ', '_'),
    status: data.status?.toLowerCase() || 'completed',
    planDetails: data.planDetails,
    description: data.description,
    transactionDate: data.transactionDate || new Date().toISOString(),
  };
}

// Format date helper
function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time ago helper
function formatTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

// Capitalize first letter
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format trainer role
function formatRole(role) {
  if (!role) return '';
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format trainer status
function formatTrainerStatus(status) {
  const statusMap = {
    available: 'Available',
    in_session: 'In Session',
    off_duty: 'Off Duty',
    on_leave: 'On Leave',
    terminated: 'Terminated',
  };
  return statusMap[status] || status;
}
