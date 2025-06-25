const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { auth } = require('../middleware/auth');
const { 
  register, 
  login, 
  getProfile, 
  forgotPassword,
  handleSocialLoginSuccess,
  handleSocialLoginFailure,
  registerAdmin,
  loginAdmin
} = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/error',
    session: false 
  }),
  handleSocialLoginSuccess
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    failureRedirect: '/auth/error'
  })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/auth/error',
    session: false,
    failWithError: true
  }),
  handleSocialLoginSuccess,
  (err, req, res, next) => {
    console.error('GitHub callback error:', err);
    handleSocialLoginFailure(req, res);
  }
);

// Admin registration and login
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// Protected routes
router.get('/profile', auth, getProfile);

// Multer setup for profile picture uploads
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('profilePicture');

router.post('/profile-picture', auth, uploadProfilePic, require('../controllers/authController').uploadProfilePicture);

module.exports = router; 