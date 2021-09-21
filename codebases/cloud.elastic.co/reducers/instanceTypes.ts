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

import { FETCH_INSTANCE_TYPES } from '../constants/actions'
import { InstanceTypeResource } from '../lib/api/v1/types'
import { AsyncAction, RegionId } from '../types'

interface Action extends AsyncAction<typeof FETCH_INSTANCE_TYPES, InstanceTypeResource[]> {
  meta: {
    regionId: RegionId
  }
}

export interface State {
  [regionId: string]: InstanceTypeResource[]
}

export default function instanceTypesReducer(state: State = {}, action: Action): State {
  if (action.type === FETCH_INSTANCE_TYPES) {
    if (!action.error && action.payload) {
      const {
        meta: { regionId },
        payload,
      } = action

      return {
        ...state,
        [regionId]: payload,
      }
    }
  }

  return state
}

export function getInstanceTypes(state: State, regionId: RegionId) {
  return state[regionId]
}
