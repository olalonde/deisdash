import React from 'react'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'
import ScaleSlider from '../../../components/ScaleSlider'
import classnames from 'classnames'

// FIXME: getting weird react error when changing app page after a scale
// parentComponent must be a valid React Component
// Most of this code should probably be re-written
class OverviewScale extends React.Component {

  constructor(props) {
    super(props)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.onScale = this.onScale.bind(this)
    // Keep track of new app structure
    this.state = {
      structure: {},
      oldStructure: props.structure,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ oldStructure: props.structure })
  }

  onSliderChange(name, value) {
    // only keep track of scale values that are different from props
    const structure = this.state.oldStructure
    if (value === structure[name]) {
      // hmm this is really ugly
      this.setState({
        structure: {
          ...this.state.structure,
          [name]: undefined,
        },
      })
    } else {
      this.setState({
        structure: {
          ...this.state.structure,
          [name]: value,
        },
      })
    }
  }

  onScale() {
    const { dispatch, appID } = this.props
    const newStructure = this.state.structure
    // remove "undefined" values... really hackyish...
    Object.keys(newStructure).forEach((key) => {
      if (newStructure[key] === undefined) {
        delete newStructure[key]
      }
    })
    this.setState({ scalePending: true })
    dispatch(deis.appScale(appID)(newStructure)).then(({ success }) => {
      if (success) {
        this.setState({
          scalePending: false,
          structure: {},
          oldStructure: {
            ...this.state.oldStructure,
            ...newStructure,
          },
        })
      }
    })
  }

  render() {
    const structure = this.state.oldStructure

    const sliders = Object.keys(structure).map((processName) => {
      const processScale = this.state.structure[processName] !== undefined
        ? this.state.structure[processName]
        : structure[processName]
      const onSliderChange = value => this.onSliderChange(processName, value)
      return (
        <div className="row row-slider" key={processName}>
          <div className="col-md-2">
            <strong>{processName}</strong>
          </div>
          <div className="col-md-10 scale-container">
            <ScaleSlider value={processScale} onSliderChange={onSliderChange} />
          </div>
        </div>
      )
    })

    const valuesChanged = Object.keys(this.state.structure)
      .filter((k) => this.state.structure[k] !== undefined).length

    const scaleButton = this.state.scalePending
      ?
        <button onClick={this.onScale} className="btn btn-success" disabled>
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate" />
          <span> Scaling...</span>
        </button>
      :
        <button onClick={this.onScale} className="btn btn-success">Scale</button>

    return (
      <div>
        <div>
          {sliders}
        </div>
        <div className={classnames({ 'form-actions': true, hide: !valuesChanged })}>
          {scaleButton}
        </div>
      </div>
    )
  }
}

export default connect()(OverviewScale)
