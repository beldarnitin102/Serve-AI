import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Worker from './models/Worker.js';

dotenv.config();

const seedWorkers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Create a category with 8 workers
    const category = 'Plumbing';
    const names = [
      'Rajesh Kumar', 'Anita Singh', 'Vikram Mehta', 'Suresh Raina', 
      'Priya Sharma', 'Amit Patel', 'Neha Gupta', 'Sunil Verma'
    ];
    
    const workersData = names.map((name, index) => ({
      name,
      email: `worker${index + 100}@servai.com`,
      password: 'password123',
      phone: `99887766${index + 10}`,
      role: 'worker'
    }));

    for (const data of workersData) {
      // Create User
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create(data);
      }

      // Create Worker Profile
      const rating = (4 + Math.random()).toFixed(1);
      const jobs = Math.floor(Math.random() * 200) + 50;
      
      await Worker.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          services: [category, 'General Repairs'],
          hourlyRate: 300 + (Math.random() * 500),
          description: `Expert in ${category} with over ${Math.floor(Math.random() * 10) + 2} years of experience.`,
          verification: {
            isVerified: true,
            status: 'verified',
            trustScore: 85 + Math.floor(Math.random() * 15)
          },
          trustFactors: {
            rating: parseFloat(rating),
            completedJobs: jobs,
            customerSentiment: 80 + Math.floor(Math.random() * 20)
          }
        },
        { upsert: true, new: true }
      );
    }

    console.log('✅ Successfully seeded 8 workers for Plumbing category.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedWorkers();
