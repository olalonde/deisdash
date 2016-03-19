/* eslint-disable */
var path = require('path')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var morgan = require('morgan')

var express = require('express')
var app = express()
var port = process.env.PORT || 3000

var distPath = path.join(__dirname, '/dist')
var staticPath = path.join(__dirname, '/static')
var staticInstallersPath = path.join(__dirname, '/electron/installers')

// http logging
app.use(morgan('dev'))

app.use(express.static(staticPath))
app.use('/installers', express.static(staticInstallersPath))
if (process.env.NODE_ENV === 'production') {
  // TODO: why do we have both /static and /? for favicon?
  app.use('/static', express.static(distPath))
} else {
  var compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }))
  app.use(webpackHotMiddleware(compiler))
}

app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
