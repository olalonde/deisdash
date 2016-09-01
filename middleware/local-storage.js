export default () => next => action => {
  if (action.type === 'CHANGE_CONTROLLER') {
    window.localStorage.controller = action.controller
  } else if (action.type === 'CONTROLLER_INFO' && action.success) {
    window.localStorage.controllerInfo = JSON.stringify({
      isValid: true,
      version: action.payload.version,
    })
  } else if (action.type === 'POST_AUTH_LOGIN' && action.success) {
    window.localStorage.token = action.payload.token
    window.localStorage.username = action.payload.username
  } else if (action.type === 'LOGOUT') {
    delete window.localStorage.token
    delete window.localStorage.username
  }
  return next(action)
}
