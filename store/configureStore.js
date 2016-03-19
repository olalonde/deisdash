if (process.env.NODE_ENV === 'production') {
  if (process.env.ELECTRON) {
    module.exports = require('./configureStore.electron')
  } else {
    module.exports = require('./configureStore.prod')
  }
} else {
  module.exports = require('./configureStore.dev')
}
