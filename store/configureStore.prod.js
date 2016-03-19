import { createStore, applyMiddleware } from 'redux'
import { syncHistory } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import localStorage from '../middleware/local-storage'

export default (initialState) => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk, localStorage, syncHistory(browserHistory))
)
