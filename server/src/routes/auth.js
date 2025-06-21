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

module.exports = router; 