// Styles
import './styles/bootstrap/bootstrap.scss'
import './styles/main.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/configureStore'

// https://deisdash.some.deis.host.com:123 becomes
// https://deis.some.deis.host.com:123
const guessDefaultController = () => {
  const host = window.location.host
  const protocol = window.location.protocol
  // e.g.: localhost
  if (host.split('.').length === 1) {
    return `${protocol}//deis.local3.deisapp.com`
  }
  const deisHost = ['deis'].concat(host.split('.').slice(1)).join('.')
  return `${protocol}//${deisHost}`
}

const localStorage = window.localStorage
const defaultController = localStorage.controller
  || process.env.DEFAULT_CONTROLLER
  || guessDefaultController()
const controllerLocked = !!process.env.CONTROLLER_LOCKED

const getControllerInfo = () => {
  try {
    return JSON.parse(localStorage.controllerInfo)
  } catch (err) {
    console.log(err)
  }
  return null
}

const store = configureStore({
  controller: localStorage.controller || defaultController,
  controllerInfo: getControllerInfo(),
  user: (() => {
    if (localStorage.token && localStorage.username) {
      return {
        token: localStorage.token,
        username: localStorage.username,
      }
    }
    return null
  })(),
  version: process.env.VERSION,
  ui: {
    // TODO: (not implemented)
    // Disable the controller input by default on the home page?
    controllerLocked,
  },
})

render(
  <Root store={store} />,
  document.getElementById('root')
)
