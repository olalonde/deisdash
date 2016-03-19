/* eslint-disable camelcase */
import React from 'react'
import ButtonWarning from '../../../components/ButtonWarning'

const boolToStr = (someBool) => {
  if (someBool === true) {
    return 'Yes'
  } else if (someBool === false) {
    return 'No'
  }
  return 'N/A'
}

class UserItem extends React.Component {
  constructor(props) {
    super(props)
    this.onDestroy = this.onDestroy.bind(this)
    this.grantAdmin = this.grantAdmin.bind(this)
    this.revokeAdmin = this.revokeAdmin.bind(this)
  }

  onDestroy() {
    return this.props.onDestroyUser(this.props.user.username)
  }

  grantAdmin() {
    return this.props.grantAdmin(this.props.user.username)
  }

  revokeAdmin() {
    return this.props.revokeAdmin(this.props.user.username)
  }

  render() {
    // self represents logged in user
    const { user, self } = this.props

    const {
      date_joined,
      email,
      first_name,
      // groups,
      is_active,
      is_staff,
      is_superuser,
      last_login,
      last_name,
      // user_permissions,
      username,
    } = user

    const isSelf = self.username === user.username

    const name = `${first_name} ${last_name}`.trim()

    const warningTitle = (
      <span className="text-danger">
        <strong>Warning!</strong>
      </span>
    )
    const warningMessage = (
      <div>
        <p>
         This operation is permanent and irrevocable. You are about to destroy the user:
        </p>
        <p className="text-center">
         <strong className="text-danger">{username}</strong>
        </p>
      </div>
    )

    const delButton = (
      <ButtonWarning
        onConfirm={this.onDestroy}
        title={warningTitle}
        message={warningMessage}
        confirmText="Delete user"
        className="btn-xs"
      >
        <span className="glyphicon glyphicon-remove"></span>
      </ButtonWarning>
    )

    const grantAdminButton = (
      <button onClick={this.grantAdmin} className="btn btn-default btn-xs">
        Grant admin
      </button>
    )

    const revokeAdminButton = (
      <button onClick={this.revokeAdmin} className="btn btn-default btn-xs">
        Revoke admin
      </button>
    )

    const adminButton = is_superuser ? revokeAdminButton : grantAdminButton

    return (
      <tr>
        <td>{ username }</td>
        <td>{ email }</td>
        <td>{ name }</td>
        <td>{ boolToStr(is_active) }</td>
        <td>{ boolToStr(is_staff) }</td>
        <td>{ boolToStr(is_superuser) }</td>
        <td>{ date_joined }</td>
        <td>{ last_login }</td>
        <td>
          { isSelf ? null : delButton }
        </td>
        <td>
          { isSelf ? null : adminButton }
        </td>
      </tr>
    )
  }
}

export default UserItem
