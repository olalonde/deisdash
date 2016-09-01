import React from 'react'
import { Table, Input } from 'react-bootstrap'
import { debounce } from 'lodash'
import moment from 'moment'

const parseProcess = (str) => {
  const matches = str.match(/\[(.*)\]/)
  return matches[1] || str
}

const parseProcessV2 = (str) => (
  str
)

const parseLine = line => {
  const firstSpace = line.indexOf(' ')
  const secondSpace = line.indexOf(' ', firstSpace + 1)
  const raw = line
  const date = line.slice(0, firstSpace).trim()
  const process = parseProcess(line.slice(firstSpace, secondSpace).trim())
  const text = line.slice(secondSpace, line.length)

  return { date, process, text, raw }
}

const parseLineV2 = line => {
  const firstSpace = line.indexOf(' ')
  const raw = line
  const process = parseProcessV2(line.slice(0, firstSpace).trim())
  const text = line.slice(firstSpace + 4, line.length)

  return { process, text, raw }
}

// date, app, process
const parseLogs = (logs) => {
  const splitLogs = logs.split('\n')
  /* eslint-disable no-console */
  // detect v2 log format
  if (splitLogs.length === 1 && logs.substr(0, 2) === 'b\'' && logs[logs.length - 1] === '\'') {
    console.log('v2 style log')
    return logs.substr(2, logs.length - 3).split('\\n')
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .map(parseLineV2)
  }
  return splitLogs
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map(parseLine)
}

// Merge all rows together, then extract keys
/*
const getColumns = (logs) => (
  Object.keys(logs.reduce((cols, row) => ({ ...cols, ...row }), {}))
)
*/


export default class LogsTable extends React.Component {
  constructor(props) {
    super(props)

    this.onFilter = this.onFilter.bind(this)
    this.togglePrettyDate = this.togglePrettyDate.bind(this)

    const rawLogs = props.logs

    this.state = {
      logs: parseLogs(rawLogs),
      filter: {
        process: '',
        text: '',
      },
      pendingFilter: {
        process: '',
        text: '',
      },
      prettyDate: false,
    }
  }

  onFilter(colName) {
    const debouncedFn = debounce((value) => {
      this.setState({
        filter: {
          ...this.state.filter,
          [colName]: value,
        },
      })
    }, 300)
    return (e) => {
      // https://github.com/facebook/react/issues/2850
      this.setState({
        pendingFilter: {
          ...this.state.pendingFilter,
          [colName]: e.target.value,
        },
      })
      debouncedFn(e.target.value)
    }
  }

  togglePrettyDate() {
    this.setState({
      prettyDate: !this.state.prettyDate,
    })
  }

  render() {
    // TODO: move this to reducer?
    // const columns = getColumns(logs)
    const { logs, filter } = this.state

    let filteredLogs = logs

    if (filter.process) {
      filteredLogs = filteredLogs.filter((row) => (
        row.process && row.process.indexOf(filter.process) >= 0
      ))
    }

    if (filter.text) {
      filteredLogs = filteredLogs.filter((row) => (
        row.text && row.text.indexOf(filter.text) >= 0
      ))
    }

    const trs = filteredLogs.map((row, idx) => {
      const date = this.state.prettyDate
        ? moment.utc(row.date).fromNow()
        : row.date
      return (
        <tr key={idx}>
          <td className="col-date">{date}</td>
          <td className="col-process">{row.process}</td>
          <td className="col-text">{row.text}</td>
        </tr>
      )
    })

    return (
      <div className="logs-table">
        <div className="form">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Filter by process"
              value={this.state.pendingFilter.process}
              onChange={this.onFilter('process')}
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Search logs"
              value={this.state.pendingFilter.text}
              onChange={this.onFilter('text')}
            />
          </div>
          <div className="col-md-2">
            <Input type="checkbox"
              label="Pretty dates" checked={this.state.prettyDate}
              onClick={this.togglePrettyDate}
              readOnly
            />
          </div>
        </div>
        <Table striped condensed hover>
          <thead>
            <tr>
              <th>Date</th>
              <th className="col-process">Process</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {trs}
          </tbody>
        </Table>
      </div>
    )
  }
}


/*
export default ({ logs }) => {
  // TODO: move parsing to reducer?

  const parsedLogs = parseLogs(logs)

  const tableOpts = {
    rowsHeight: 50,
    rowsCount: parseLogs.length,
    width: 5000,
    height: 5000,
    headerHeight: 50,
  }

  const columns = [
    <Column
      header={<Cell>Date</Cell>}
      cell={<Cell>Column 1 static content</Cell>}
      width={2000}
    />
  ]

  return (
   <Table
      rowsCount={100}
      rowHeight={50}
      width={1000}
      headerHeight={10}
      height={500}>
      <Column
        cell={<Cell>Basic content</Cell>}
        width={200}
      />
    </Table>
  )
}
*/
