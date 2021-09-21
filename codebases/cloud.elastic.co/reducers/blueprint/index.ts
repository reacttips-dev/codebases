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

import { combineReducers } from 'redux'

import roles, { State as RolesState } from './roles'
import { RegionId } from '../../types'

export interface State {
  roles: RolesState
}

export default combineReducers<State>({
  // @ts-ignore The redux types expect type definitions in terms of its own `Action` type
  roles,
})

export function getRoles(state: RolesState, regionId: RegionId) {
  return state[regionId]
}
