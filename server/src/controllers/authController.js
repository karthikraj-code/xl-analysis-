const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug line
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt with:', { email: req.body.email, name: req.body.name }); // Debug line
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        fields: { email: !email, password: !password, name: !name }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();
    console.log('User saved successfully:', user._id); // Debug line

    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated successfully'); // Debug line

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', { email: req.body.email });
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      console.log('Missing required fields:', { email: !!email, newPassword: !!newPassword });
      return res.status(400).json({ 
        message: 'Please provide both email and new password',
        fields: { email: !email, newPassword: !newPassword }
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      console.log('Password too short:', newPassword.length);
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found, updating password for:', email);
    
    // Update user's password
    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully for:', email);

    res.json({ 
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ 
      message: 'Error resetting password', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Social login success handler
exports.handleSocialLoginSuccess = (req, res) => {
  try {
    if (!req.user) {
      throw new Error('No user data received from social login');
    }

    const token = generateToken(req.user._id);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    
    console.log('Social login successful for user:', req.user.email);
    
    // Include user profile information in the redirect
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      role: req.user.role
    };
    
    // Redirect to the auth callback route with the token and user data
    res.redirect(`${clientUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error('Social login error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/callback?message=${encodeURIComponent(error.message)}`);
  }
};

// Social login failure handler
exports.handleSocialLoginFailure = (req, res) => {
  console.error('Social login failure:', req.query);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const errorMessage = req.query.error || 'Authentication failed';
  res.redirect(`${clientUrl}/auth/callback?message=${encodeURIComponent(errorMessage)}`);
}; 