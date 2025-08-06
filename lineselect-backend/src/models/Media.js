const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Vehicles',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('image', 'video', 'audio', '360view'),
    allowNull: false
  },
  audioCategory: {
    type: DataTypes.ENUM('engine_start', 'engine_idle', 'engine_rev', 'engine_shutdown', 'exhaust', 'general'),
    allowNull: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER
  },
  mimeType: {
    type: DataTypes.STRING
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isMain: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

module.exports = Media;