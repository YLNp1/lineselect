const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM('text', 'html', 'image', 'json'),
    defaultValue: 'text'
  },
  language: {
    type: DataTypes.STRING(2),
    defaultValue: 'en'
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['page', 'section', 'key', 'language']
    }
  ]
});

module.exports = Content;