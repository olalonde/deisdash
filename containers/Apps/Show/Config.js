import React from 'react'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'

import ConfigVars from '../../../components/ConfigVars'

class Configuration extends React.Component {
  componentWillMount() {
    const appID = this.props.params.appID
    this.loadData(appID)
    this.onUpdate = this.onUpdate.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const appID = this.props.params.appID
    const nextAppID = nextProps.params.appID
    if (appID !== nextAppID) {
      // @todo use should update?
      this.loadData(nextAppID)
    }
  }

  onUpdate(k, val) {
    // TODO...
    const { dispatch, params: { appID } } = this.props
    return dispatch(deis.addAppConfig(appID)(k, val))
  }

  onDelete(k) {
    const { dispatch, params: { appID } } = this.props
    return dispatch(deis.delAppConfig(appID)(k))
  }

  onCreate(k, val) {
    const { dispatch, params: { appID } } = this.props
    return dispatch(deis.addAppConfig(appID)(k, val))
  }

  loadData(appID) {
    const { dispatch } = this.props
    dispatch(deis.appConfig(appID))
  }

  render() {
    if (!this.props.data) return <div></div>

    const config = this.props.data.values

    // Sort the ENV Vars by name
    const orderedConfig = {};
    Object.keys(config).sort().forEach(function(key) {
      orderedConfig[key] = config[key];
    });

    return (
      <ConfigVars
        config={orderedConfig}
        rowClassName="config-row"
        onUpdate={this.onUpdate}
        onDelete={this.onDelete}
        onCreate={this.onCreate}
      />
    )
  }
}

export default connect(s => ({
  data: s.activeApp.config,
}))(Configuration)
