import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router, hashHistory } from 'react-router'

// TODO: google analytics for electron?
console.log('electron')

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <Router routes={routes} history={hashHistory} />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
}
