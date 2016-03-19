import React from 'react'
import { connect } from 'react-redux'
import HorizontalPanel from '../../components/HorizontalPanel'
import * as deis from '../../actions/deis'

const Key = ({ uuid, id, val, onDelete, deletePending }) => (
  <div key={uuid} className="form-group">
    <pre>{val}</pre>
    <button
      onClick={() => onDelete(id)}
      disabled={deletePending}
      className="btn btn-danger"
    >Delete Key</button>
  </div>
)

class Keys extends React.Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)
    this.onChange = this.onChange.bind(this)
    this.addKey = this.addKey.bind(this)

    this.state = {
      newKey: '',
      pending: false,
      error: false,
    }
  }

  componentWillMount() {
    this.loadData()
  }

  onChange(e) {
    this.setState({
      newKey: e.target.value,
    })
  }

  onDelete(id) {
    const { dispatch } = this.props
    dispatch(deis.delKey(id))
  }

  addKey() {
    const { dispatch } = this.props
    const key = this.state.newKey
    this.setState({ newKey: '', error: false, pending: true })
    dispatch(deis.addKey(key)).then((action) => {
      this.setState({ pending: false })
      if (action.error) {
        this.setState({ error: action.payload })
      }
    })
  }

  loadData() {
    const { dispatch } = this.props
    dispatch(deis.getKeys())
  }

  render() {
    const { keys } = this.props
    let body
    if (!keys) {
      body = <div>Loading...</div>
    } else {
      const keyItems = keys.map((key) => (
        <Key {...key} key={key.uuid} val={key.public} onDelete={this.onDelete} />
      ))

      body = (
        <div>
          {keyItems}
          { this.state.error && (
            <p className="text-danger">
              Could not add key.
              Are you sure it is a valid{` `}
              <a href="https://help.github.com/articles/checking-for-existing-ssh-keys/">ssh public key</a>?
            </p>
          )}
          <div className={`form-group ${this.state.error ? 'has-error' : ''}`}>
            <textarea
              value={this.state.newKey}
              onChange={this.onChange}
              className="form-control"
              rows="4"
            />
          </div>
          <div className="form-group">
            <button
              onClick={this.addKey}
              className="btn btn-default"
            >Add Key</button>
          </div>
        </div>
      )
    }

    return (
      <HorizontalPanel title="Git Keys">
      {body}
      </HorizontalPanel>
    )
  }
}

export default connect(s => ({
  user: s.user,
  keys: s.keys,
}))(Keys)
