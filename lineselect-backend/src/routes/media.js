const express = require('express');
const { Media, Vehicle } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { upload, optimizeImage, handleAudioUpload } = require('../middleware/upload');

const router = express.Router();

// Upload multiple files for a vehicle
router.post('/upload/:vehicleId',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'audio', maxCount: 5 }
  ]),
  optimizeImage,
  handleAudioUpload,
  async (req, res) => {
    try {
      const { vehicleId } = req.params;
      
      // Verify vehicle exists
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      const uploadedMedia = [];

      // Process optimized images
      if (req.optimizedImages) {
        for (const [index, image] of req.optimizedImages.entries()) {
          const media = await Media.create({
            vehicleId,
            type: 'image',
            filename: image.filename,
            originalName: image.originalName,
            path: image.path,
            url: `/uploads/vehicles/${image.filename}`,
            thumbnailUrl: `/uploads/vehicles/thumbnails/${image.filename}`,
            size: image.size,
            mimeType: image.mimeType,
            order: index
          });
          uploadedMedia.push(media);
        }
      }

      // Process audio files
      if (req.audioFiles) {
        for (const audio of req.audioFiles) {
          const media = await Media.create({
            vehicleId,
            type: 'audio',
            audioCategory: audio.audioCategory,
            filename: audio.filename,
            originalName: audio.originalName,
            path: audio.path,
            url: `/uploads/audio/${audio.filename}`,
            size: audio.size,
            mimeType: audio.mimeType
          });
          uploadedMedia.push(media);
        }
      }

      res.json({
        success: true,
        data: uploadedMedia,
        message: `Uploaded ${uploadedMedia.length} files successfully`
      });

    } catch (error) {
      console.error('Media upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload media'
      });
    }
  }
);

// Get media for a vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    const media = await Media.findAll({
      where: { vehicleId },
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
});

// Update media order
router.put('/reorder',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { mediaItems } = req.body; // Array of { id, order }

      for (const item of mediaItems) {
        await Media.update(
          { order: item.order },
          { where: { id: item.id } }
        );
      }

      res.json({
        success: true,
        message: 'Media order updated successfully'
      });
    } catch (error) {
      console.error('Reorder media error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder media'
      });
    }
  }
);

// Set main image
router.patch('/:id/main',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const media = await Media.findByPk(id);
      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      }

      // Remove main flag from other images of the same vehicle
      await Media.update(
        { isMain: false },
        { where: { vehicleId: media.vehicleId, type: 'image' } }
      );

      // Set this image as main
      media.isMain = true;
      await media.save();

      // Update vehicle featured image
      await Vehicle.update(
        { featuredImage: media.url },
        { where: { id: media.vehicleId } }
      );

      res.json({
        success: true,
        data: media
      });
    } catch (error) {
      console.error('Set main image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to set main image'
      });
    }
  }
);

// Delete media
router.delete('/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const media = await Media.findByPk(id);
      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      }

      // TODO: Delete actual files from filesystem/S3

      await media.destroy();

      res.json({
        success: true,
        message: 'Media deleted successfully'
      });
    } catch (error) {
      console.error('Delete media error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete media'
      });
    }
  }
);

module.exports = router;