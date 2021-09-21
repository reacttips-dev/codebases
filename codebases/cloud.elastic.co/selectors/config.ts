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

import { get } from 'lodash'

import Feature from '../lib/feature'

import { getRawConfig } from '../reducers/config'

import { CloudAppConfig, ReduxState } from '../types'

export const getConfig = getRawConfig

type ConfigKey = Feature | keyof CloudAppConfig

export const getConfigForKey = (state: ReduxState, key: ConfigKey | ConfigKey[]) =>
  get(getRawConfig(state), key)

export const isFeatureActivated = (state: ReduxState, feature: Feature) =>
  Boolean(getConfigForKey(state, feature))
