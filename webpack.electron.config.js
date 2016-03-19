/* eslint-disable */
// TODO; find a way to use only a single webpack.config.js
var path = require('path')
var webpack = require('webpack')

var pkg = require('./package.json')

var constantsPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"',
  'process.env.ELECTRON': JSON.stringify(true),
  'process.env.VERSION': JSON.stringify(pkg.version),
})

module.exports = {
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'electron', 'dist'),
    filename: 'bundle.js',
    // TODO: change this at runtime
    publicPath: './dist/',
  },
  plugins: [
    constantsPlugin,
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.gif(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
    ]
  }
}
