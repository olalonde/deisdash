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

    const builds = []
    for (let i = 0; i < results.length; i++) {
      const build = results[results.length - 1 - i]
      if (!build) break
      builds.push({
        sha: build.sha,
        created: moment.utc(build.created).fromNow(),
        uuid: build.uuid,
      })
    }

    return (
      <div className="col-md-4">
        {
          builds.map((build) => (
            <div key={build.uuid} className="row">
              <div className="col-sm-8">{build.sha}</div>
              <div className="col-sm-4 text-right"><small>{build.created}</small></div>
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
