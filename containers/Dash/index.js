import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from 'react-redux'
import { parse } from 'url'
import { routeActions } from 'react-router-redux'
import * as deis from '../../actions/deis'
import {
  Nav,
  Navbar,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap'
import deisDashLogo from '../../static/deis-dash-logo-md.png'

const mapStateToProps = s => ({
  user: s.user,
  domain: parse(s.controller).host,
})

/* eslint-disable space-before-keywords */
const Header = connect(mapStateToProps, null, null, {pure: false})(class extends React.Component {
  constructor(props) {
    super(props)
    this.onLogout = this.onLogout.bind(this)
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(deis.getUserIsAdmin())
  }

  onLogout(e) {
    e.preventDefault()
    this.props.dispatch(deis.logout())
    this.props.dispatch(routeActions.push('/'))
  }

  render() {
    const { user, domain } = this.props
    const userNavEle = (
      <div className="title">
        {user.username}<small>{`@${domain}`}</small>
      </div>
    )
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand className="nav-logo">
            <a href="#"><img src={deisDashLogo} alt="deis dash" /></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/dash/apps">
              <NavItem eventKey={1}>Apps</NavItem>
            </LinkContainer>
            { user.isAdmin &&
              <LinkContainer to="/dash/users">
                <NavItem eventKey={2}>Users</NavItem>
              </LinkContainer>
            }
          </Nav>
          <Nav pullRight>
            <NavDropdown
              eventKey={2}
              title={userNavEle}
              className="user-dropdown"
              id="user-dropdown"
            >
            <LinkContainer to="/dash/profile">
              <MenuItem eventKey={2.1}>Profile</MenuItem>
            </LinkContainer>
            <MenuItem divider />
            {/*
                <MenuItem eventKey={2.1}>Profile</MenuItem>
                <MenuItem eventKey={2.2}>Keys</MenuItem>
                <MenuItem divider />
                */}
              <MenuItem eventKey={2.3} onSelect={this.onLogout}>Logout</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
})


class Dash extends React.Component {
  // redirect user if not logged in
  // TODO: also do this in willreceiveprops
  componentWillMount() {
    // TODO: do this in the router?
    if (!this.props.user) {
      this.props.dispatch(routeActions.push('/'))
    }
  }

  render() {
    if (!this.props.user) return <div></div>
    const { children } = this.props
    return (
      <div>
        <Header />
        <div className="container">
          {children}
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  user: s.user,
}))(Dash)
