import React from 'react'
import { Modal } from 'react-bootstrap'

class ButtonWarning extends React.Component {
  constructor(props) {
    super(props)
    this.click = this.click.bind(this)
    this.close = this.close.bind(this)
    this.state = {
      showModal: false,
    }
  }

  click() {
    this.setState({ showModal: true })
  }

  close() {
    this.setState({ showModal: false })
  }

  render() {
    const { children, message, title, onConfirm, confirmText } = this.props
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default" onClick={this.close}>Cancel</button>
            <span> </span>
            <button className="btn btn-danger" onClick={onConfirm}>
              { confirmText ? confirmText : children }
            </button>
          </Modal.Footer>
        </Modal>
        <button className={`btn btn-danger ${this.props.className}`} onClick={this.click}>
          {children}
        </button>
      </div>
    )
  }
}

export default ButtonWarning
