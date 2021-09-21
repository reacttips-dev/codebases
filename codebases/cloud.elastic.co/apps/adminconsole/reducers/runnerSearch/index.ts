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

import { SEARCH_RUNNERS } from '../../../../constants/actions'
import { RunnerInfo, RunnerOverview } from '../../../../lib/api/v1/types'
import { AsyncAction, Runner } from '../../../../types'
import { isRoleRemovable } from '../../../../reducers/lib/enrichRoles'

export interface State {
  [regionQueryDescriptor: string]: Runner[]
}

interface SearchRunnersAction extends AsyncAction<typeof SEARCH_RUNNERS, RunnerOverview> {
  meta: {
    regionId: string
    queryId: string
  }
}

type Action = SearchRunnersAction

function reduceRunner(regionId: string, runner: RunnerInfo): Runner {
  return {
    ...runner,
    roles: runner.roles.map((role) => ({ ...role, isRemovable: isRoleRemovable(role.role_name) })),
    regionId,
  }
}

export default function runnerSearchReducer(state: State = {}, action: Action): State {
  if (action.type === SEARCH_RUNNERS) {
    if (!action.error && action.payload) {
      const { regionId, queryId } = action.meta

      return {
        ...state,
        [getId(regionId, queryId)]: action.payload.runners.map((runner) =>
          reduceRunner(regionId, runner),
        ),
      }
    }
  }

  return state
}

export const getRunnerSearchResults = (state: State, regionId: string, queryId: string) =>
  state[getId(regionId, queryId)]

function getId(regionId, queryId) {
  return `${regionId}/${queryId}`
}
