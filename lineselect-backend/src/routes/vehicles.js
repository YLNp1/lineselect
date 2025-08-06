const express = require('express');
const { body, validationResult } = require('express-validator');
const { Vehicle, Media } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { generateSlug } = require('../utils/helpers');
const { Op } = require('sequelize');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Get all vehicles (public)
router.get('/', async (req, res) => {
  try {
    const { status, brand, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (brand) where.brand = brand;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      include: [{
        model: Media,
        as: 'media',
        required: false,
        order: [['isMain', 'DESC'], ['order', 'ASC']]
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles'
    });
  }
});

// Get single vehicle (public)
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [{
        model: Media,
        as: 'media',
        order: [['order', 'ASC']]
      }]
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Increment view count
    vehicle.viewCount += 1;
    await vehicle.save();

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle'
    });
  }
});

// Create vehicle (admin only)
router.post('/',
  authenticate,
  authorize('admin'),
  [
    body('brand').notEmpty(),
    body('model').notEmpty(),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
    body('price').isNumeric(),
    body('mileage').isInt({ min: 0 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const vehicleData = req.body;
      
      // Generate slug
      vehicleData.slug = await generateSlug(
        `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}`
      );

      const vehicle = await Vehicle.create(vehicleData);

      res.status(201).json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error('Create vehicle error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create vehicle'
      });
    }
  }
);

// Update vehicle (admin only)
router.put('/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      // Update slug if brand/model/year changed
      if (req.body.brand || req.body.model || req.body.year) {
        const brand = req.body.brand || vehicle.brand;
        const model = req.body.model || vehicle.model;
        const year = req.body.year || vehicle.year;
        req.body.slug = await generateSlug(`${brand} ${model} ${year}`);
      }

      await vehicle.update(req.body);

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error('Update vehicle error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update vehicle'
      });
    }
  }
);

// Delete vehicle (admin only)
router.delete('/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      await vehicle.destroy();

      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      console.error('Delete vehicle error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete vehicle'
      });
    }
  }
);

// Update vehicle status
router.patch('/:id/status',
  authenticate,
  authorize('admin'),
  [body('status').isIn(['active', 'pending', 'sold'])],
  handleValidationErrors,
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      vehicle.status = req.body.status;
      await vehicle.save();

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update status'
      });
    }
  }
);

module.exports = router;