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
  GET_APP_SEARCH_READ_ONLY_MODE,
  SET_APP_SEARCH_READ_ONLY_MODE,
  WATCH_APP_SEARCH_MIGRATION_SNAPSHOT,
  START_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION,
  STOP_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncAction } from '../../types'

export interface AppSearchToEnterpriseSearchMigrationProgress {
  showUI?: boolean
  readOnlyEnabled?: boolean
  snapshotToWatch?: string
}

export interface State {
  [deploymentId: string]: AppSearchToEnterpriseSearchMigrationProgress
}

type Action =
  | AsyncAction<typeof GET_APP_SEARCH_READ_ONLY_MODE>
  | AsyncAction<typeof SET_APP_SEARCH_READ_ONLY_MODE>
  | AsyncAction<typeof WATCH_APP_SEARCH_MIGRATION_SNAPSHOT>
  | AsyncAction<typeof START_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION>
  | AsyncAction<typeof STOP_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION>

export default function appSearchToEnterpriseSearchMigrationProgressReducer(
  state: State = {},
  action: Action,
): State {
  const { deploymentId } = action.meta || {}

  switch (action.type) {
    case START_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION:
      return replaceIn(state, [deploymentId, `showUI`], true)

    case STOP_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION:
      return replaceIn(state, [deploymentId, `showUI`], false)

    case GET_APP_SEARCH_READ_ONLY_MODE: {
      if (!action.error && action.payload) {
        return replaceIn(state, [deploymentId, `readOnlyEnabled`], action.payload.enabled)
      }

      break
    }

    case SET_APP_SEARCH_READ_ONLY_MODE: {
      if (!action.error && action.payload) {
        return replaceIn(
          replaceIn(state, [deploymentId, `snapshotToWatch`], undefined), // clear out any taken snapshot explicitly
          [deploymentId, `readOnlyEnabled`],
          action.payload.enabled,
        )
      }

      break
    }

    case WATCH_APP_SEARCH_MIGRATION_SNAPSHOT:
      return replaceIn(state, [deploymentId, `snapshotToWatch`], action.payload)

    default:
      break
  }

  return state
}

export function getAppSearchToEnterpriseSearchMigrationProgress(
  state: State,
  deploymentId: string,
): AppSearchToEnterpriseSearchMigrationProgress | undefined {
  return state[deploymentId]
}
