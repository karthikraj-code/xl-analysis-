const mongoose = require('mongoose');

const excelFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  columns: [{
    type: String
  }],
  data: [{
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const ExcelFile = mongoose.model('ExcelFile', excelFileSchema);

module.exports = ExcelFile; 