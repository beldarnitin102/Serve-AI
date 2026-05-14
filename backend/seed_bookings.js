import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Worker from './models/Worker.js';
import Booking from './models/Booking.js';

dotenv.config();

const seedBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for massive seeding...');

    // 1. Find or create a dummy customer
    let customer = await User.findOne({ email: 'customer@test.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Demo Customer',
        email: 'customer@test.com',
        password: 'password123',
        phone: '9876543210',
        role: 'user'
      });
    }

    // 2. Find ALL workers
    const workers = await Worker.find({});
    console.log(`Found ${workers.length} workers. Seeding jobs for all...`);

    const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'HVAC', 'Painting'];
    const descriptions = {
      'Plumbing': ['Leaking sink repair', 'New tap installation', 'Pipe blockage fix', 'Water heater repair', 'Toilet flush fix', 'Shower head replacement', 'Garden hose connection'],
      'Electrical': ['Switchboard sparking', 'Fan regulator replacement', 'Wiring checkup', 'New light installation', 'Circuit breaker trip', 'Doorbell repair', 'AC point wiring'],
      'Cleaning': ['Full house deep cleaning', 'Kitchen sanitization', 'Sofa dry cleaning', 'Window cleaning', 'Bathroom scrub', 'Balcony wash', 'Carpet shampooing'],
      'Carpentry': ['Broken chair repair', 'Door lock replacement', 'Cabinet hinge fixing', 'Table polishing', 'Wardrobe door alignment', 'Wooden floor repair', 'New shelf mounting'],
      'HVAC': ['AC filter cleaning', 'Gas refilling', 'Noisy AC repair', 'Remote replacement', 'Heater checkup', 'Duct cleaning', 'Thermostat fix'],
      'Painting': ['Single wall painting', 'Balcony touch-up', 'Door painting', 'Full room painting', 'Ceiling patch-up', 'Grill painting', 'Waterproofing coat']
    };

    // Clear existing pending jobs to avoid duplicates
    await Booking.deleteMany({ status: 'pending' });

    let totalSeeded = 0;
    for (const worker of workers) {
      for (const cat of categories) {
        // Create 7 jobs per category for this specific worker
        for (let i = 0; i < 7; i++) {
          await Booking.create({
            user: customer._id,
            worker: worker._id,
            service: cat,
            description: descriptions[cat][i] || `General ${cat} assistance`,
            scheduledDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
            scheduledTime: '10:00 AM',
            location: `Zone ${i + 1}, Sector ${Math.floor(Math.random() * 50) + 1}, New Delhi`,
            coordinates: {
              lat: 28.6139 + (Math.random() - 0.5) * 0.1,
              lng: 77.2090 + (Math.random() - 0.5) * 0.1
            },
            status: 'pending',
            price: {
              total: 350 + (Math.random() * 800)
            }
          });
          totalSeeded++;
        }
      }
    }

    console.log(`✅ Successfully seeded ${totalSeeded} pending jobs across all workers.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedBookings();
