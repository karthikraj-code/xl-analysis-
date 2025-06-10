module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        {
          module: /node_modules\/@mediapipe/,
          message: /Failed to parse source map/,
        },
      ],
    },
  },
}; 