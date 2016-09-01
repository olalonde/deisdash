import React from 'react'
import * as deis from '../../../actions/deis'
import { routeActions } from 'react-router-redux'
import { connect } from 'react-redux'
import UserItem from './UserItem'
import { Table } from 'react-bootstrap'

class CreateUser extends React.Component {
  constructor(props) {
    super(props)

    this.create = this.create.bind(this)
    this.change = this.change.bind(this)
    this.state = {
      username: '',
      password: '',
      email: '',
    }
  }

  change(type, field) {
    const nextState = {}
    nextState[type] = field.target.value
    this.setState(nextState)
  }

  create() {
    this.props.createUser(this.state.username, this.state.password, this.state.email)
    this.setState({ username: '', password: '', email: '' })
  }

  render() {
    return (
      <div className="form-inline create-user-form">
        <div className="form-group">
          <input
            value={this.state.username}
            onChange={this.change.bind(this, 'username')}
            className="form-control"
            placeholder="username"
          />
          <input type="password"
            value={this.state.password}
            onChange={this.change.bind(this, 'password')}
            className="form-control"
            placeholder="password"
          />
          <input
            value={this.state.email}
            onChange={this.change.bind(this, 'email')}
            className="form-control"
            placeholder="email"
          />
        </div>
        <button className="btn btn-success" onClick={this.create}>Create user</button>
      </div>
    )
  }
}

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.onDestroyUser = this.onDestroyUser.bind(this)
    this.grantAdmin = this.grantAdmin.bind(this)
    this.revokeAdmin = this.revokeAdmin.bind(this)
    this.createUser = this.createUser.bind(this)
  }
  // TODO: also do this in willreceiveprops
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(deis.getUsers()).then(({ error }) => {
      if (error) {
        this.props.dispatch(routeActions.push('/dash'))
      }
    })
  }

  onDestroyUser(username) {
    const { dispatch } = this.props
    dispatch(deis.delUser(username))
  }

  createUser(username, password, email) {
    const { dispatch } = this.props
    dispatch(deis.createUser(username, password, email))
  }

  grantAdmin(username) {
    const { dispatch } = this.props
    dispatch(deis.grantAdmin(username))
  }

  revokeAdmin(username) {
    const { dispatch } = this.props
    dispatch(deis.revokeAdmin(username))
  }

  render() {
    const { users } = this.props

    if (!users) return <div></div>

    // Sort by username
    users.sort(function( a,b) {return (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0);} );

    const userItems = users.map((user) => (
      <UserItem
        key={user.username}
        user={user}
        self={this.props.user}
        onDestroyUser={this.onDestroyUser}
        grantAdmin={this.grantAdmin}
        revokeAdmin={this.revokeAdmin}
      />
    ))

    return (
      <div>
        <h2>Users</h2>
        <Table striped hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
              <th>Active?</th>
              <th>Staff?</th>
              <th>Superuser?</th>
              <th>Date joined</th>
              <th>Last login</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userItems}
          </tbody>
        </Table>
        <CreateUser createUser={this.createUser} />
      </div>
    )
  }
}

export default connect(s => ({
  users: s.users && s.users.results,
  user: s.user,
}))(Users)
