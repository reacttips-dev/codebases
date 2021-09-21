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

import { CLEAR_APM_TOKEN, RESET_APM_TOKEN } from '../../constants/actions'

import { ApmId, RegionId } from '../../types'

type State = { [apmId: string]: string | null }

type FetchApmAction = {
  type: typeof RESET_APM_TOKEN | typeof CLEAR_APM_TOKEN
  error?: string
  meta: {
    regionId: RegionId
    apmId: ApmId
  }
  payload: {
    apmId: string
    secret_token: string
  }
}

type Action = FetchApmAction

function createDescriptor(regionId, apmId) {
  return `${regionId}/${apmId}`
}

export default function apmTokensReducer(state: State = {}, action: Action) {
  const { type, payload, error, meta } = action

  if (type === CLEAR_APM_TOKEN) {
    return {
      ...state,
      [createDescriptor(meta.regionId, meta.apmId)]: null,
    }
  }

  if (type === RESET_APM_TOKEN) {
    if (!error && payload) {
      return {
        ...state,
        [createDescriptor(meta.regionId, meta.apmId)]: payload.secret_token,
      }
    }
  }

  return state
}

export function getApmToken(state: State, regionId: RegionId, apmId: ApmId): string | null {
  return state[createDescriptor(regionId, apmId)]
}
