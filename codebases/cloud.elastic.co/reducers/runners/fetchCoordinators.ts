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

import { FETCH_COORDINATOR_CANDIDATES } from '../../constants/actions'
import { AsyncAction, V0_1_FetchCoordinatorsResponse, V0_1_CoordinatorCandidate } from '../../types'
import { CoordinatorCandidate } from './types'

export { CoordinatorCandidate }

function createCoordinatorCandidates(v0_1_candidates: {
  [runnerId: string]: V0_1_CoordinatorCandidate
}) {
  const candidates: { [runnerId: string]: CoordinatorCandidate } = {}

  // The "ip" is probably the runner ID, but in the past we used IPs for runner IDs.
  for (const ip of Object.keys(v0_1_candidates)) {
    const candidate = v0_1_candidates[ip]

    candidates[ip] = {
      ip,
      id: candidate.id,
      name: candidate.name,
      hostname: candidate.public_hostname,
      accepted: candidate.accepted,
    }
  }

  return candidates
}

export interface State {
  [regionId: string]: {
    [runnerId: string]: CoordinatorCandidate
  }
}

interface FetchCoordinatorAction
  extends AsyncAction<typeof FETCH_COORDINATOR_CANDIDATES, V0_1_FetchCoordinatorsResponse> {
  meta: { regionId: string }
}

export default function coordinatorCandidatesReducer(
  state: State = {},
  action: FetchCoordinatorAction,
): State {
  if (action.type === FETCH_COORDINATOR_CANDIDATES && !action.error && action.payload) {
    const { regionId } = action.meta
    return {
      ...state,
      [regionId]: createCoordinatorCandidates(action.payload.candidates),
    }
  }

  return state
}

export const getCoordinatorById = (state, regionId, runnerId) => {
  const byRegion = state[regionId]

  return byRegion ? byRegion[runnerId] : undefined
}
