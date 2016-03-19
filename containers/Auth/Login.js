import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as deis from '../../actions/deis'

class Login extends Component {
  constructor(props) {
    super(props)
    // boilerplate binding
    this.onForgotPassword = this.onForgotPassword.bind(this)
    this.onLogin = this.onLogin.bind(this)

    this.state = {
      forgotPasswordClicked: false,
    }
  }

  onForgotPassword() {
    this.setState({ forgotPasswordClicked: true })
  }

  onLogin(e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { username, password } = this.state
    dispatch(deis.login(username, password))
  }

  handleChange(name) {
    return (e) => {
      this.setState({ [name]: e.target.value })
    }
  }

  render() {
    const forgotPassword = this.state.forgotPasswordClicked
      ?
        <p>
        <br /> Just kidding... <strong>Deis</strong> does not support that yet!
        </p>
      :
        <button className="btn btn-link" onClick={this.onForgotPassword}>Forgot password?</button>

    const { error } = this.props

    return (
      <form className={`form ${ error ? 'has-error' : '' }`} method="post" action="/login">
        { error && <p className="text-danger">Invalid username or password.</p> }
        <div className="form-group">
          <input type="user"
            onChange={this.handleChange('username')}
            value={this.state.username}
            className="form-control" placeholder="Username"
          />
        </div>
        <div className="form-group">
          <input type="password"
            onChange={this.handleChange('password')}
            value={this.state.password}
            className="form-control" placeholder="Password"
          />
        </div>
        <div className="form-group">
          <button type="submit"
            onClick={this.onLogin}
            className="btn btn-primary"
          >Login</button>
            { forgotPassword }
        </div>
      </form>
    )
  }
}

export default connect((s) => ({
  error: s.ui.login.error,
}))(Login)
