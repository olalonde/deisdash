/* eslint-disable max-len */
import React from 'react'
import { Modal, Button } from 'react-bootstrap'
//import animationGif from '../../static/animation.gif'

export default (props) => (
  <Modal {...props} bsSize="large" aria-labelledby="contained-modal-title-lg">
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg">About</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="pull-right" style={{ width: '50%' }}>
        <img
          src="broken.gif"
          alt="deisdash animation"
          width="100%"
        />
      </p>
      <p>
        <strong>Deis Dash</strong> is an unofficial web based UI for the <a href="https://deis.io">Deis PaaS</a> (Platform as a Service).
        It is meant to complement the official Deis
        {` `}<a href="http://docs.deis.io/en/latest/using_deis/install-client/">command line interface</a>.
      </p>
      <p>
        It is developed and maintained by <a href="https://twitter.com/o_lalonde">Olivier Lalonde</a>.
      </p>
      <p>
        <strong>Github:</strong> <a href="https://github.com/olalonde/deisdash">olalonde/deisdash</a><br />
        <strong>Open Source License:</strong> Apache License, Version 2.0<br />
      </p>
      <p>
        Please report bugs and feature requests on the <a href="https://github.com/olalonde/deisdash/issues">Github issue tracker</a>.
      </p>
      <div className="clearfix"></div>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
)
