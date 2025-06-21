const User = require('../models/User');
const ExcelFile = require('../models/ExcelFile');

// Helper to check admin
function isAdmin(req, res) {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admins only' });
    return false;
  }
  return true;
}

// Get stats: total users, total files
exports.getStats = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const userCount = await User.countDocuments();
    const fileCount = await ExcelFile.countDocuments();
    res.json({ userCount, fileCount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

// Get all users (exclude admins)
exports.getAllUsers = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const users = await User.find({ role: { $in: ['user', 'blocked'] } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Block or unblock a user (toggle)
exports.blockUser = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = user.role === 'blocked' ? 'user' : 'blocked';
    await user.save();
    res.json({ message: `User is now ${user.role}` });
  } catch (err) {
    res.status(500).json({ message: 'Error blocking user', error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const files = await ExcelFile.find();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
};

// Get files for a specific user
exports.getUserFiles = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const files = await ExcelFile.find({ user: req.params.userId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user files', error: err.message });
  }
}; 