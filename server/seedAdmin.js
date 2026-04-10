require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ticket-system');

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists:', adminExists.email);
      return;
    }

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@yourcompany.com',
      password: 'SecurePass123!',
      role: 'admin',
      department: 'IT'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@yourcompany.com');
    console.log('Password: SecurePass123!');
    console.log('Please change the password after first login.');

  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();