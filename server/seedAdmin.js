require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ticket-system');

    const adminEmail = 'admin@yourcompany.com';
    const adminPassword = 'SecurePass123!';
    const adminName = 'Admin';

    let admin = await User.findOne({ role: 'admin' });
    if (admin) {
      admin.name = adminName;
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.department = 'IT';
      await admin.save();
      console.log('Admin user updated successfully!');
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        department: 'IT'
      });
      console.log('Admin user created successfully!');
    }

    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Please change the password after first login.');

  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();