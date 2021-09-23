/* eslint-disable import/first */
import 'babel-polyfill'
// This needs to be imported before everything else to work properly
import './vendor/glamor-pxtorem'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyRouterMiddleware, browserHistory, Router } from 'react-router'
import useScroll from 'react-router-scroll/lib/useScroll'
import { persistStore } from 'redux-persist'
import { asyncLocalStorage } from 'redux-persist/storages'
import immutableTransform from 'redux-persist-transform-immutable'
import { syncHistoryWithStore } from 'react-router-redux'
import store from './store'

import './main.css'
import { addFeatureDetection, isIOS } from './lib/jello'
import MemoryStore from './lib/memory_store'
import { updateStrings as updateTimeAgoStrings } from './lib/time_ago_in_words'
import createRoutes from './routes'
import Honeybadger from 'honeybadger-js'
import './vendor/embetter'
import './vendor/embetter_initializer'
import * as ENV from '../env'

/* eslint-disable global-require */
// only use fastclick if we are on iOS
if (isIOS()) {
  require('react-fastclick')
}
/* eslint-enable global-require */

function shouldScroll(prevRouterProps, currentRouterProps) {
  const { location } = currentRouterProps
  if (location.action === 'PUSH' && location.query.submissionType) {
    return false
  }
  return location.action !== 'REPLACE'
}

if (ENV.HONEYBADGER_API_KEY && ENV.HONEYBADGER_ENVIRONMENT) {
  Honeybadger.configure({
    api_key: ENV.HONEYBADGER_API_KEY,
    environment: ENV.HONEYBADGER_ENVIRONMENT,
  })
}

updateTimeAgoStrings({ about: '' })

const APP_VERSION = '4.0.0'

const createSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS
  return (state) => {
    const routingState = state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: createSelectLocationState(),
})
const routes = createRoutes(store)
const element = (
  <Provider store={store}>
    <Router
      history={history}
      render={applyRouterMiddleware(useScroll(shouldScroll))}
      routes={routes}
    />
  </Provider>
)

const whitelist = ['authentication', 'editor', 'gui', 'profile']

const launchApplication = (storage, hasLocalStorage = false) => {
  addFeatureDetection()
  const persistor = persistStore(store, {
    storage,
    transforms: [immutableTransform()],
    whitelist,
  }, () => {
    const root = document.getElementById('root')
    ReactDOM.render(element, root)
  })

  // check and update current version and only kill off the persisted reducers
  // due to the async nature of the default storage we need to check against the
  // real localStorage to determine if we should purge to avoid a weird race condition
  if (hasLocalStorage) {
    const lastVersion = localStorage.getItem('APP_VERSION')
    if (lastVersion !== APP_VERSION) {
      persistor.purge(['editor', 'json', 'profile'])
      storage.setItem('APP_VERSION', APP_VERSION, () => {})
    }
  } else {
    storage.getItem('APP_VERSION', (error, result) => {
      if (result && result !== APP_VERSION) {
        persistor.purge(['editor', 'json', 'profile'])
        storage.setItem('APP_VERSION', APP_VERSION, () => {})
      }
    })
  }
}

// this will fail in a safari private window
function isLocalStorageSupported() {
  const testKey = 'test-localStorage'
  const storage = window.localStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

if (isLocalStorageSupported()) {
  // use localStorage as indexedDB seems to
  // have issues in chrome and firefox private
  launchApplication(asyncLocalStorage, true)
} else {
  // localStorage fails, use an in-memory store
  launchApplication(MemoryStore)
}

