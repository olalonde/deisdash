import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as deis from '../../actions/deis'
import { routeActions } from 'react-router-redux'
import classnames from 'classnames'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      username: '',
      password: '',
    }
    this.onRegister = this.onRegister.bind(this)
  }

  onRegister(e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { email, username, password } = this.state
    dispatch(deis.register(email, username, password)).then((action) => {
      // @todo: the register action also dispatches log in
      // put redirects in middleware? duplicated in login
      if (action.success) {
        dispatch(routeActions.push('/dash'))
      }
    })
  }

  render() {
    const { error, disabled } = this.props
    let helpBlocks = {}
    if (error) {
      Object.keys(error).forEach((field) => {
        const messages = error[field].map((message) => (
          <span className="help-block">{message}</span>
        ))
        helpBlocks[field] = messages
      })
    }

    // helper to generate classes with errors
    const c = (field) => classnames({
      'has-error': helpBlocks[field],
      'form-group': true,
    })

    return (
      <form className="form">
        { disabled && (
          <p className='text-danger'>
            Registration is currently disabled.
            See the <a href="http://docs.deis.io/en/latest/managing_deis/operational_tasks/#disable-user-registration">Deis documentation</a>.
          </p>
        )}
        <div className={c('email')}>
          <label className="sr-only">Email address</label>
          <input
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value})}
            type="email" className="form-control" placeholder="Email" />
          {helpBlocks.email}
        </div>
        <div className={c('username')}>
          <label className="sr-only">Username</label>
          <input
            value={this.state.username}
            onChange={(e) => this.setState({ username: e.target.value})}
            type="text" className="form-control" placeholder="Username" />
          {helpBlocks.username}
        </div>
        <div className={c('password')}>
          <label className="sr-only">Password</label>
          <input
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value})}
            type="password" className="form-control" placeholder="Password" />
          {helpBlocks.password}
        </div>
        <button onClick={this.onRegister}
        type="submit" className="btn btn-default">Register</button>
      </form>
    )
  }

}

export default connect(s => ({
  error: s.ui.register.error,
  disabled: s.ui.register.disabled,
}))(Register)
