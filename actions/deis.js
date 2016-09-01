// Generic redux friendly client for Deis API

// Relies on the deis-api middleware
import 'isomorphic-fetch'
import { resolve } from 'url'

// const DEFAULT_DEIS_VERSION = 'v1'
const compileType = (path, method) => {
  const parts = path.split('/').filter(_ => _ !== '')
  const str = [method, ...parts].join('_').toUpperCase()
  return str
}

const buildOpts = (opts, method, token) => {
  const authHeaders = token ? {
    Authorization: `token ${token}`,
  } : {}
  return {
    method,
    ...opts,
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
    body: (() => {
      if (typeof opts.body === 'object') {
        return JSON.stringify(opts.body)
      }
      return opts.body
    })(),
  }
}

const buildURL = (path, controller, versionStr, noTrailingSlash = false) => {
  // TODO: improve this
  const version = Number(versionStr) >= 2 ? 2 : 1
  // normalize path (remove leading slash, add trailing slash)
  const p1 = path.split('/').filter(part => part !== '').join('/')
  const p2 = p1 === '/' || p1 === '' ? '' : `${p1}/`
  const p3 = noTrailingSlash ? p2.slice(0, -1) : p2
  const url = resolve(controller, `v${version}/${p3}`)
  return url
}

const mapState = (s) => {
  const version = s.controllerInfo ? s.controllerInfo.version : 1
  return {
    controller: s.controller,
    version,
    token: s.user && s.user.token,
  }
}

const defaultMapResponseToAction = (response, json, baseAction) => {
  if (response.status >= 200 && response.status < 300) {
    return {
      ...baseAction,
      payload: json,
      success: true,
    }
  }
  return {
    ...baseAction,
    payload: json,
    metadata: {
      statusCode: response.status,
    },
    error: true,
  }
}

const mapMethodToVerb = (method) => {
  if (method === 'del') return 'delete'
  return method
}

const client = ['get', 'put', 'post', 'del', 'head', 'options'].reduce((obj, method) => {
  obj[method] = (path, opts = {}, {
    action = {},
    mapResponse = defaultMapResponseToAction,
    raw = false,
  } = {}) => (dispatch, getState) => {
    const baseAction = { type: compileType(path, method), ...action }
    dispatch({ ...baseAction, payload: opts.body, pending: true })

    // TODO: noTrailingSlash not so elegant... lets remove that and make sure we use the
    // right paths everywhere

    const noTrailingSlash = opts.noTrailingSlash
    const { controller, version, token } = mapState(getState())
    const verb = mapMethodToVerb(method)

    const args = [
      buildURL(path, controller, version, noTrailingSlash),
      buildOpts(opts, verb, token),
    ]
    return fetch(...args).catch((err) => {
      // Unexpected error... network error?
      err.isFetchError = true
      throw err
    }).then((response) => {
      // Try to parse response as JSON
      // and ignore parsing error
      if (raw) {
        return response.text().then((text) => [response, text])
      }
      return response.json().catch(() => null).then((json) => [response, json])
    }).then(([response, json]) => (
      dispatch(mapResponse(response, json, baseAction))
    )).catch((err) => {
      if (err.isFetchError) {
        return dispatch({ ...baseAction, payload: err.message ? err.message : err, error: true })
      }
      throw err
    })
  }

  return obj
}, {})

export const controllerInfo = () => (
  client.options('/', {}, {
    action: { type: 'CONTROLLER_INFO' },
    mapResponse: (response, json, baseAction) => {
      const version = response.headers.get('X_DEIS_API_VERSION') ?
        response.headers.get('X_DEIS_API_VERSION') : response.headers.get('DEIS_API_VERSION')
      if (version) {
        return {
          ...baseAction,
          payload: { version },
          success: true,
        }
      }
      return {
        ...baseAction,
        payload: { statusCode: response.status },
        error: true,
      }
    },
  })
)

export const listApps = () => (
  client.get('/apps')
)

export const listUsers = () => (
  client.get('/users')
)

export const login = (username, password) => (
  client.post('/auth/login', { body: { username, password } }, {
    mapResponse: (response, json, baseAction) => {
      if (json && json.token) {
        return {
          ...baseAction,
          payload: { username, token: json.token },
          success: true,
        }
      }
      return {
        ...baseAction,
        payload: json,
        error: true,
      }
    },
  })
)

// We need to use this hack until /whoami endpoint is implemented
// https://github.com/deis/deis/issues/4792
// Basically, we try an "admin" only query and see if we are authorized
export const getUserIsAdmin = () => (
  client.get(`/admin/perms/`, {}, { action: { type: 'GET_USER_IS_ADMIN' } })
)

export const grantAdmin = (username) => (
  client.post(`/admin/perms/`, { body: { username } }, {
    action: { type: 'GRANT_ADMIN', metadata: { username } },
  })
)

export const revokeAdmin = (username) => (
  client.del(`/admin/perms/${username}`, {}, {
    action: { type: 'REVOKE_ADMIN', metadata: { username } },
  })
)

export const getUsers = () => client.get(`/users`)

export const delUser = (username) => {
  // disable self-deletion for now
  if (!username) return null

  return client.del(`/auth/cancel/`, {
    body: { username },
  }, {
    action: {
      metadata: { username },
    },
  })
}

export const register = (email, username, password) => (dispatch, getState) => (
  client.post('/auth/register', {
    body: { email, username, password },
  })(dispatch, getState).then((action) => {
    if (action.success) {
      // Automatically login after registration
      return dispatch(login(username, password))
    }
    return action
  })
)

export const changePassword = (oldPassword, newPassword) => (
  client.post('/auth/passwd', {
    body: {
      password: oldPassword,
      new_password: newPassword,
    },
  })
)

export const getKeys = () => (
  client.get(`/keys`)
)

export const delKey = (id) => (
  client.del(`/keys/${id}`, { noTrailingSlash: true }, {
    action: {
      type: 'DEL_KEY',
      metadata: { id },
    },
  })
)

export const addKey = (key, _id) => {
  let id = _id
  // take last word of key file as ID
  if (!id) {
    id = key.trim().split(' ').pop()
  }
  return client.post(`/keys`, { body: { id, public: key } })
}

export const destroyApp = (appID) => (dispatch, getState) => (
  client.del(`/apps/${appID}`, {}, {
    action: { type: 'DELETE_APP' },
  })(dispatch, getState).then(() => {
    // refresh app list
    dispatch(listApps())
  })
)

export const createApp = (appID) => (dispatch, getState) => (
  client.post(`/apps`, {
    body: { id: appID },
  }, {
    action: { type: 'POST_APP' },
  })(dispatch, getState).then(() => {
    // refresh app list
    dispatch(listApps())
  })
)

export const createUser = (username, password, email) => (dispatch, getState) => (
  client.post(`/auth/register`, {
    body: { username, password, email },
  }, {
    action: { type: 'POST_USER' },
  })(dispatch, getState).then(() => {
    // refresh user list
    dispatch(listUsers())
  })
)

export const appOverview = (appID) => (
  client.get(`/apps/${appID}`, {}, { action: { type: 'GET_APP_OVERVIEW' } })
)

export const appConfig = (appID) => (
  client.get(`/apps/${appID}/config`, {}, { action: { type: 'GET_APP_CONFIG' } })
)

export const addAppConfig = (appID) => (key, val) => (
  client.post(`/apps/${appID}/config`, {
    body: {
      values: { [key]: val },
    },
  }, { action: { type: 'ADD_APP_CONFIG' } })
)

export const delAppConfig = (appID) => (key) => (
  client.post(`/apps/${appID}/config`, {
    body: {
      values: { [key]: null },
    },
  }, { action: { type: 'DEL_APP_CONFIG' } })
)

export const appLogs = (appID) => (
  client.get(`/apps/${appID}/logs`, {}, { action: { type: 'GET_APP_LOGS' }, raw: true })
)

export const appScale = (appID) => (structure) => (
  client.post(`/apps/${appID}/scale/`, {
    body: structure,
  }, { action: { type: 'POST_APP_SCALE' } })
)
export const appBuilds = (appID) => (
  client.get(`/apps/${appID}/builds`, {}, { action: { type: 'GET_APP_BUILDS' } })
)
export const appReleases = (appID) => (
  client.get(`/apps/${appID}/releases`, {}, { action: { type: 'GET_APP_RELEASES' } })
)
export const appDomainsAdd = (appID) => (domain) => (
  client.post(`/apps/${appID}/domains/`, {
    body: { domain },
  }, { action: { type: 'ADD_APP_DOMAIN' } })
)
export const appDomainsDel = (appID) => (domain) => (
  client.del(`/apps/${appID}/domains/${domain}`, {}, {
    action: { type: 'DEL_APP_DOMAIN', metadata: { domain } },
  })
)
export const appDomains = (appID) => (
  client.get(`/apps/${appID}/domains`, {}, { action: { type: 'GET_APP_DOMAINS' } })
)
export const appPerms = (appID) => (
  client.get(`/apps/${appID}/perms`, {}, { action: { type: 'GET_APP_PERMS' } })
)
export const appPermsCreate = (appID) => (username) => (
  client.post(`/apps/${appID}/perms/`, {
    body: { username },
  }, { action: { type: 'POST_APP_PERMS', metadata: { username } } })
)

export const appPermsDel = (appID) => (username) => (
  client.del(`/apps/${appID}/perms/${username}`, {}, {
    action: { type: 'DEL_APP_PERMS', metadata: { username } },
  })
)

export const logout = () => ({ type: 'LOGOUT' })

export default client
