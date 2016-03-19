import React from 'react'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'
import LogsTable from '../../../components/LogsTable'

class Logs extends React.Component {
  componentWillMount() {
    const appID = this.props.params.appID
    this.loadData(appID)
  }

  componentWillReceiveProps(nextProps) {
    const appID = this.props.params.appID
    const nextAppID = nextProps.params.appID
    if (appID !== nextAppID) {
      // @todo use should update?
      this.loadData(nextAppID)
    }
  }

  loadData(appID) {
    const { dispatch } = this.props
    dispatch(deis.appLogs(appID))
  }

  render() {
    if (!this.props.data) return <div>Loading latest logs...</div>

    const logs = this.props.data

    return (
      <div>
        <LogsTable logs={logs} />
      </div>
    )
  }
}

export default connect(s => ({
  data: s.activeApp.logs,
}))(Logs)
