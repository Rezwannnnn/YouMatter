import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const userCount = await User.countDocuments();

  console.log('Database Stats:');
  console.log('Users:', userCount);

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
