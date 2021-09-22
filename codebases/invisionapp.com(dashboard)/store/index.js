
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import reduxFreeze from 'redux-freeze'
import { createLogger } from 'redux-logger'

import allReducers from '../reducers'
import sagas from '../sagas'
import { createAppShellSyncMiddleware } from '../middleware/appShellSync'
import * as ActionTypes from '../constants/action-types'

const sagaMiddleware = createSagaMiddleware()
const appShellSyncWithHomeMiddleware = createAppShellSyncMiddleware({
  feature: 'sidebar',
  syncWith: 'home',
  actions: [
    ActionTypes.API_LIST_SPACES.SUCCESS,
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
    ActionTypes.API_UPDATE_PROJECT.SUCCESS,
    ActionTypes.API_DELETE_PROJECT.SUCCESS,
    ActionTypes.API_UPDATE_PROJECT_SIDEBAR.REQUEST,
    ActionTypes.API_UPDATE_PROJECT_SIDEBAR.SUCCESS,
    ActionTypes.JOINED_SPACE,
    ActionTypes.NAVIGATE_TO_SPACE,
    ActionTypes.START_DOCUMENT_DRAG,
    ActionTypes.END_DOCUMENT_DRAG,
    ActionTypes.UPDATE_ACCESS_MANAGEMENT,
    ActionTypes.SIDEBAR_EXPAND_SPACE
  ]
})

const appShellSyncWithGlobalNavMiddleware = createAppShellSyncMiddleware({
  feature: 'sidebar',
  syncWith: 'global-navigation',
  actions: [
    ActionTypes.GN_API_CREATE_SPACE.SUCCESS
  ]
})

// TODO: remove logger once cloud-ui supports redux without &forceStandalone param
const logger = createLogger({
  collapsed: true,
  diff: true,
  titleFormatter: action => `Sidebar: ${String(action.type)}${action.fromFeature ? `, sent from: ${action.fromFeature}` : ''}`
})
const middleware = [appShellSyncWithHomeMiddleware, appShellSyncWithGlobalNavMiddleware, sagaMiddleware]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(reduxFreeze)
  middleware.push(logger)
}

const createStoreWithMiddleware = composeWithDevTools({ name: 'InVision Sidebar' })

// This is a temporary reference just for the caching
// being able to access feature flag data
export const storeRef = { current: null }

export default function configureStore (initialState) {
  const reducers = combineReducers(allReducers)
  const store = createStore(reducers, initialState, createStoreWithMiddleware(applyMiddleware(...middleware)))
  sagaMiddleware.run(sagas)

  storeRef.current = store

  return store
}
