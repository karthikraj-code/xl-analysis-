const ExcelFile = require('../models/ExcelFile');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const { Chart, registerables } = require('chart.js');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const ChartUsage = require('../models/ChartUsage');

// Register Chart.js components
Chart.register(...registerables);

// Initialize Gemini AI with the model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.generateChartData = async (req, res) => {
  try {
    const { fileId, xAxis, yAxis, chartType } = req.body;

    const file = await ExcelFile.findOne({
      _id: fileId,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Extract data for selected axes
    const chartData = file.data.map(row => ({
      x: row[xAxis],
      y: row[yAxis]
    }));

    res.json({
      chartType,
      data: chartData,
      xAxis,
      yAxis
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating chart data', error: error.message });
  }
};

exports.generateInsights = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Find file and ensure it belongs to the user
    const file = await ExcelFile.findOne({
      _id: fileId,
      user: req.user._id
    });
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Prepare data for analysis
    const data = file.data;
    const columns = file.columns;
    
    // Create a prompt for the Gemini model
    const prompt = `Analyze this dataset and provide insights in a clear, structured format:

DATASET INFORMATION:
- Number of rows: ${data.length}
- Columns: ${columns.join(', ')}
- Data sample: ${JSON.stringify(data.slice(0, 5))}

Provide your analysis in the following format:

KEY TRENDS & PATTERNS
• [List key trends with specific data points]
• [Highlight any notable patterns]

STATISTICAL ANALYSIS
• [Include relevant statistics and metrics]
• [Add any significant numerical findings]

NOTABLE OBSERVATIONS
• [List important observations]
• [Point out any anomalies or interesting findings]

POTENTIAL CORRELATIONS
• [Identify relationships between variables]
• [Explain any cause-effect patterns]

RECOMMENDATIONS
• [Suggest specific actions or further analysis]
• [Provide data-driven recommendations]

Keep the response concise, professional, and focused on actionable insights. Use bullet points for clarity and make section headings bold.`;

    // Generate insights using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    res.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Error generating insights', error: error.message });
  }
};

exports.getDataSummary = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await ExcelFile.findOne({
      _id: fileId,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Calculate basic statistics for each numeric column
    const summary = {};
    file.columns.forEach(column => {
      const values = file.data.map(row => row[column]);
      const numericValues = values.filter(v => !isNaN(v));
      
      if (numericValues.length > 0) {
        summary[column] = {
          count: numericValues.length,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length
        };
      }
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error generating data summary', error: error.message });
  }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's files
    const files = await ExcelFile.find({ user: userId });
    
    // Get user's activity
    const user = await User.findById(userId);
    
    // Generate insights using Gemini
    const insights = await generateInsights(files, user);

    res.json({
      files: files.length,
      storageUsed: files.reduce((acc, file) => acc + file.size, 0),
      lastActive: user.lastActive,
      insights
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// Generate insights using Gemini
async function generateInsights(files, user) {
  try {
    const prompt = `Analyze the following file storage data and provide insights:
      - Number of files: ${files.length}
      - Total storage used: ${files.reduce((acc, file) => acc + file.size, 0)} bytes
      - Last active: ${user.lastActive}
      - File types: ${[...new Set(files.map(f => f.type))].join(', ')}
      
      Provide 3 key insights about storage usage and file management.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Unable to generate insights at this time.';
  }
}

exports.downloadChart = async (req, res) => {
  try {
    const { fileId, xAxis, yAxis, chartType } = req.body;

    const file = await ExcelFile.findOne({
      _id: fileId,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Extract data for selected axes
    const chartData = file.data.map(row => ({
      x: row[xAxis],
      y: row[yAxis]
    }));

    // Create canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Create chart
    const chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: chartData.map(d => d.x),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: chartData.map(d => d.y),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        animation: false,
        plugins: {
          title: {
            display: true,
            text: `${yAxis} vs ${xAxis}`
          },
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });

    // Generate unique filename
    const filename = `chart-${Date.now()}.png`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Save chart as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up: Delete the temporary file
      fs.unlinkSync(filepath);
    });
  } catch (error) {
    console.error('Chart generation error:', error);
    res.status(500).json({ message: 'Error generating chart', error: error.message });
  }
};

// Track chart type usage
exports.trackChartUsage = async (req, res) => {
  try {
    const { chartType } = req.body;
    if (!chartType) return res.status(400).json({ message: 'chartType is required' });
    await ChartUsage.create({ user: req.user._id, chartType });
    res.json({ message: 'Chart usage tracked' });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking chart usage', error: err.message });
  }
};

// Get most used chart types (admin)
exports.getChartTypeUsage = async (req, res) => {
  try {
    // Only allow admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const usage = await ChartUsage.aggregate([
      { $group: { _id: '$chartType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(usage);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chart type usage', error: err.message });
  }
}; 