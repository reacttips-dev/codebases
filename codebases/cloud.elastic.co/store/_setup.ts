/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

/* global module */

import { createStore, applyMiddleware, compose, StoreEnhancer } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'

import { setStore } from './store'

import { setConfig } from '../actions/config'
import { unauthorized } from '../actions/auth'

import { get as ajaxGet, post as ajaxPost } from '../lib/ajax'
import history from '../lib/history'

import createLogger from '../config/reduxLogger'

import unauthorizedMiddleware from '../middleware/unauthorized'

import { getReducers } from '../reducers'

import { CloudAppConfig, ReduxState } from '../types'

interface ConfigureStoreArgs {
  config?: CloudAppConfig
  initial?: ReduxState
}

export function configureStore({ config = {}, initial: preloadedState }: ConfigureStoreArgs = {}) {
  const reducers = getReducers(config)
  const store = createStore(reducers, preloadedState!, getEnhancer(config))

  store.dispatch(setConfig(config))

  if (config.NODE_ENV !== `production`) {
    setupDevelopmentAffordances()
  }

  setStore(store)

  return store

  function setupDevelopmentAffordances() {
    if (module.hot) {
      module.hot.accept([`../reducers`], () => store.replaceReducer(getReducers(config)))
    }

    // @ts-ignore
    window.ajaxGet = ajaxGet

    // @ts-ignore
    window.ajaxPost = ajaxPost
  }
}

function getEnhancer(config: CloudAppConfig): StoreEnhancer<ReduxState> {
  const enhancements = [getMiddleware(config)]

  // instrument with the dev tools if the browser extension is being used
  // @ts-ignore
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    // @ts-ignore
    enhancements.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }

  // @ts-ignore the TS defs don't seem to work here
  return compose(...enhancements)
}

function getMiddleware(config: CloudAppConfig) {
  const middleware = getBaseMiddleware()

  if (config.REDUX_LOGGER === true) {
    // log actions to the console as they occur
    middleware.push(createLogger())
  }

  return applyMiddleware(...middleware)
}

// Also used in test scenarios to replicate actual Redux store middleware
export function getBaseMiddleware() {
  return [
    // if user is logged in restore their login state,
    // otherwise redirect to the login page
    unauthorizedMiddleware(unauthorized),

    // for dispatching history actions
    routerMiddleware(history),

    // allow actions to operate asynchronously
    thunk,
  ]
}
