import React from 'react'
import { connect } from 'react-redux'

import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import Overview from './Overview'
import Logs from './Logs'
import Config from './Config'
import Builds from './Builds'
import Domains from './Domains'
import Access from './Access'

const Icon = ({ glyph }) => (
  <small>
    <span className={`glyphicon glyphicon-${glyph}`} aria-hidden="true"></span>
  </small>
)
class Show extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { appID } = this.props.params

    const icons = {
      overview: <Icon glyph="info-sign" />,
      config: <Icon glyph="cog" />,
      builds: <Icon glyph="cloud-upload" />,
      domains: <Icon glyph="globe" />,
      access: <Icon glyph="lock" />,
      logs: <Icon glyph="align-justify" />,
    }

    return (
      <div className="apps-show">
        <div className="row">
         <Nav bsStyle="tabs">
            <LinkContainer key="overview" to={`/dash/apps/${appID}/overview`}>
              <NavItem>{icons.overview} Overview</NavItem>
            </LinkContainer>
            <LinkContainer key="configuration" to={`/dash/apps/${appID}/config`}>
              <NavItem>{icons.config} Configuration</NavItem>
            </LinkContainer>
            <LinkContainer key="builds" to={`/dash/apps/${appID}/builds`}>
              <NavItem>{icons.builds} Builds</NavItem>
            </LinkContainer>
            <LinkContainer key="domains" to={`/dash/apps/${appID}/domains`}>
              <NavItem>{icons.domains} Domains</NavItem>
            </LinkContainer>
            <LinkContainer key="access" to={`/dash/apps/${appID}/access`}>
              <NavItem>{icons.access} Access</NavItem>
            </LinkContainer>
            <LinkContainer key="logs" to={`/dash/apps/${appID}/logs`}>
              <NavItem>{icons.logs} Logs</NavItem>
            </LinkContainer>
          </Nav>
        </div>
        <div className="row tab-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

Show.Overview = Overview
Show.Logs = Logs
Show.Builds = Builds
Show.Config = Config
Show.Domains = Domains
Show.Access = Access

/**
 * TODO: dont use activeApp, keep all retrieved app in an object
 * and just refresh the data when needed
 */
export default connect()(Show)
