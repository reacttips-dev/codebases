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

import { FETCH_RUNNER } from '../../constants/actions'

import { AsyncAction, RegionId, Runner } from '../../types/'
import { RunnerInfo } from '../../lib/api/v1/types'
import { isRoleRemovable } from '../lib/enrichRoles'

export interface State {
  [descriptor: string]: Runner
}

interface FetchAction extends AsyncAction<typeof FETCH_RUNNER, RunnerInfo> {
  meta: {
    regionId: RegionId
    runnerId: string
  }
}

function createDescriptor(regionId: string, runnerId: string) {
  return `${regionId}/${runnerId}`
}

export function reduceRunner(regionId: string, runner: RunnerInfo): Runner {
  return {
    ...runner,
    roles: runner.roles.map((role) => ({ ...role, isRemovable: isRoleRemovable(role.role_name) })),
    regionId,
  }
}

export default function runnersReducer(runners: State = {}, action: FetchAction): State {
  if (action.type !== FETCH_RUNNER) {
    return runners
  }

  if (action.error || !action.payload) {
    return runners
  }

  const {
    payload,
    meta: { runnerId, regionId },
  } = action

  const descriptor = createDescriptor(regionId, runnerId)

  return {
    ...runners,
    [descriptor]: reduceRunner(regionId, payload),
  }
}

export function getRunner(state: State, regionId: RegionId, runnerId: string) {
  return state[createDescriptor(regionId, runnerId)]
}
