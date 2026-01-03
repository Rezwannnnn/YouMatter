import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');

  try {
    // Add your login functionality here
    // For example, find a user by username and password
    const user = await User.findOne({ username: 'testuser', password: 'testpass' });

    if (user) {
      console.log(`User logged in: ${user.username}`);
    } else {
      console.log('Invalid username or password');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during login:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
