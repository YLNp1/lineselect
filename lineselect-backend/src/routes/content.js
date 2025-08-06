const express = require('express');
const { body, validationResult } = require('express-validator');
const { Content } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

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

// Get content by page
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { language = 'en' } = req.query;

    const content = await Content.findAll({
      where: { page, language },
      order: [['section', 'ASC'], ['key', 'ASC']]
    });

    // Group by section
    const groupedContent = content.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = {
        value: item.value,
        type: item.type
      };
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedContent
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

// Update content
router.put('/:page/:section/:key',
  authenticate,
  authorize('admin'),
  [
    body('value').notEmpty(),
    body('type').optional().isIn(['text', 'html', 'image', 'json'])
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { page, section, key } = req.params;
      const { value, type = 'text', language = 'en' } = req.body;

      const [content, created] = await Content.findOrCreate({
        where: { page, section, key, language },
        defaults: { value, type }
      });

      if (!created) {
        content.value = value;
        content.type = type;
        await content.save();
      }

      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      console.error('Update content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update content'
      });
    }
  }
);

// Bulk update content for a page
router.put('/:page',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { page } = req.params;
      const { content, language = 'en' } = req.body;

      const results = [];

      for (const [section, sectionData] of Object.entries(content)) {
        for (const [key, data] of Object.entries(sectionData)) {
          const [contentItem, created] = await Content.findOrCreate({
            where: { page, section, key, language },
            defaults: { 
              value: data.value, 
              type: data.type || 'text' 
            }
          });

          if (!created) {
            contentItem.value = data.value;
            contentItem.type = data.type || 'text';
            await contentItem.save();
          }

          results.push(contentItem);
        }
      }

      res.json({
        success: true,
        data: results,
        message: `Updated ${results.length} content items`
      });
    } catch (error) {
      console.error('Bulk update content error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update content'
      });
    }
  }
);

// Get all pages with content
router.get('/', async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const pages = await Content.findAll({
      where: { language },
      attributes: ['page'],
      group: ['page']
    });

    res.json({
      success: true,
      data: pages.map(p => p.page)
    });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages'
    });
  }
});

module.exports = router;