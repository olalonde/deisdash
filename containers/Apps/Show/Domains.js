import React from 'react'
import * as deis from '../../../actions/deis'
import { connect } from 'react-redux'

class Domains extends React.Component {

  constructor(props) {
    super(props)

    this.onChangeNewDomain = this.onChangeNewDomain.bind(this)
    this.onAddNewDomain = this.onAddNewDomain.bind(this)
    this.onDeleteDomain = this.onDeleteDomain.bind(this)

    this.state = {
      newDomain: '',
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

  onChangeNewDomain(e) {
    this.setState({ newDomain: e.target.value })
  }

  // TODO: handle errors
  onAddNewDomain() {
    const { dispatch } = this.props
    const appID = this.props.params.appID
    const newDomain = this.state.newDomain
    this.setState({ newDomain: '' })
    dispatch(deis.appDomainsAdd(appID)(newDomain)).then(({ error, payload }) => {
      console.log(payload)
      console.log(error)
    })
  }

  // TODO: handle errors
  onDeleteDomain(domain) {
    const { dispatch } = this.props
    const appID = this.props.params.appID
    dispatch(deis.appDomainsDel(appID)(domain)).then(({ error, payload }) => {
      console.log(payload)
      console.log(error)
    })
  }

  loadData(appID) {
    const { dispatch } = this.props
    dispatch(deis.appDomains(appID))
  }

  render() {
    if (!this.props.data) return <div></div>
    const domains = this.props.data.results.map((domainInfo) => {
      const { domain } = domainInfo
      const onDelete = () => this.onDeleteDomain(domain)
      return (
        <div key={domain} className="form-group">
          <div className="col-md-1">
            <button className="btn btn-xs btn-danger">
              <span className="glyphicon glyphicon-remove"
                onClick={onDelete}
              />
            </button>
          </div>
          <div className="col-md-11">
            {domain}
          </div>
        </div>
      )
    })

    return (
      <div className="col-md-6">
        <div className="form-horizontal">
          {domains}
        </div>
        <br />
        <div className="row">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="domain.com"
              value={this.state.newDomain}
              onChange={this.onChangeNewDomain}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-success"
              disabled={this.state.newDomain === ''}
              onClick={this.onAddNewDomain}
            >Add domain name</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(s => {
  if (s.activeApp && s.activeApp.domains) {
    return {
      data: s.activeApp.domains,
    }
  }
  return {}
})(Domains)
