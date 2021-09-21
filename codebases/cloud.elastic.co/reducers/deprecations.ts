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

import { FETCH_DEPRECATIONS, FETCH_DEPRECATIONS_ASSISTANT } from '../constants/actions'
import { AsyncAction, DeprecationsResponse, VersionNumber } from '../types'

interface Action extends AsyncAction<typeof FETCH_DEPRECATIONS, DeprecationsResponse> {
  meta: {
    regionId: string
    clusterId: string
    version: VersionNumber
  }
}

export interface State {
  [versionAndResourceId: string]: DeprecationsResponse
}

export default function deprecationsReducer(state: State = {}, action: Action): State {
  if ([FETCH_DEPRECATIONS, FETCH_DEPRECATIONS_ASSISTANT].includes(action.type)) {
    if (!action.error && action.payload) {
      const {
        meta: { regionId, clusterId, version },
        payload,
      } = action

      return {
        ...state,
        [createDescriptor(regionId, clusterId, version)]: payload,
      }
    }
  }

  return state
}

export function getDeprecations(
  state: State,
  regionId: string,
  clusterId: string,
  version: VersionNumber,
): DeprecationsResponse | undefined {
  return state[createDescriptor(regionId, clusterId, version)]
}

function createDescriptor(regionId: string, clusterId: string, version: VersionNumber): string {
  return `${regionId}/${clusterId}/${version}`
}
