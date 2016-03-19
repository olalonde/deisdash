if (process.env.NODE_ENV === 'production') {
  if (process.env.ELECTRON) {
    module.exports = require('./Root.electron')
  } else {
    module.exports = require('./Root.prod')
  }
} else {
  module.exports = require('./Root.dev')
}
