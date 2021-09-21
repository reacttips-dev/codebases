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

import { DEMOTE_COORDINATOR } from '../../constants/actions'
import { AsyncAction, DemoteApiResponse, DemoteRecord, RegionId } from '../../types'
import { replaceIn } from '../../lib/immutability-helpers'

export interface State {
  [regionId: string]: {
    [runnerId: string]: DemoteRecord
  }
}

interface DemoteAction extends AsyncAction<typeof DEMOTE_COORDINATOR, DemoteApiResponse> {
  meta: {
    regionId: RegionId
    runnerId: string
  }
}

export const getDemoteCoordinator = (state: State, regionId: RegionId, runnerId: string) => {
  const byRegion = state[regionId]

  return byRegion ? byRegion[runnerId] : undefined
}

export default function demoteCoordinatorsReducer(state: State = {}, action: DemoteAction): State {
  if (action.type === DEMOTE_COORDINATOR && action.payload) {
    const {
      meta: { regionId, runnerId },
      payload: { demoted, message },
    } = action

    return replaceIn(state, [regionId, runnerId], {
      isDemoted: demoted,
      error: demoted ? undefined : message,
    })
  }

  return state
}
