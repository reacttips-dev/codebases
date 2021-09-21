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

import { FETCH_ACTIVE_DIRECTORY_SETTINGS } from '../constants/actions'

import { ActiveDirectorySettings } from '../../../lib/api/v1/types'
import { AsyncAction, RegionId } from '../../../types'

export interface State {
  [id: string]: ActiveDirectorySettings
}

interface FetchActiveDirectoryProvider
  extends AsyncAction<typeof FETCH_ACTIVE_DIRECTORY_SETTINGS, ActiveDirectorySettings> {
  meta: {
    regionId: RegionId
    realmId: string
  }
}

type Action = FetchActiveDirectoryProvider

export default function activeDirectoryAuthProvidersReducer(
  state: State = {},
  action: Action,
): State {
  if (action.type === FETCH_ACTIVE_DIRECTORY_SETTINGS) {
    if (!action.error && action.payload) {
      const { regionId, realmId } = action.meta
      return {
        ...state,
        [`${regionId}/${realmId}`]: action.payload,
      }
    }
  }

  return state
}

export function getActiveDirectoryAuthProvider(
  state: State,
  regionId: RegionId,
  realmId: string,
): ActiveDirectorySettings | undefined {
  return state[`${regionId}/${realmId}`]
}
