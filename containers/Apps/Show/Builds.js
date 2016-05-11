import React from 'react'
import moment from 'moment'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'

class Builds extends React.Component {
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
    dispatch(deis.appBuilds(appID))
  }

  render() {
    // only display last 5
    if (!(this.props.data && this.props.data.results)) {
      return <div></div>
    }

    const { results } = this.props.data
    results.reverse()

    const builds = []
    for (let i = 0; i < results.length; i++) {
      const build = results[results.length - 1 - i]
      if (!build) break
      builds.push({
        version: build.version,
        owner: build.owner,
        summary: build.summary,
        created: moment.utc(build.created).fromNow(),
        uuid: build.uuid,
      })
    }

    return (
      <div className="col-md-8">
        <div key="header" className="row">
          <div className="col-sm-2"><b>Version</b></div>
          <div className="col-sm-2"><b>User</b></div>
          <div className="col-sm-2"><b>Date</b></div>
          <div className="col-sm-2"><b>Summary</b></div>
        </div>
        {
          builds.map((build) => (
            <div key={build.uuid} className="row">
              <div className="col-sm-2">v{build.version}</div>
              <div className="col-sm-2">{build.owner}</div>
              <div className="col-sm-2"><small>{build.created}</small></div>
              <div className="col-sm-4"><small>{build.summary}</small></div>
            </div>
          ))
        }
      </div>
    )
  }
}

export default connect(s => ({
  data: s.activeApp.builds,
}))(Builds)
