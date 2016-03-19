import React from 'react'

class ConfigVar extends React.Component {

  constructor(props) {
    super(props)
    this.onClickEdit = this.onClickEdit.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.onClickCancel = this.onClickCancel.bind(this)
    this.onChange = this.onChange.bind(this)

    this.state = {
      editing: false,
      deletePending: false,
      savePending: false,
      newVal: this.props.val,
    }
  }

  onClickEdit() {
    this.setState({
      editing: true,
    })
  }

  onClickCancel() {
    this.setState({
      editing: false,
      newVal: this.props.val,
    })
  }

  onClickDelete() {
    this.setState({ deletePending: true })
    this.props.onDelete(this.props.k)
  }

  onClickSave() {
    this.setState({
      editing: false,
      savePending: true,
    })
    this.props.onUpdate(this.props.k, this.state.newVal).then(() => {
      this.setState({
        savePending: false,
      })
    })
  }

  onChange(e) {
    this.setState({
      newVal: e.target.value,
    })
  }

  render() {
    const {
      k,
      rowClassName = '',
    } = this.props

    const val = this.state.editing || this.state.savePending ? this.state.newVal : this.props.val

    let inputDisabled = true
    let buttons = []
    if (this.state.editing) {
      inputDisabled = false
      buttons = [
        <button key="cancel" className="btn btn-default pull-left" onClick={this.onClickCancel}>
        Cancel
        </button>,
        <button key="save" className="btn btn-success pull-left" onClick={this.onClickSave}>
        Save
        </button>,
      ]
    } else if (this.state.savePending) {
      buttons = [
        <button key="save" disabled className="btn btn-success pull-left"
          onClick={this.onClickSave}
        >
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate" />
          <span> Saving...</span>
        </button>,
      ]
    } else if (this.state.deletePending) {
      buttons = [
        <button key="delete-spin" className="btn btn-danger pull-left" disabled>
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate" />
          <span> Deleting...</span>
        </button>,
      ]
    } else {
      buttons = [
        <button key="edit" className="btn btn-default pull-left" onClick={this.onClickEdit}>
          Edit
        </button>,
        <button key="delete" className="btn btn-danger pull-left" onClick={this.onClickDelete}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </button>,
      ]
    }

    return (
      <div className={`row ${rowClassName}`}>
        <div className="col-md-4">
          <input type="text" className="form-control" value={k} disabled />
        </div>
        <div className="col-md-5">
          <input
            type="text" className="form-control"
            onChange={this.onChange}
            value={val}
            disabled={inputDisabled}
          />
        </div>
        <div className="col-md-3">
          {buttons}
        </div>
      </div>
    )
  }
}

export default class ConfigVars extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      k: '',
      val: '',
      saving: false,
    }
    this.onClickAdd = this.onClickAdd.bind(this)
  }

  onClickAdd() {
    this.setState({ saving: true })
    this.props.onCreate(this.state.k, this.state.val).then(() => {
      this.setState({ k: '', val: '', saving: false })
    })
    // todo: catch error
  }

  onChange(name) {
    return (e) => {
      this.setState({ [name]: e.target.value })
    }
  }

  render() {
    const { config, rowClassName } = this.props
    const listItems = Object.keys(config).map((k) => {
      const val = config[k]
      return (
        <ConfigVar
          key={k}
          rowClassName={rowClassName}
          k={k} val={val}
          onUpdate={this.props.onUpdate}
          onDelete={this.props.onDelete}
        />
      )
    })

    const disabled = this.state.saving

    const addButton = !this.state.saving
      ?  <button
           disabled={this.state.k === ''}
           className="btn btn-primary pull-left"
           onClick={this.onClickAdd}
         >Add</button>
      : <button disabled={disabled}
          className="btn btn-primary pull-left"
          onClick={this.onClickAdd}
        >
          <span
             className="glyphicon glyphicon-refresh glyphicon-refresh-animate"
             aria-hidden="true"
           ></span>
          <span> Add</span>
        </button>

    return (
      <div className="col-md-12 config">
        {listItems}

        {/* add config row */}
        <div className={`row ${rowClassName}`}>
          <div className="col-md-4">
            <input type="text"
              disabled={disabled}
              onChange={this.onChange('k')}
              value={this.state.k}
              className="form-control"
            />
          </div>
          <div className="col-md-5">
            <input type="text"
              disabled={disabled}
              onChange={this.onChange('val')}
              value={this.state.val}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            {addButton}
          </div>
        </div>

      </div>
    )
  }
}
