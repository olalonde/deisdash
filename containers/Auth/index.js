/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { Link } from 'react-router'
import classnames from 'classnames'

import Controller from './Controller'
import Register from './Register'
import Login from './Login'
import AboutModal from './AboutModal'

// import logoImg from '../../static/deis-logo.png'
//import animationGif from '../../static/animation.gif'
//import deisDashLogo from '../../static/deis-dash-logo-md.png'

const modals = ['about']

class Auth extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    this.props.dispatch(routeActions.push('/'))
  }

  maybeRedirect(props) {
    const { dispatch, user, route } = props
    // user is logged in
    if (user && user.token && !modals.includes(route.path)) {
      dispatch(routeActions.push('/dash'))
    }
  }

  componentWillMount() {
    this.maybeRedirect(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.maybeRedirect(nextProps)
  }

  render() {
    const { controllerInfo, route, version } = this.props
    console.log(this.props)
    // put isElectron in redux state?
    const isElectron = process.env.ELECTRON
    const validController = controllerInfo && controllerInfo.isValid
    const extraClass = validController ? '' : 'hide'
    const className = `col-md-6 ${extraClass}`

    const showAbout = route.path === 'about'

    return (
      <div className="container-auth">
        <AboutModal show={showAbout} onHide={this.closeModal} />
        <div className="col-md-8 col-md-offset-2">
          <div className={classnames({ 'col-md-12': true, hide: isElectron, 'splash-links': true })}>
            {/*
              TODO...
              <a href="/installers/Deis%20Dash.dmg" className="btn btn-link">Mac App (preview!)</a>
            */}
            <Link to="/about" className="btn btn-link">About</Link>
          </div>
          <div className="text-center header">
            <img src="broken.gif" alt="deis logo" />
            <span> Deis Dash</span>
            <span className="version">{version}</span>
          </div>
          <div className="">
            <div className="col-md-12">
              <div className="box">
                <Controller />
              </div>
            </div>
            <div className={classnames({ 'text-center': true, hide: validController || isElectron })}>
              <img
                src="broken.png"
                alt="deisdash animation"
                width="730"
                height="404"
              />
            </div>
            <div>
              <div className={className}>
                <div className="box">
                  <h3>Login</h3>
                  <Login />
                </div>
              </div>
              <div className={className}>
                <div className="box">
                  <h3>Register</h3>
                  <Register />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  user: s.user,
  controllerInfo: s.controllerInfo,
  version: s.version,
}))(Auth)
