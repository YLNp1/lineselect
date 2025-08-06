const { User } = require('../src/models');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lineselect.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      name: 'Administrator',
      role: 'admin'
    });

    console.log(`Admin user created successfully:`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`\nPlease change the password after first login!`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
};

createAdminUser();