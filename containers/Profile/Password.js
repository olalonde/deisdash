import React from 'react'
// import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'
import HorizontalPanel from '../../components/HorizontalPanel'
import * as deis from '../../actions/deis'

class Password extends React.Component {
  constructor(props) {
    super(props)

    this.changeOldPassword = this.changeOldPassword.bind(this)
    this.changeNewPassword = this.changeNewPassword.bind(this)
    this.changeNewPassword2 = this.changeNewPassword2.bind(this)
    this.changePassword = this.changePassword.bind(this)

    this.state = {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
      success: false,
      error: false,
      pending: false,
    }
  }

  changeOldPassword(e) {
    return this.setState({ oldPassword: e.target.value, error: false, success: false })
  }

  changeNewPassword(e) {
    return this.setState({ newPassword: e.target.value, error: false, success: false })
  }

  changeNewPassword2(e) {
    return this.setState({ newPassword2: e.target.value, error: false, success: false })
  }

  changePassword() {
    const { dispatch } = this.props
    const { oldPassword, newPassword } = this.state
    this.setState({
      pending: true,
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    })
    dispatch(deis.changePassword(oldPassword, newPassword)).then((action) => {
      if (action.success) {
        this.setState({ success: true, error: false, pending: false })
      } else if (action.error) {
        this.setState({ success: false, error: action.payload.detail, pending: false })
      } else {
        this.setState({ success: false, error: false, pending: false })
      }
    })
  }

  render() {
    const repeatMatch = this.state.newPassword === this.state.newPassword2
    return (
      <HorizontalPanel title="Change Password">
        <div className="form-horizontal col-md-9">
          <div className="form-group">
            <label className="col-sm-4 control-label">Old Password</label>
            <div className="col-sm-8">
              <input
                disabled={this.state.pending}
                value={this.state.oldPassword}
                onChange={this.changeOldPassword}
                className="form-control" type="password"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-4 control-label">New Password</label>
            <div className="col-sm-8">
              <input
                disabled={this.state.pending}
                value={this.state.newPassword}
                onChange={this.changeNewPassword}
                className="form-control" type="password"
              />
            </div>
          </div>
          <div className={`form-group ${ repeatMatch ? '' : 'has-error'}`}>
            <label className="col-sm-4 control-label">Repeat New Password</label>
            <div className="col-sm-8">
              <input
                disabled={this.state.pending}
                value={this.state.newPassword2}
                onChange={this.changeNewPassword2}
                className="form-control" type="password"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-4 col-sm-8">
              { this.state.success && (
                <p className="text-success">Password changed successfuly.</p>
              ) }
              { this.state.error && (
                <p className="text-danger">{ this.state.error }</p>
              ) }
              <button
                disabled={this.state.pending || !repeatMatch || !this.state.newPassword}
                onClick={this.changePassword}
                type="submit"
                className="btn btn-default"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </HorizontalPanel>
    )
  }
}

export default connect(s => ({
  user: s.user,
}))(Password)
