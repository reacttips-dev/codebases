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
  FETCH_RUNNER_LOGGING_SETTINGS,
  PATCH_RUNNER_LOGGING_SETTINGS,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { LoggingSettings } from '../../lib/api/v1/types'

export type State = {
  [crumbs: string]: LoggingSettings
}

export default function runnerLoggingSettingsReducer(state: State = {}, action) {
  if (action.type === FETCH_RUNNER_LOGGING_SETTINGS) {
    if (!action.error && action.payload) {
      const { regionId, runnerId } = action.meta

      return replaceIn(state, [getCrumbs(regionId, runnerId)], action.payload)
    }
  }

  if (action.type === PATCH_RUNNER_LOGGING_SETTINGS) {
    if (!action.error && action.payload) {
      const { regionId, runnerId } = action.meta

      return replaceIn(state, [getCrumbs(regionId, runnerId)], action.payload)
    }
  }

  return state
}

export function getRunnerLoggingSettings(
  state: State,
  regionId: string,
  runnerId: string,
): LoggingSettings | null {
  return state[getCrumbs(regionId, runnerId)] || null
}

function getCrumbs(regionId: string, runnerId: string): string {
  return `${regionId}/${runnerId}`
}
