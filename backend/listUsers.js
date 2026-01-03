import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
