import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { resetErrorMessage } from '../actions'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleDismissClick = this.handleDismissClick.bind(this)
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <div className="alert alert-danger">
        <b>{errorMessage}</b>
        {' '}
        (<a href="#" onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </div>
    )
  }

  render() {
    const { children } = this.props
    return (
      <div className="app-container">
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

App.propTypes = {
  // Injected by React Redux
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  // Injected by React Router
  children: PropTypes.node,
}

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  push,
})(App)
