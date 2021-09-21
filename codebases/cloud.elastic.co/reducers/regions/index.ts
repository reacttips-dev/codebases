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

import regionsReducer, {
  getRegion as getRegionFromList,
  getRegionIds as getRegionIdsFromList,
} from './list'

import settingsReducer, {
  getRegionSettings as getRegionSettingsById,
  State as SettingsState,
} from './settings'

import constructorsReducer, { getConstructors, State as ConstructorsState } from './constructors'

import { State as ListState } from './types'

export type State = {
  list: ListState
  settings: SettingsState
  constructors: ConstructorsState
}

export function getRegion(state, regionId) {
  return getRegionFromList(state.list, regionId)
}

export function getRegionIds(state) {
  return getRegionIdsFromList(state.list)
}

export function getRegionSettings(state, regionId) {
  return getRegionSettingsById(state.settings, regionId)
}

export function getRegionConstructors(state, regionId) {
  return getConstructors(state.constructors, regionId)
}

export default combineReducers<State>({
  list: regionsReducer,
  settings: settingsReducer,
  constructors: constructorsReducer,
})
