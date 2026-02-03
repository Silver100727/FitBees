import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Star,
  Users,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  MoreVertical,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Grid3X3,
  List,
  Dumbbell,
  Heart,
  Zap,
  Target,
} from 'lucide-react';
import {
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
} from '@/components/ui';
import AddTrainerModal from '../components/AddTrainerModal';

// Mock trainer data
const trainersData = [
  {
    id: 1,
    name: 'Mike Chen',
    email: 'mike.chen@fitbees.com',
    phone: '+1 (555) 100-1001',
    initials: 'MC',
    role: 'Senior Trainer',
    specialty: ['Strength Training', 'HIIT'],
    status: 'Available',
    rating: 4.9,
    totalClients: 28,
    sessionsThisWeek: 24,
    yearsExp: 8,
    certifications: ['NASM', 'ACE', 'CrossFit L2'],
    bio: 'Specializing in strength training and high-intensity workouts.',
    color: '#F59E0B',
  },
  {
    id: 2,
    name: 'Lisa Park',
    email: 'lisa.park@fitbees.com',
    phone: '+1 (555) 100-1002',
    initials: 'LP',
    role: 'Lead Trainer',
    specialty: ['Yoga', 'Pilates'],
    status: 'In Session',
    rating: 4.8,
    totalClients: 32,
    sessionsThisWeek: 28,
    yearsExp: 6,
    certifications: ['RYT-500', 'PMA-CPT'],
    bio: 'Bringing mindfulness and flexibility to every session.',
    color: '#EC4899',
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@fitbees.com',
    phone: '+1 (555) 100-1003',
    initials: 'JS',
    role: 'Personal Trainer',
    specialty: ['Boxing', 'Cardio'],
    status: 'Available',
    rating: 4.7,
    totalClients: 22,
    sessionsThisWeek: 18,
    yearsExp: 5,
    certifications: ['ISSA', 'Boxing Coach'],
    bio: 'Former amateur boxer bringing combat sports to fitness.',
    color: '#3B82F6',
  },
  {
    id: 4,
    name: 'Sarah Kim',
    email: 'sarah.kim@fitbees.com',
    phone: '+1 (555) 100-1004',
    initials: 'SK',
    role: 'Senior Trainer',
    specialty: ['Nutrition', 'Weight Loss'],
    status: 'Off Duty',
    rating: 4.9,
    totalClients: 35,
    sessionsThisWeek: 22,
    yearsExp: 7,
    certifications: ['NASM', 'Precision Nutrition'],
    bio: 'Holistic approach combining training with nutrition coaching.',
    color: '#10B981',
  },
  {
    id: 5,
    name: 'Alex Rivera',
    email: 'alex.rivera@fitbees.com',
    phone: '+1 (555) 100-1005',
    initials: 'AR',
    role: 'Personal Trainer',
    specialty: ['CrossFit', 'Functional'],
    status: 'Available',
    rating: 4.6,
    totalClients: 18,
    sessionsThisWeek: 20,
    yearsExp: 4,
    certifications: ['CrossFit L1', 'FMS'],
    bio: 'Functional fitness enthusiast focused on real-world strength.',
    color: '#8B5CF6',
  },
  {
    id: 6,
    name: 'Emma Wilson',
    email: 'emma.wilson@fitbees.com',
    phone: '+1 (555) 100-1006',
    initials: 'EW',
    role: 'Junior Trainer',
    specialty: ['Dance Fitness', 'Aerobics'],
    status: 'In Session',
    rating: 4.5,
    totalClients: 15,
    sessionsThisWeek: 16,
    yearsExp: 2,
    certifications: ['ACE', 'Zumba'],
    bio: 'Making fitness fun through dance and movement.',
    color: '#F472B6',
  },
  {
    id: 7,
    name: 'David Thompson',
    email: 'david.t@fitbees.com',
    phone: '+1 (555) 100-1007',
    initials: 'DT',
    role: 'Senior Trainer',
    specialty: ['Bodybuilding', 'Competition Prep'],
    status: 'Available',
    rating: 4.8,
    totalClients: 20,
    sessionsThisWeek: 15,
    yearsExp: 10,
    certifications: ['IFBB Pro', 'NASM'],
    bio: 'Competition prep specialist with pro bodybuilding background.',
    color: '#EF4444',
  },
  {
    id: 8,
    name: 'Nina Patel',
    email: 'nina.patel@fitbees.com',
    phone: '+1 (555) 100-1008',
    initials: 'NP',
    role: 'Lead Trainer',
    specialty: ['Rehabilitation', 'Senior Fitness'],
    status: 'Available',
    rating: 4.9,
    totalClients: 25,
    sessionsThisWeek: 20,
    yearsExp: 9,
    certifications: ['ACSM', 'Senior Fitness Specialist'],
    bio: 'Specialized in rehabilitation and adaptive fitness programs.',
    color: '#06B6D4',
  },
];

const statusColors = {
  'Available': { bg: 'var(--color-success)', text: 'var(--color-success)' },
  'In Session': { bg: 'var(--color-warning)', text: 'var(--color-warning)' },
  'Off Duty': { bg: 'var(--color-text-muted)', text: 'var(--color-text-muted)' },
};

const specialtyIcons = {
  'Strength Training': Dumbbell,
  'HIIT': Zap,
  'Yoga': Heart,
  'Pilates': Heart,
  'Boxing': Target,
  'Cardio': TrendingUp,
  'Nutrition': Heart,
  'Weight Loss': TrendingUp,
  'CrossFit': Zap,
  'Functional': Target,
  'Dance Fitness': Heart,
  'Aerobics': Zap,
  'Bodybuilding': Dumbbell,
  'Competition Prep': Award,
  'Rehabilitation': Heart,
  'Senior Fitness': Users,
};

function TrainerCard({ trainer, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Top Accent Bar */}
      <div
        className="h-1 w-full"
        style={{ background: trainer.color }}
      />

      {/* Status Indicator */}
      <div
        className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full text-[0.6rem] font-medium uppercase tracking-wider"
        style={{
          background: `${statusColors[trainer.status].bg}15`,
          color: statusColors[trainer.status].text,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: statusColors[trainer.status].bg }}
        />
        {trainer.status}
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarFallback
                className="text-lg font-semibold"
                style={{
                  background: `${trainer.color}20`,
                  color: trainer.color,
                }}
              >
                {trainer.initials}
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold"
              style={{
                background: 'var(--color-bg-secondary)',
                border: `2px solid ${trainer.color}`,
                color: trainer.color,
              }}
            >
              {trainer.yearsExp}y
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {trainer.name}
            </h3>
            <p className="text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {trainer.role}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={10} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {trainer.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trainer.specialty.map((spec) => {
            const Icon = specialtyIcons[spec] || Dumbbell;
            return (
              <span
                key={spec}
                className="inline-flex items-center gap-1 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-wider"
                style={{
                  background: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <Icon size={8} />
                {spec}
              </span>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-3 gap-2 p-2 mb-4"
          style={{ background: 'var(--color-bg-tertiary)' }}
        >
          <div className="text-center">
            <div className="text-base font-semibold" style={{ color: trainer.color }}>
              {trainer.totalClients}
            </div>
            <div className="text-[0.55rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Clients
            </div>
          </div>
          <div className="text-center border-x" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="text-base font-semibold" style={{ color: trainer.color }}>
              {trainer.sessionsThisWeek}
            </div>
            <div className="text-[0.55rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Sessions
            </div>
          </div>
          <div className="text-center">
            <div className="text-base font-semibold" style={{ color: trainer.color }}>
              {trainer.certifications.length}
            </div>
            <div className="text-[0.55rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Certs
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[0.7rem] leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
          {trainer.bio}
        </p>

        {/* Certifications */}
        <div className="flex flex-wrap gap-1 mb-4">
          {trainer.certifications.map((cert) => (
            <span
              key={cert}
              className="px-1.5 py-0.5 text-[0.55rem] font-medium"
              style={{
                background: `${trainer.color}15`,
                color: trainer.color,
              }}
            >
              {cert}
            </span>
          ))}
        </div>

        {/* Contact & Actions */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 transition-colors hover:bg-bg-tertiary rounded"
              style={{ color: 'var(--color-text-muted)' }}
              title={trainer.email}
            >
              <Mail size={14} />
            </button>
            <button
              className="p-1.5 transition-colors hover:bg-bg-tertiary rounded"
              style={{ color: 'var(--color-text-muted)' }}
              title={trainer.phone}
            >
              <Phone size={14} />
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <MoreVertical size={14} />
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
                <Calendar size={12} />
                View Schedule
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                <Edit2 size={12} />
                Edit Trainer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-xs cursor-pointer"
                style={{ color: 'var(--color-error)' }}
              >
                <Trash2 size={12} />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${trainer.color}05 0%, transparent 50%)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color, subValue }) {
  return (
    <div
      className="p-3 flex items-center gap-3"
      style={{
        background: 'var(--color-bg-secondary)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div
        className="h-10 w-10 flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {value}
        </div>
        <div className="text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </div>
      </div>
      {subValue && (
        <div className="ml-auto text-xs font-medium" style={{ color }}>
          {subValue}
        </div>
      )}
    </div>
  );
}

export default function Staff() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredTrainers = useMemo(() => {
    return trainersData.filter((trainer) => {
      const matchesSearch =
        trainer.name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.specialty.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || trainer.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  const stats = useMemo(() => ({
    total: trainersData.length,
    available: trainersData.filter(t => t.status === 'Available').length,
    inSession: trainersData.filter(t => t.status === 'In Session').length,
    totalClients: trainersData.reduce((acc, t) => acc + t.totalClients, 0),
    avgRating: (trainersData.reduce((acc, t) => acc + t.rating, 0) / trainersData.length).toFixed(1),
  }), []);

  return (
    <motion.div
      className="p-4 h-[calc(100vh-41px)] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Staff & Trainers
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Manage your fitness team
          </p>
        </div>
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
          Add Trainer
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        <StatCard
          icon={Users}
          label="Total Trainers"
          value={stats.total}
          color="var(--color-accent)"
        />
        <StatCard
          icon={Clock}
          label="Available Now"
          value={stats.available}
          color="var(--color-success)"
        />
        <StatCard
          icon={Calendar}
          label="In Session"
          value={stats.inSession}
          color="var(--color-warning)"
        />
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          color="var(--color-info)"
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={stats.avgRating}
          color="var(--color-warning)"
          subValue="★"
        />
      </div>

      {/* Filters Bar */}
      <div
        className="flex items-center justify-between gap-4 mb-4 p-3"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
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
            placeholder="Search trainers or specialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {['all', 'Available', 'In Session', 'Off Duty'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors"
              style={{
                background: filterStatus === status ? 'var(--color-accent)' : 'transparent',
                color: filterStatus === status ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              }}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1" style={{ background: 'var(--color-bg-tertiary)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="p-1.5 transition-colors"
            style={{
              background: viewMode === 'grid' ? 'var(--color-bg-secondary)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="p-1.5 transition-colors"
            style={{
              background: viewMode === 'list' ? 'var(--color-bg-secondary)' : 'transparent',
              color: viewMode === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
        {filteredTrainers.map((trainer, index) => (
          <TrainerCard key={trainer.id} trainer={trainer} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTrainers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Users size={40} style={{ color: 'var(--color-text-muted)' }} />
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No trainers found matching your criteria.
          </p>
        </div>
      )}

      {/* Add Trainer Modal */}
      <AddTrainerModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </motion.div>
  );
}
