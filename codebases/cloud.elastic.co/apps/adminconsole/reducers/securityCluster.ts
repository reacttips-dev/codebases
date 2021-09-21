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

import { AsyncAction, RegionId } from '../../../types'
import { ENABLE_SECURITY_CLUSTER, FETCH_SECURITY_CLUSTER } from '../constants/actions'
import { SecurityDeployment } from '../../../lib/api/v1/types'
import { replaceIn } from '../../../lib/immutability-helpers'

export type State = {
  [regionId: string]: SecurityDeployment
}

interface FetchSecurityClusterAction
  extends AsyncAction<typeof FETCH_SECURITY_CLUSTER, SecurityDeployment> {
  meta: { regionId: RegionId }
}

interface EnableSecurityClusterAction extends AsyncAction<typeof ENABLE_SECURITY_CLUSTER, unknown> {
  meta: { regionId: RegionId }
}

type Action = EnableSecurityClusterAction | FetchSecurityClusterAction

export default function reducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case FETCH_SECURITY_CLUSTER:
      if (action.error && get(action, ['payload', 'response', 'status']) === 404) {
        const newState = { ...state }
        delete newState[action.meta.regionId]
        return newState
      } else if (!action.error && action.payload) {
        return {
          ...state,
          [action.meta.regionId]: action.payload,
        }
      }

      return state

    case ENABLE_SECURITY_CLUSTER:
      if (!action.error && action.payload) {
        return replaceIn(state, [action.meta.regionId, `is_enabled`], true)
      }

      return state

    default:
      return state
  }
}

export const getSecurityCluster = (state: State, regionId: RegionId) => state[regionId]
