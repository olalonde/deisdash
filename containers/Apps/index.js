import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Nav, NavItem } from 'react-bootstrap'
import { listApps } from '../../actions/deis'
import { LinkContainer } from 'react-router-bootstrap'
import Show from './Show'
import List from './List'

class Apps extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // this.props.dispatch();
    this.props.dispatch(listApps())
  }

  render() {
    // return <strong>apps...</strong>
    const { apps, children } = this.props

    // Sort the apps by name
    apps.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );

    const items = apps.map((app) => (
      <LinkContainer key={app.id} to={`/dash/apps/${app.id}`}>
        <NavItem>{app.id}</NavItem>
      </LinkContainer>
    ))

    return (
      <div className="row">
        <div className="col-md-2">
          <Nav bsStyle="pills" stacked activeKey={1}>
            { items }
          </Nav>
        </div>
        <div className="col-md-10">
          {children}
        </div>
      </div>
    )
  }
}

Apps.Show = Show
Apps.List = List

export default connect((s) => ({
  apps: s.apps,
}))(Apps)
