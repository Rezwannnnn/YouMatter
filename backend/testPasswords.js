import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const login = async (email, password) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log('Login successful');
      // Proceed with login actions, e.g., generating a token
    } else {
      console.log('Invalid password');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// For testing: replace with actual email and password
login('anika@gmail.com', 'password123');
