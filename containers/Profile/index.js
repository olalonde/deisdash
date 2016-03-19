import React from 'react'
// import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'
import Password from './Password'
import Keys from './Keys'

class Profile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="col-md-12">
        <h2>Profile</h2>
        <Password />
        <Keys />
      </div>
    )
  }
}

export default connect(s => ({
  user: s.user,
}))(Profile)
