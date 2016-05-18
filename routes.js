import React from 'react'
import {
  Route,
  IndexRoute,
  IndexRedirect,
} from 'react-router'
import App from './containers/App'
import Auth from './containers/Auth'
import Dash from './containers/Dash'
import Apps from './containers/Apps'
import Profile from './containers/Profile'
import Users from './containers/Dash/Users'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Auth} />
    <Route path="about" component={Auth} />
    {/* logged in router */}
    <Route path="dash" component={Dash}>
      <IndexRedirect to="apps" />
      <Route path="apps" component={Apps}>
        <IndexRoute component={Apps.List} />
        <Route path=":appID" component={Apps.Show}>
          <IndexRedirect to="overview" />
          <Route path="overview" component={Apps.Show.Overview} />
          <Route path="config" component={Apps.Show.Config} />
          <Route path="logs" component={Apps.Show.Logs} />
          <Route path="builds" component={Apps.Show.Builds} />
          <Route path="releases" component={Apps.Show.Releases} />
          <Route path="domains" component={Apps.Show.Domains} />
          <Route path="access" component={Apps.Show.Access} />
        </Route>
      </Route>
      <Route path="users" component={Users} />
      <Route path="profile" component={Profile} />
    </Route>
  </Route>
)
