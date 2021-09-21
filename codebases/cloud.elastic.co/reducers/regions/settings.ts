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

import { omit } from 'lodash'
import createRegionSettings from './createRegionSettings'
import {
  DELETE_REGION_SETTING,
  FETCH_REGION_SETTINGS,
  SAVE_REGION_SETTING,
} from '../../constants/actions'
import { replaceIn, updateIn } from '../../lib/immutability-helpers'
import { RegionId } from '../../types'
import {
  ConfigStoreOption,
  ConfigStoreOptionData,
  ConfigStoreOptionList,
} from '../../lib/api/v1/types'

export type RegionSettings = {
  regionId: RegionId
  options: {
    [value: string]: ConfigStoreOption
  }
}

export type State = {
  [regionId: string]: RegionSettings
}

type FetchAction = {
  type: typeof FETCH_REGION_SETTINGS
  meta: {
    regionId: RegionId
  }
  error?: boolean
  payload?: ConfigStoreOptionList
}

type UpdateAction = {
  type: typeof SAVE_REGION_SETTING
  meta: {
    name: string
    regionId: RegionId
  }
  error?: boolean
  payload?: ConfigStoreOptionData
}

type DeleteAction = {
  type: typeof DELETE_REGION_SETTING
  meta: {
    regionId: RegionId
  }
  error?: boolean
  payload?: ConfigStoreOption
}

type Action = FetchAction | UpdateAction | DeleteAction

const initialState: State = {}

function regionSettingsReducer(state: RegionSettings, action: Action) {
  if (action.type === FETCH_REGION_SETTINGS && !action.error && action.payload) {
    const { regionId } = action.meta
    return createRegionSettings(regionId, action.payload)
  }

  if (action.type === SAVE_REGION_SETTING && action.payload && !action.error) {
    const { name } = action.meta
    const { value } = action.payload
    return replaceIn(state, [`options`, name, `value`], value)
  }

  if (action.type === DELETE_REGION_SETTING && action.payload && !action.error) {
    const { name } = action.payload
    return updateIn(state, [`options`], (options) => omit(options, name))
  }

  return state
}

export default function regionsSettingsReducer(state: State = initialState, action) {
  if (
    action.type === FETCH_REGION_SETTINGS ||
    action.type === SAVE_REGION_SETTING ||
    action.type === DELETE_REGION_SETTING
  ) {
    const { regionId } = action.meta

    return { ...state, [regionId]: regionSettingsReducer(state[regionId], action) }
  }

  return state
}

export function getRegionSettings(state: State, regionId: RegionId) {
  return state[regionId]
}
