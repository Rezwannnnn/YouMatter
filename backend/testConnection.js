import connectDB from './lib/connectDB.js';

async function login(username, password) {
  try {
    await connectDB();
    // Add your authentication logic here
    console.log("✓ Login successful!");
    process.exit(0);
  } catch (err) {
    console.log("✗ Login failed:", err.message);
    process.exit(1);
  }
}

// Replace with real username and password
login('yourUsername', 'yourPassword');
