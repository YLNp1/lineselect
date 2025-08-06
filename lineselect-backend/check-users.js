const { User } = require('./src/models');

async function checkUsers() {
  try {
    const users = await User.findAll();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit();
}

checkUsers();