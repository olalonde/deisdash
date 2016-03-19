import { controllerInfo } from './deis'

export default (controller) => (dispatch) => {
  dispatch({ type: 'CHANGE_CONTROLLER', controller })

  // check if controller is valid...
  dispatch(controllerInfo(controller))
}
