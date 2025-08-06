const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Configure multer storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'webp'];
  const allowedAudioTypes = process.env.ALLOWED_AUDIO_TYPES?.split(',') || ['mp3', 'wav'];
  
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (file.fieldname === 'images' && allowedImageTypes.includes(ext)) {
    cb(null, true);
  } else if (file.fieldname === 'audio' && allowedAudioTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${[...allowedImageTypes, ...allowedAudioTypes].join(', ')}`), false);
  }
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Image optimization middleware
const optimizeImage = async (req, res, next) => {
  if (!req.files || !req.files.images) {
    return next();
  }

  try {
    const optimizedImages = [];

    for (const file of req.files.images) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
      const filepath = path.join('public/uploads/vehicles', filename);
      const thumbnailPath = path.join('public/uploads/vehicles/thumbnails', filename);

      // Ensure directories exist
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

      // Optimize and save main image
      await sharp(file.buffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Create thumbnail
      await sharp(file.buffer)
        .resize(400, 300, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      optimizedImages.push({
        filename,
        originalName: file.originalname,
        path: filepath,
        thumbnailPath,
        size: file.size,
        mimeType: 'image/webp'
      });
    }

    req.optimizedImages = optimizedImages;
    next();
  } catch (error) {
    console.error('Image optimization error:', error);
    next(error);
  }
};

// Audio file handler
const handleAudioUpload = async (req, res, next) => {
  if (!req.files || !req.files.audio) {
    return next();
  }

  try {
    const audioFiles = [];
    const audioCategory = req.body.audioCategory || 'general';

    for (const file of req.files.audio) {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
      const filepath = path.join('public/uploads/audio', filename);

      // Ensure directory exists
      await fs.mkdir(path.dirname(filepath), { recursive: true });

      // Save audio file
      await fs.writeFile(filepath, file.buffer);

      audioFiles.push({
        filename,
        originalName: file.originalname,
        path: filepath,
        size: file.size,
        mimeType: file.mimetype,
        audioCategory
      });
    }

    req.audioFiles = audioFiles;
    next();
  } catch (error) {
    console.error('Audio upload error:', error);
    next(error);
  }
};

module.exports = {
  upload,
  optimizeImage,
  handleAudioUpload
};