import React from 'react'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'

class PermItem extends React.Component {
  render() {
    const { username, onRemove } = this.props
    return (
      <div className="form-group">
        <div className="col-md-1">
          <button className="btn btn-xs btn-danger">
            <span className="glyphicon glyphicon-remove"
              onClick={onRemove}
            />
          </button>
        </div>
        <div className="col-md-11">
          {`${username} `}
        </div>
      </div>
    )
  }
}

class Access extends React.Component {
  componentWillMount() {
    const appID = this.props.params.appID

    this.onChangeUsername = this.onChangeUsername.bind(this)
    this.onGrantAccess = this.onGrantAccess.bind(this)
    this.onRevokeAccess = this.onRevokeAccess.bind(this)

    this.state = {
      username: '',
      userNotFound: false,
      delUserError: false,
    }

    this.loadData(appID)
  }

  componentWillReceiveProps(nextProps) {
    const appID = this.props.params.appID
    const nextAppID = nextProps.params.appID
    if (appID !== nextAppID) {
      // @todo use should update?
      this.loadData(nextAppID)
    }
  }

  onChangeUsername(e) {
    this.setState({ username: e.target.value })
  }

  onRevokeAccess(username) {
    const { dispatch } = this.props
    const appID = this.props.params.appID
    this.setState({ delUserError: false })
    dispatch(deis.appPermsDel(appID)(username)).then(({ error, payload }) => {
      if (error) {
        this.setState({ delUserError: payload.detail })
      }
    })
  }

  onGrantAccess() {
    const { dispatch } = this.props
    const appID = this.props.params.appID
    const username = this.state.username
    this.setState({
      username: '',
      userNotFound: false,
      grantAccessError: false,
    })
    dispatch(deis.appPermsCreate(appID)(username)).then(({ error, payload }) => {
      if (error) {
        if (payload.detail) {
          const message = payload.detail
          this.setState({ grantAccessError: message })
        } else {
          this.setState({ grantAccessError: 'Error granting access.' })
        }
      }
    })
  }

  loadData(appID) {
    const { dispatch } = this.props
    dispatch(deis.appPerms(appID))
  }

  render() {
    const appID = this.props.params.appID
    const { users } = this.props
    if (!users) return <div></div>
    const perms = users.map((username) => {
      const onRemove = () => (this.onRevokeAccess(username))
      return (
        <PermItem key={username} username={username} onRemove={onRemove} />
      )
    })

    return (
      <div className="col-md-6">
        { this.state.delUserError
          ? <p className="text-danger">{this.state.delUserError}</p>
          : null }
        { perms.length ?
          <p>The following users have access to <strong>{appID}</strong>:</p>
          : <p>You are the only one with access to <strong>{appID}</strong>.</p>
        }
        { perms.length
          ? <div className="form-horizontal">{perms}</div>
          : null
        }
        <br />
        { this.state.grantAccessError
          ? (
            <p className="text-danger">
              { this.state.grantAccessError }
            </p>
          )
          : null
        }
        <div className="row">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-success"
              disabled={this.state.username === ''}
              onClick={this.onGrantAccess}
            >Grant access</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(s => {
  if (s.activeApp && s.activeApp.perms) {
    return {
      users: s.activeApp.perms.users,
    }
  }
  return {}
})(Access)
