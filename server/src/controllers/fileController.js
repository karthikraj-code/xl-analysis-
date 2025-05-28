const XLSX = require('xlsx');
const ExcelFile = require('../models/ExcelFile');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.uploadFile = async (req, res) => {
  try {
    console.log('Upload request received:', {
      file: req.file ? {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      } : 'No file'
    });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let workbook;
    let data;
    let columns;

    console.log('Reading file:', req.file.path);
    try {
      // Handle both Excel and CSV files
      if (req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/csv') {
        console.log('Processing CSV file');
        // Read CSV file
        workbook = XLSX.readFile(req.file.path, { type: 'file' });
      } else {
        console.log('Processing Excel file');
        // Read Excel file
        workbook = XLSX.readFile(req.file.path);
      }

      const sheetName = workbook.SheetNames[0];
      console.log('Sheet name:', sheetName);
      
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Data processed:', {
        rowCount: data.length,
        firstRow: data[0],
        columns: Object.keys(data[0] || {})
      });

      if (!data || data.length === 0) {
        throw new Error('No data found in the file');
      }

      // Get column names
      columns = Object.keys(data[0] || {});
      if (columns.length === 0) {
        throw new Error('No columns found in the file');
      }

    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(400).json({ 
        message: 'Error processing file', 
        error: error.message 
      });
    }

    console.log('Uploading to Cloudinary...');
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'excel-files'
    });
    console.log('Cloudinary upload successful');

    // Create ExcelFile document
    const excelFile = new ExcelFile({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: result.secure_url,
      size: req.file.size,
      mimetype: req.file.mimetype,
      columns,
      data,
      user: req.user._id
    });

    console.log('Saving to database...');
    await excelFile.save();
    console.log('Database save successful');

    // Clean up: Delete the temporary file after upload
    fs.unlinkSync(req.file.path);
    console.log('Temporary file cleaned up');

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: excelFile._id,
        filename: excelFile.filename,
        columns: excelFile.columns,
        data: excelFile.data,
        uploadedAt: excelFile.uploadedAt
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    // Clean up: Delete the temporary file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: 'Error uploading file', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const files = await ExcelFile.find({ user: req.user._id })
      .select('filename originalName columns uploadedAt size')
      .sort({ uploadedAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
};

exports.getFileData = async (req, res) => {
  try {
    const file = await ExcelFile.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      id: file._id,
      filename: file.filename,
      originalName: file.originalName,
      columns: file.columns,
      data: file.data,
      uploadedAt: file.uploadedAt
    });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({ message: 'Error fetching file data', error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await ExcelFile.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete from Cloudinary if path exists
    if (file.path) {
      try {
        const publicId = file.path.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await ExcelFile.deleteOne({ _id: file._id });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
}; 