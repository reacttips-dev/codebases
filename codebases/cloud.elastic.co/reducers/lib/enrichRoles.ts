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

import { forEach } from 'lodash'

import { RunnerRole } from '../../types'

interface LegacyRunnerRoles {
  [roleName: string]: { isRemovable?: boolean }
}

export const enrichRoles = (roles: RunnerRole[]) =>
  roles.map((value) => {
    value.isRemovable = isRoleRemovable(value.role_name)
    return value
  })

// Since we use the RunnerRole type for data from the v1 API, this
// is temporary to handle usages from `search` that is still on v.01
export const enrichRolesLegacy = (roles: LegacyRunnerRoles) =>
  forEach(roles, (value, role) => {
    value.isRemovable = isRoleRemovable(role)
  })

export const isRoleRemovable = (role: string) =>
  !(role === `services-forwarder` || role === `beats-runner`)
