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

import { FETCH_BLUEPRINT_ROLES } from '../../constants/actions'
import { isRoleRemovable } from '../lib/enrichRoles'
import { AsyncAction, RegionRolesState } from '../../types'
import { RoleAggregate, RoleAggregates } from '../../lib/api/v1/types'

export interface State {
  [regionId: string]: RegionRolesState[]
}

interface FetchBlueprintRoles extends AsyncAction<typeof FETCH_BLUEPRINT_ROLES, RoleAggregates> {
  meta: {
    regionId: string
    selfUrl: string
  }
}

function createRole(role: RoleAggregate) {
  const pendingRunners = role.pending
    ? Object.keys(role.pending.value.runner_ids_to_pending_state)
    : []

  const roleId = role.role.value.id

  const roleState: RegionRolesState = {
    id: roleId,

    // don't show services-forwarder as a role that can be removed
    // because otherwise the runner can't communicate with ZooKeeper,
    // don't show beats-runner as a role that can be removed because
    // otherwise the runner won't have any logs or metrics stored.
    isRemovable: isRoleRemovable(roleId),
    containers: role.role.value.containers,
    pending: {
      runners: pendingRunners,
    },
  }

  return roleState
}

export default function rolesByRegionReducer(
  state: State = {},
  action: FetchBlueprintRoles,
): State {
  if (action.type === FETCH_BLUEPRINT_ROLES) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta

      return {
        ...state,
        [regionId]: action.payload.values.map(createRole),
      }
    }
  }

  return state
}
