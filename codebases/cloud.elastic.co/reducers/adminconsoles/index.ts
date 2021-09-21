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

import { FETCH_ADMINCONSOLES } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { AdminconsolesOverview } from '../../lib/api/v1/types'

type RegionState = AdminconsolesOverview | null

export type State = {
  [regionId: string]: RegionState
}

export default function adminconsolesReducer(state: State = {}, action) {
  if (action.type === FETCH_ADMINCONSOLES) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta

      return replaceIn(state, [regionId], action.payload)
    }
  }

  return state
}

export function getAdminconsoles(state: State, regionId: string): RegionState {
  return state[regionId] || null
}
