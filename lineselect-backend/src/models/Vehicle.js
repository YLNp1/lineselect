const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  engineType: {
    type: DataTypes.STRING
  },
  power: {
    type: DataTypes.STRING
  },
  transmission: {
    type: DataTypes.STRING
  },
  exteriorColor: {
    type: DataTypes.STRING
  },
  interiorColor: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'sold'),
    defaultValue: 'active'
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  featuredImage: {
    type: DataTypes.STRING
  },
  view360Url: {
    type: DataTypes.STRING
  },
  engineSoundUrl: {
    type: DataTypes.STRING
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING
  },
  metaDescription: {
    type: DataTypes.TEXT
  }
});

module.exports = Vehicle;