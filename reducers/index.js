// import * as ActionTypes from '../actions'
// import merge from 'lodash/merge'
// import paginate from './paginate'
import { routeReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import { resolve } from 'url'

const HANDLED_ERRORS = [
  'POST_AUTH_LOGIN',
  'CONTROLLER_INFO',
  'POST_AUTH_REGISTER',
  'POST_AUTH_PASSWD', // todo: not handled in global state
  'POST_KEYS', // todo: not handled in global state, after dispatch promise
  'DEL_APP_PERMS',
  'POST_APP_PERMS',
  'GET_USER_IS_ADMIN',
]

// Generic error message reducer
const errorMessage = (state = null, action) => {
  const { payload, type } = action
  // ignore errors from controller info
  if (HANDLED_ERRORS.includes(type)) return state
  if (type === 'RESET_ERROR_MESSAGE') {
    return null
  } else if (action.error && payload) {
    return typeof payload === 'object' ? JSON.stringify(payload) : payload
  }
  return state
}

const controller = (state = '', action) => {
  if (action.type === 'CHANGE_CONTROLLER') {
    return resolve(action.controller, '/')
  }
  return state
}

const user = (state = null, { type, payload, success, error }) => {
  if (type === 'POST_AUTH_LOGIN' && success) {
    const { username, token } = payload
    return { username, token }
  } else if (type === 'POST_AUTH_LOGIN' && error) {
    return null
  } else if (type === 'LOGOUT') {
    return null
  } else if (type === 'GET_USER_IS_ADMIN') {
    if (success) {
      return { ...state, isAdmin: true }
    } else if (error) {
      return { ...state, isAdmin: false }
    }
  }
  return state
}

const apps = (state = [], { type, success, error, payload }) => {
  if (type === 'GET_APPS') {
    if (success) {
      return payload.results
    } else if (error) {
      return []
    }
  }
  return state
}

const simpleReduce = (filterType) => (state = null, { type, success, error, pending, payload }) => {
  if (type === filterType) {
    if (pending || error) return null
    if (success) return payload
  }
  return state
}

const overview = simpleReduce('GET_APP_OVERVIEW')
const config = (state = null, { type, success, error, pending, payload }) => {
  if (type === 'GET_APP_CONFIG') {
    if (pending || error) return null
    if (success) return payload
  } else if (type === 'DEL_APP_CONFIG' || type === 'ADD_APP_CONFIG') {
    if (success) return payload
  }
  return state
}

const perms = (state = null, { type, success, error, pending, payload, metadata }) => {
  if (type === 'GET_APP_PERMS') {
    if (pending || error) return null
    if (success) return payload
  } else if (type === 'POST_APP_PERMS') {
    if (success) {
      return {
        ...state,
        users: [
          // prevent duplicates
          ...(state.users.filter(u => u !== metadata.username)),
          metadata.username,
        ],
      }
    }
  } else if (type === 'DEL_APP_PERMS' && success) {
    return {
      ...state,
      users: state.users.filter(u => u !== metadata.username),
    }
  }
  return state
}
const builds = simpleReduce('GET_APP_BUILDS')
const releases = simpleReduce('GET_APP_RELEASES')
const logs = simpleReduce('GET_APP_LOGS')

const domains = (state = null, { type, success, error, pending, payload, metadata }) => {
  if (type === 'GET_APP_DOMAINS') {
    if (pending || error) return null
    if (success) return payload
  } else if (type === 'ADD_APP_DOMAIN') {
    if (success) {
      return {
        ...state,
        results: [
          ...state.results,
          payload,
        ],
      }
    }
  } else if (type === 'DEL_APP_DOMAIN') {
    // TODO: handle pending and error
    if (success) {
      const { results } = state
      return {
        ...state,
        results: results.filter((d) => d.domain !== metadata.domain),
      }
    }
  }
  return state
}

// @TODO: refactor this, lots of copy/paste
// @TODO: when pending, reset object
const activeApp = combineReducers({
  config, overview, builds, releases, domains, logs, perms,
})

const controllerInfo = (state = null, { type, payload, success, pending, error }) => {
  if (type !== 'CONTROLLER_INFO') return state
  if (success) {
    return { ...payload, isValid: true }
  } else if (pending) {
    return null
  } else if (error) {
    return { isValid: false }
  }
}

const ui = combineReducers({
  login: (state = {}, { type, payload, error, success }) => {
    // reset errors when changing controller
    if (type === 'CONTROLLER_INFO') {
      return {}
    }
    if (type === 'POST_AUTH_LOGIN') {
      if (error) return { error: payload }
      if (success) return {}
    }
    return state
  },
  register: (state = {}, { type, payload, error, success }) => {
    // reset errors when changing controller
    if (type === 'CONTROLLER_INFO') {
      return {}
    }
    if (type === 'POST_AUTH_REGISTER') {
      if (error) {
        if (payload.detail) {
          return { disabled: payload.detail }
        }
        return { error: payload }
      } else if (success) {
        return {}
      }
    }
    return state
  },
  controllerLocked: (s = false) => s,
})

const keys = (state = null, { type, payload, success, pending, metadata }) => {
  if (type === 'GET_KEYS') {
    if (success) {
      return payload.results
    }
  }
  if (type === 'POST_KEYS') {
    if (success) {
      return [...state, payload]
    }
  }
  if (type === 'DEL_KEY') {
    const { id } = metadata
    if (pending) {
      return state.map((key) => {
        if (key.id === id) {
          return {
            ...key,
            deletePending: true,
          }
        }
        return key
      })
    }
    if (success) {
      return state.filter((key) => key.id !== id)
    }
  }
  return state
}

// TODO: use compose
const users = (state = null, action) => {
  const { type, success, metadata } = action
  if (type === 'GET_USERS') {
    return simpleReduce('GET_USERS')(state, action)
  } else if (type === 'DEL_AUTH_CANCEL') {
    if (success) {
      const { results } = state
      return {
        ...state,
        results: results.filter((u) => u.username !== metadata.username),
      }
    }
  } else if (type === 'GRANT_ADMIN' || type === 'REVOKE_ADMIN') {
    const isAdmin = type === 'GRANT_ADMIN'
    if (success) {
      return {
        ...state,
        results: state.results.map((u) => {
          if (u.username === metadata.username) {
            return {
              ...u,
              is_admin: isAdmin,
              is_staff: isAdmin,
              is_superuser: isAdmin,
            }
          }
          return u
        }),
      }
    }
  }
  return state
}

const rootReducer = combineReducers({
  routing: routeReducer,
  controller,
  controllerInfo,
  user,
  users,
  apps,
  activeApp,
  errorMessage,
  keys,
  ui,
  version: (s = '') => s,
})


export default rootReducer
