const sequelize = require('../../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Media = require('./Media');
const Content = require('./Content');

// Define associations
Vehicle.hasMany(Media, { 
  foreignKey: 'vehicleId',
  as: 'media',
  onDelete: 'CASCADE'
});

Media.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Vehicle,
  Media,
  Content,
  syncDatabase
};