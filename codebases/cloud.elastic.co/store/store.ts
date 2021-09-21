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

import { Store } from 'redux'

import { setConfig as setConfigAction } from '../actions/config'

import getConfig, { setConfig } from '../lib/configStore'

import { getRawConfig } from '../reducers/config'

import Feature from '../lib/feature'
import { CloudAppConfig, ReduxState } from '../types'

let _store: Store<ReduxState> | null = null

// Used in test scenarios to utilize mock store with side-car approach of `getReduxState()`
export function setStore(
  store: Store<ReduxState> | null,
  {
    propagateConfig = false,
  }: {
    propagateConfig?: boolean
  } = {},
) {
  _store = store

  // `propagateConfig` is only meant to be set in tests, for easier setup
  if (propagateConfig === false) {
    return
  }

  if (store === null) {
    setConfig({})
    return
  }

  const state = store.getState()
  const config = getRawConfig(state)

  if (config === undefined) {
    return // sanity
  }

  store.dispatch(setConfigAction(config))
}

export function getReduxState(): ReduxState {
  if (_store) {
    return _store.getState()
  }

  // Yes, this isn't a populated state, but it's just to avoid code exploding on null
  return {} as ReduxState
}

export function isFeatureActivated(feature: Feature) {
  return Boolean(getConfigForKey(feature))
}

export function getConfigForKey<TValue = string>(
  key: Feature | keyof CloudAppConfig,
): TValue | null {
  const appConfig = getConfig()
  return getConfigForKeyFrom(appConfig, key)
}

export function getConfigForKeyFrom<TValue = string>(
  config: CloudAppConfig,
  key: Feature | keyof CloudAppConfig,
): TValue | null {
  if (!config) {
    return null
  }

  const value = config[key]

  if (value === undefined) {
    return null
  }

  return value as unknown as TValue
}
