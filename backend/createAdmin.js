import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import connectDB from './lib/connectDB.js';

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@youmatter.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    const admin = new User({
      email: 'admin@youmatter.com',
      password: hashedPassword,
      anonymousName: 'Admin',
      role: 'admin',
      isActive: true,
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@youmatter.com');
    console.log('Password: admin');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

