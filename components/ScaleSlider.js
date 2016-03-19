import React from 'react'
import Slider from 'rc-slider'

export default class ScaleSlider extends React.Component {
  constructor(props) {
    super(props)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.state = {
      value: props.value,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ value: props.value })
  }

  onSliderChange(value) {
    this.setState({ value })
    this.props.onSliderChange(value)
  }

  render() {
    return (
      <Slider
        value={this.state.value}
        onChange={this.onSliderChange}
        min={0}
        max={20}
      />
    )
  }
}
