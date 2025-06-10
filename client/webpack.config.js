const path = require('path');

module.exports = {
  // ... other webpack config options ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/@mediapipe/,
          /node_modules\/@tensorflow/,
        ],
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /node_modules\/@mediapipe/,
      message: /Failed to parse source map/,
    },
  ],
}; 