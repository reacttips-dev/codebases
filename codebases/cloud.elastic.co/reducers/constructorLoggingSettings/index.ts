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

import {
  FETCH_CONSTRUCTOR_LOGGING_SETTINGS,
  PATCH_CONSTRUCTOR_LOGGING_SETTINGS,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { LoggingSettings } from '../../lib/api/v1/types'

export type State = {
  [crumbs: string]: LoggingSettings
}

export default function constructorLoggingSettingsReducer(state: State = {}, action) {
  if (action.type === FETCH_CONSTRUCTOR_LOGGING_SETTINGS) {
    if (!action.error && action.payload) {
      const { regionId, constructorId } = action.meta

      return replaceIn(state, [getCrumbs(regionId, constructorId)], action.payload)
    }
  }

  if (action.type === PATCH_CONSTRUCTOR_LOGGING_SETTINGS) {
    if (!action.error && action.payload) {
      const { regionId, constructorId } = action.meta

      return replaceIn(state, [getCrumbs(regionId, constructorId)], action.payload)
    }
  }

  return state
}

export function getConstructorLoggingSettings(
  state: State,
  regionId: string,
  constructorId: string,
): LoggingSettings | null {
  return state[getCrumbs(regionId, constructorId)] || null
}

function getCrumbs(regionId: string, constructorId: string): string {
  return `${regionId}/${constructorId}`
}
