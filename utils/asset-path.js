import path from 'path'

const assetPath = (() => {
  if (process.env.ELECTRON) {
    return dumbPath => path.join(__dirname, '..', 'static', dumbPath)
  }
  return dumbPath => dumbPath
})()

export default assetPath
