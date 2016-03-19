import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { createApp } from '../../actions/deis'

class CreateApp extends React.Component {
  constructor(props) {
    super(props)

    this.create = this.create.bind(this)
    this.change = this.change.bind(this)
    this.state = {
      id: '',
    }
  }

  change(e) {
    this.setState({
      id: e.target.value,
    })
  }

  create() {
    this.setState({ id: '' })
    this.props.createApp(this.state.id)
  }

  render() {
    return (
      <div className="form-inline create-app-form">
        <div className="form-group">
          <input
            value={this.state.id}
            onChange={this.change}
            className="form-control"
            placeholder="app-name"
          />
        </div>
        <button className="btn btn-success" onClick={this.create}>Create app</button>
      </div>
    )
  }

}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.createApp = this.createApp.bind(this)
  }

  createApp(id) {
    const { dispatch } = this.props
    dispatch(createApp(id))
  }

  render() {
    const { apps } = this.props

    const list = apps.map((app) => {
      const name = app.id
      const processes = Object.keys(app.structure).map((key) => {
        const psName = key
        const psNum = app.structure[key]
        return <span key={psName}>{`${psName}=${psNum}`}</span>
      })
      return (
        <div key={app.id} className="box">
          <Link to={`/dash/apps/${app.id}`}>{name}</Link>
          <div className="processes">{processes}</div>
        </div>
      )
    })

    return (
      <div>
        <div className="app-list">
          <div>{list}</div>
          <CreateApp createApp={this.createApp} />
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  apps: s.apps,
}))(List)
