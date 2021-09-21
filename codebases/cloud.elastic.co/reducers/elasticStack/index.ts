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
import { StackVersionConfig } from '../../lib/api/v1/types'
import { RegionId, VersionNumber } from '../../types'

import versions from './versions'
import whitelist from './whitelist'
import { VersionsState, WhitelistState } from './stackTypes'

export interface State {
  stackVersions: VersionsState
  whitelist: WhitelistState
}

// @ts-ignore
export default combineReducers<State>({ stackVersions: versions, whitelist })

export function getVersionStacks(state: State, regionId: RegionId) {
  return state.stackVersions[regionId]
}

export function getVersionStack(
  state: State,
  regionId: RegionId,
  version: VersionNumber,
): StackVersionConfig | undefined {
  const allVersions = state.stackVersions[regionId] || []

  return allVersions.find((v) => v.version === version)
}

export function getVersionWhitelist(state: State, regionId: RegionId): string[] | null {
  return state.whitelist[regionId] ? state.whitelist[regionId] : []
}
