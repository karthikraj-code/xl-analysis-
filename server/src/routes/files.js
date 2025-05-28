const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { uploadFile, getUserFiles, getFileData, deleteFile } = require('../controllers/fileController');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.originalname, 'Mimetype:', file.mimetype);
    cb(null, true); // Allow all file types
  }
}).single('file');

// Wrap multer middleware to handle errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown upload error:', err);
      return res.status(500).json({ 
        message: 'Unknown error occurred during file upload', 
        error: err.message 
      });
    }
    // Everything went fine
    next();
  });
};

router.post('/upload', auth, uploadMiddleware, uploadFile);
router.get('/', auth, getUserFiles);
router.get('/:id', auth, getFileData);
router.delete('/:id', auth, deleteFile);

module.exports = router; 