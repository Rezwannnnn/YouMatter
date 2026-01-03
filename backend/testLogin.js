import connectDB from './lib/connectDB.js';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs';

const testLogin = async () => {
  try {
    await connectDB();

    // Get a sample user
    const user = await User.findOne().select('+password');

    if (!user) {
      console.log('No users found in database');
      process.exit(1);
    }

    // Test password comparison with a known password
    console.log('\n=== Testing Password ===');
    console.log('Trying password: "123456"');
    const test1 = await bcrypt.compare('123456', user.password);
    console.log('Result:', test1);

    console.log('\nTrying password: "password"');
    const test2 = await bcrypt.compare('password', user.password);
    console.log('Result:', test2);

    console.log('\nTrying password: "password123"');
    const test3 = await bcrypt.compare('password123', user.password);
    console.log('Result:', test3);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
