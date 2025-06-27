const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Debug: Log environment variables
console.log('OAuth Configuration:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set');
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set');

// Get the base URL from environment variables
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_API_URL.replace(/\/api$/, '')
  : process.env.API_URL || 'http://localhost:5000';

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile);
    
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: Math.random().toString(36).slice(-8), // Random password
        googleId: profile.id,
        profilePicture: profile.photos?.[0]?.value
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID and profile picture
      user.googleId = profile.id;
      user.profilePicture = profile.photos?.[0]?.value;
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    console.error('Google authentication error:', error);
    return done(error, null);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/api/auth/github/callback`,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub profile:', profile);
    
    // Check if user already exists by GitHub ID
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      // If not found by GitHub ID, check by email
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
      user = await User.findOne({ email });

      if (user) {
        // If user exists with this email but no GitHub ID, update their GitHub ID
        user.githubId = profile.id;
        user.profilePicture = profile.photos?.[0]?.value;
        await user.save();
      } else {
        // Create new user if doesn't exist
        user = await User.create({
          email: email,
          name: profile.displayName || profile.username,
          password: Math.random().toString(36).slice(-8), // Random password
          githubId: profile.id,
          profilePicture: profile.photos?.[0]?.value
        });
      }
    }

    return done(null, user);
  } catch (error) {
    console.error('GitHub authentication error:', error);
    return done(error, null);
  }
}));

module.exports = passport;