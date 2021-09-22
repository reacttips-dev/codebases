import { createStore, applyMiddleware, combineReducers } from 'redux'
import { trackingMiddleware } from '../middleware/analytics'
import { syncHistory } from 'redux-simple-router'
import reduxFreeze from 'redux-freeze'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import reducers from '../reducers'
import sagas from '../sagas'
import { createAppShellSyncMiddleware } from '../middleware/appShellSync'
import * as ActionTypes from '../constants/ActionTypes'
import { createHistory } from 'history'

// Export a ref to the redux store so we can use it outside of React
// This is a workaround just for navigation
export const storeRef = { current: null, history: null }

export default function configureStore (initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const appShellSyncMiddleware = createAppShellSyncMiddleware({
    feature: 'home',
    syncWith: 'sidebar',
    actions: [
      ActionTypes.API_CREATE_SPACE.SUCCESS,
      ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE.SUCCESS,
      ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE.FAILURE,
      ActionTypes.API_MOVE_DOCUMENTS_TO_PROJECT.SUCCESS,
      ActionTypes.API_MOVE_DOCUMENTS_TO_PROJECT.FAILURE,
      ActionTypes.API_UPDATE_SPACE.SUCCESS,
      ActionTypes.API_DELETE_SPACE.SUCCESS,
      ActionTypes.API_GET_SPACE.SUCCESS,
      ActionTypes.API_GET_SPACE_V2.SUCCESS,
      ActionTypes.API_LEAVE_SPACE.SUCCESS,
      ActionTypes.API_GET_PROJECT.SUCCESS,
      ActionTypes.API_DELETE_PROJECT.SUCCESS,
      ActionTypes.API_UPDATE_PROJECT.SUCCESS,
      ActionTypes.JOINED_SPACE,
      ActionTypes.NAVIGATE_TO_SPACE,
      ActionTypes.API_CREATE_SPACE_FROM_SIDEBAR.SUCCESS,
      ActionTypes.START_DOCUMENT_DRAG,
      ActionTypes.END_DOCUMENT_DRAG,
      ActionTypes.UPDATE_ACCESS_MANAGEMENT,
      ActionTypes.API_UPDATE_PROJECT_SIDEBAR.REQUEST,
      ActionTypes.API_UPDATE_PROJECT_SIDEBAR.SUCCESS,
      ActionTypes.SIDEBAR_EXPAND_SPACE
    ]
  })
  // TODO: remove logger once cloud-ui supports redux without &forceStandalone param
  const logger = createLogger({
    collapsed: true,
    diff: true,
    predicate: (state, action) => action.type !== ActionTypes.CHECK_IF_BROWSER_MQS_CHANGED,
    titleFormatter: action => `Home: ${String(action.type)}${action.fromFeature ? `, sent from: ${action.fromFeature}` : ''}`
  })
  storeRef.history = createHistory()
  const reduxRouterMiddleware = syncHistory(storeRef.history)
  const middleware = [appShellSyncMiddleware, sagaMiddleware, reduxRouterMiddleware, trackingMiddleware]

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(reduxFreeze)
    middleware.push(logger)
  }

  const createStoreWithMiddleware = composeWithDevTools({ name: 'InVision Home UI' })

  const reducer = combineReducers(reducers())
  const store = createStore(reducer, initialState, createStoreWithMiddleware(applyMiddleware(...middleware)))
  sagaMiddleware.run(sagas)

  storeRef.current = store

  return store
}
