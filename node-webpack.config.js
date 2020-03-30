const path = require('path');
// const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: [
    './server/main.js',
  ],
  output: {
    path: path.resolve(__dirname, 'node_dist'),
    filename: 'index.js',
  },
  target: 'node',
  context: __dirname,
  node: {
    __filename: false,
    __dirname: false,
    process: true,
  },
};
