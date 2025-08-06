const { Vehicle } = require('../models');
const { Op } = require('sequelize');

const generateSlug = async (text, existingId = null) => {
  let slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Check if slug exists
  let counter = 0;
  let finalSlug = slug;
  
  while (true) {
    const where = { slug: finalSlug };
    if (existingId) {
      where.id = { [Op.ne]: existingId };
    }
    
    const existing = await Vehicle.findOne({ where });
    if (!existing) break;
    
    counter++;
    finalSlug = `${slug}-${counter}`;
  }

  return finalSlug;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
  generateSlug,
  formatFileSize
};