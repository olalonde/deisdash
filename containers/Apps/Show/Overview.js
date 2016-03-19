import React from 'react'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'
import ButtonWarning from '../../../components/ButtonWarning'
import OverviewScale from './OverviewScale'
import HorizontalPanel from '../../../components/HorizontalPanel'
import { routeActions } from 'react-router-redux'

const KeyVal = (props) => {
  const { k, type = '' } = props
  let val = props.val
  if (!val) return <span></span>

  if (type === 'url') {
    // todo: dont add http:// here...
    val = <a href={`//${val}`}>{val}</a>
  } else if (type === 'scale') {
    val = Object.keys(val).map((key) => (
      <span key={key}>{key}={val[key]} </span>
    ))
  } else if (type === 'domains') {
    const domains = val
    val = domains.results.map(({ domain }) => (
      <span key={domain}><a href={`//${domain}`}>{domain}</a> </span>
    ))
  }

  return (
    <div className="form-group col-md-6">
      <label className="control-label">{k}</label>
      <div className="">
        <p className="form-control-static">{val}</p>
      </div>
    </div>
  )
}

class Overview extends React.Component {

  constructor(props) {
    super(props)
    this.onDestroyApp = this.onDestroyApp.bind(this)
    this.state = {
      destroying: false,
    }
  }

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

  onDestroyApp() {
    const { dispatch, data: { id } } = this.props
    dispatch(deis.destroyApp(id))
    dispatch(routeActions.push('/dash/apps'))
  }

  loadData(appID) {
    const { dispatch } = this.props
    dispatch(deis.appOverview(appID))
  }

  render() {
    if (!this.props.data) return <div></div>

    const {
      id,
      owner,
      url,
      structure,
    } = this.props.data
    const appID = this.props.params.appID

    // TODO: get structure even when all processes are scaled to 0

    const warningTitle = (
      <span className="text-danger">
        <strong>Warning!</strong>
      </span>
    )
    const warningMessage = (
      <div>
        <p>
         This operation is permanent and irrevocable. You are about to destroy:
        </p>
        <p className="text-center">
         <strong className="text-danger">{id}</strong>
        </p>
      </div>
    )

    return (
      <div>
        <HorizontalPanel first title="Info">
          <form>
            <KeyVal k="Name" val={id} />
            <KeyVal k="URL" val={url} type="url" />
            <KeyVal k="Owner" val={owner} />
            <KeyVal k="Scale" val={structure} type="scale" />
          </form>
        </HorizontalPanel>
        <HorizontalPanel title="Scale">
          <OverviewScale appID={appID} structure={structure} />
        </HorizontalPanel>
        <HorizontalPanel title="Danger Zone">
          <ButtonWarning
            onConfirm={this.onDestroyApp}
            title={warningTitle}
            message={warningMessage}
          >
            <span className="glyphicon glyphicon-remove"></span>
            <span> Destroy app</span>
          </ButtonWarning>
        </HorizontalPanel>
      </div>
    )
  }
}

export default connect(s => {
  if (s.activeApp && s.activeApp.overview) {
    return {
      data: s.activeApp.overview,
    }
  }
  return {}
})(Overview)
