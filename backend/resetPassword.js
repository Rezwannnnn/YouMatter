import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const login = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.argv[2] || 'anika@gmail.com';
    const password = process.argv[3] || '123456';

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid password');
      process.exit(1);
    }

    console.log(`\n✓ Login successful!`);
    console.log(`Welcome back, ${user.name}!`);
    console.log(`\nYou can now access your account.\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

login();
