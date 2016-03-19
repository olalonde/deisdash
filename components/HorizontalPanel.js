import React from 'react'
import classnames from 'classnames'

const HorizontalPanel = (props) => {
  const { title, first } = props
  return (
    <div className={classnames({ 'h-panel': true, 'h-panel-first': first })}>
      <div className="h-panel-section">
        <div className="h-panel-description">
          <div className="h-panel-title">{title}</div>
        </div>
        <div className="h-panel-content">
        {props.children}
        </div>
      </div>
    </div>
  )
}

export default HorizontalPanel
