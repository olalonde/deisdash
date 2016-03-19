/* eslint-disable */
// TODO; find a way to use only a single webpack.config.js
var path = require('path')
var webpack = require('webpack')

var pkg = require('./package.json')

var constantsPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"',
  'process.env.VERSION': JSON.stringify(pkg.version),
  'process.env.DEFAULT_CONTROLLER': JSON.stringify(process.env.DEFAULT_CONTROLLER),
  'process.env.GA': JSON.stringify(process.env.GA),
})

module.exports = {
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
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
        loader: 'url?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/svg+xml',
      },
      {
        test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/png',
      },
      {
        test: /\.gif(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/gif',
      },
    ]
  }
}
