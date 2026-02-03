import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Trainer from '../models/Trainer.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitbees');

// Sample data
const users = [
  {
    name: 'Samuel Dass',
    email: 'samsamueldass@gmail.com',
    password: 'password123',
    role: 'admin',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
  },
  {
    name: 'Sylvester MSC',
    email: 'sylvestermsc@gmail.com',
    password: 'password123',
    role: 'admin',
    phone: '+1 234 567 8901',
    location: 'New York, USA',
  },
];

const trainers = [
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@fitbees.com',
    phone: '+1 555 0101',
    gender: 'male',
    role: 'senior_trainer',
    specialties: ['weight_training', 'cardio', 'personal_training'],
    yearsOfExperience: 8,
    rating: 4.8,
    totalRatings: 156,
    status: 'available',
    bio: 'Certified personal trainer with 8 years of experience in strength training and body transformation.',
    salary: { amount: 5000, currency: 'USD', payFrequency: 'monthly' },
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@fitbees.com',
    phone: '+1 555 0102',
    gender: 'female',
    role: 'trainer',
    specialties: ['yoga', 'pilates', 'group_classes'],
    yearsOfExperience: 5,
    rating: 4.9,
    totalRatings: 98,
    status: 'available',
    bio: 'Yoga and Pilates instructor focused on mind-body wellness and flexibility.',
    salary: { amount: 4000, currency: 'USD', payFrequency: 'monthly' },
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@fitbees.com',
    phone: '+1 555 0103',
    gender: 'male',
    role: 'head_trainer',
    specialties: ['crossfit', 'weight_training', 'nutrition'],
    yearsOfExperience: 12,
    rating: 4.7,
    totalRatings: 234,
    status: 'in_session',
    bio: 'Head trainer specializing in CrossFit and nutrition coaching.',
    salary: { amount: 7000, currency: 'USD', payFrequency: 'monthly' },
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@fitbees.com',
    phone: '+1 555 0104',
    gender: 'female',
    role: 'trainer',
    specialties: ['boxing', 'cardio', 'group_classes'],
    yearsOfExperience: 4,
    rating: 4.6,
    totalRatings: 67,
    status: 'available',
    bio: 'Boxing and cardio specialist with a passion for group fitness classes.',
    salary: { amount: 3800, currency: 'USD', payFrequency: 'monthly' },
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@fitbees.com',
    phone: '+1 555 0105',
    gender: 'male',
    role: 'junior_trainer',
    specialties: ['weight_training', 'personal_training'],
    yearsOfExperience: 2,
    rating: 4.4,
    totalRatings: 23,
    status: 'off_duty',
    bio: 'Enthusiastic junior trainer focused on helping beginners achieve their fitness goals.',
    salary: { amount: 2800, currency: 'USD', payFrequency: 'monthly' },
  },
];

const generateClients = (trainerIds) => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Cameron', 'Drew', 'Blake', 'Skyler', 'Reese', 'Finley', 'Phoenix', 'Logan', 'Hayden', 'Emerson', 'Charlie', 'Dakota'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const goals = ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'sports_training'];
  const membershipTypes = ['basic', 'standard', 'premium'];
  const statuses = ['active', 'active', 'active', 'active', 'inactive', 'expired'];

  return Array.from({ length: 30 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (Math.random() > 0.5 ? 12 : 6));

    return {
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+1 555 ${String(1000 + i).padStart(4, '0')}`,
      dateOfBirth: new Date(1980 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      address: {
        street: `${100 + i} Main Street`,
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      fitnessGoal: goals[Math.floor(Math.random() * goals.length)],
      currentWeight: 60 + Math.floor(Math.random() * 40),
      targetWeight: 55 + Math.floor(Math.random() * 30),
      height: 155 + Math.floor(Math.random() * 35),
      fitnessLevel: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
      membershipType: membershipTypes[Math.floor(Math.random() * membershipTypes.length)],
      membershipStartDate: startDate,
      membershipEndDate: endDate,
      assignedTrainer: trainerIds[Math.floor(Math.random() * trainerIds.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Family',
        phone: '+1 555 9999',
      },
    };
  });
};

const generatePayments = (clientIds) => {
  const paymentTypes = ['membership', 'personal_training', 'day_pass'];
  const paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'cash'];
  const statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'failed'];

  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  return Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    const type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    let amount = type === 'membership' ? [99, 149, 199][Math.floor(Math.random() * 3)] : type === 'personal_training' ? [50, 75, 100][Math.floor(Math.random() * 3)] : 25;

    return {
      invoiceNumber: `INV-${year}${month}-${(i + 1).toString().padStart(5, '0')}`,
      client: clientIds[Math.floor(Math.random() * clientIds.length)],
      amount,
      paymentType: type,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      transactionDate: date,
      description: `${type.replace('_', ' ')} payment`,
    };
  });
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Trainer.deleteMany({});
    await Client.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data...');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create trainers
    const createdTrainers = await Trainer.create(
      trainers.map((t) => ({ ...t, createdBy: createdUsers[0]._id }))
    );
    console.log(`Created ${createdTrainers.length} trainers`);

    // Create clients
    const trainerIds = createdTrainers.map((t) => t._id);
    const clientsData = generateClients(trainerIds);
    const createdClients = await Client.create(
      clientsData.map((c) => ({ ...c, createdBy: createdUsers[0]._id }))
    );
    console.log(`Created ${createdClients.length} clients`);

    // Update trainer client counts
    for (const trainer of createdTrainers) {
      const clientCount = await Client.countDocuments({ assignedTrainer: trainer._id });
      await Trainer.findByIdAndUpdate(trainer._id, { totalClients: clientCount });
    }

    // Create payments
    const clientIds = createdClients.map((c) => c._id);
    const paymentsData = generatePayments(clientIds);
    const createdPayments = await Payment.create(
      paymentsData.map((p) => ({ ...p, processedBy: createdUsers[0]._id }))
    );
    console.log(`Created ${createdPayments.length} payments`);

    // Create sample notifications
    const notifications = [
      {
        user: createdUsers[0]._id,
        type: 'client',
        title: 'New Client Added',
        message: `${createdClients[0].fullName} has been added as a new client.`,
        priority: 'medium',
      },
      {
        user: createdUsers[0]._id,
        type: 'payment',
        title: 'Payment Received',
        message: `Payment of $149 received from ${createdClients[1].fullName}.`,
        priority: 'medium',
      },
      {
        user: createdUsers[0]._id,
        type: 'trainer',
        title: 'New Trainer Added',
        message: `${createdTrainers[0].fullName} has joined the team as a new trainer.`,
        priority: 'medium',
      },
      {
        user: createdUsers[0]._id,
        type: 'alert',
        title: 'Membership Expiring Soon',
        message: `${createdClients[2].fullName}'s membership will expire in 7 days.`,
        priority: 'high',
      },
    ];

    await Notification.create(notifications);
    console.log(`Created ${notifications.length} notifications`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Admin: samsamueldass@gmail.com / password123');
    console.log('   Admin: sylvestermsc@gmail.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
