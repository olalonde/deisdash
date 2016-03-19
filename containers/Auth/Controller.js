import React, { Component } from 'react'
import { connect } from 'react-redux'
import changeController from '../../actions/changeController'
import { debounce } from 'lodash'

class Controller extends Component {
  constructor(props) {
    super(props)
    this.onChangeController = this.onChangeController.bind(this)
    const updateController = this.updateController.bind(this)
    this.updateController = debounce(updateController, 500)
    this.state = {
      controller: props.controller,
    }
  }

  componentWillMount() {
    this.props.dispatch(changeController(this.props.controller))
  }

  onChangeController(e) {
    let controller = e.target.value
    if (controller === '') {
      controller = 'https://'
    } else if (controller.length < 4) {
      controller = 'http'
    }
    this.setState({ controller })
    this.updateController(controller)
  }

  updateController(controller) {
    this.props.dispatch(changeController(controller))
  }

  render() {
    const { controllerInfo } = this.props

    // const controllerClass = controller.match(/^https?:\/\//) ? '' : 'has-error'
    let controllerClass = ''
    let status = 'validating controller...'

    if (controllerInfo) {
      const { isValid } = controllerInfo
      controllerClass = isValid ? 'has-success' : 'has-error'
      if (controllerInfo.version) {
        status = `version ${controllerInfo.version}`
      } else {
        status = `invalid or unreachable`
      }
    }

    return (
      <div>
        <h3>Deis Controller <small>{status}</small></h3>
        <div className={`form-horizontal ${controllerClass}`}>
          <input
            className="form-control"
            onChange={this.onChangeController}
            value={this.state.controller}
          />
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  controller: s.controller,
  controllerInfo: s.controllerInfo,
}))(Controller)
