import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router, browserHistory } from 'react-router'
import ga from 'react-ga'

if (process.env.GA) {
  ga.initialize(process.env.GA)
}

function onUpdate() {
  if (process.env.GA) {
    ga.pageview(this.state.location.pathname)
  }
}

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} onUpdate={onUpdate} />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
}
