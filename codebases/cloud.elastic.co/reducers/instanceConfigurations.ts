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

import {
  FETCH_INSTANCE_CONFIGURATION,
  FETCH_INSTANCE_CONFIGURATIONS,
  CLEAR_INSTANCE_CONFIGURATIONS,
} from '../constants/actions'

import { replaceIn } from '../lib/immutability-helpers'
import { InstanceConfiguration } from '../lib/api/v1/types'
import { Action as BasicAction, AsyncAction, RegionId } from '../types'

export interface State {
  [regionId: string]: InstanceConfiguration[]
}

interface FetchInstanceConfigurationsAction
  extends AsyncAction<typeof FETCH_INSTANCE_CONFIGURATIONS, InstanceConfiguration[]> {
  meta: { regionId: RegionId }
}

interface FetchInstanceConfigurationAction
  extends AsyncAction<typeof FETCH_INSTANCE_CONFIGURATION, InstanceConfiguration> {
  meta: { regionId: RegionId; id: string }
}

interface ClearInstanceConfigurations extends BasicAction<typeof CLEAR_INSTANCE_CONFIGURATIONS> {
  meta: { regionId: RegionId }
}

type Action =
  | FetchInstanceConfigurationsAction
  | FetchInstanceConfigurationAction
  | ClearInstanceConfigurations

export default function instanceConfigurationsReducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case FETCH_INSTANCE_CONFIGURATION: {
      if (!action.error && action.payload) {
        const { regionId, id } = action.meta

        if (!state[regionId]) {
          return replaceIn(state, [regionId], [action.payload])
        }

        const existingIndex = state[regionId].findIndex(
          (instanceConfiguration) => instanceConfiguration.id === id,
        )

        if (existingIndex === -1) {
          return replaceIn(state, [regionId], [...state[regionId], action.payload])
        }

        return replaceIn(state, [regionId, String(existingIndex)], action.payload)
      }

      break
    }

    case FETCH_INSTANCE_CONFIGURATIONS: {
      if (!action.error && action.payload) {
        const { regionId } = action.meta
        return replaceIn(state, [regionId], action.payload)
      }

      break
    }

    case CLEAR_INSTANCE_CONFIGURATIONS: {
      const { regionId } = action.meta
      return replaceIn(state, [regionId], undefined)
    }

    default:
      break
  }

  return state
}

export function getInstanceConfigurations(state: State, regionId: RegionId) {
  return state[regionId]
}

export function getInstanceConfiguration(state: State, regionId: RegionId, id: string) {
  const configs = state[regionId]

  return configs && configs.find((config) => config.id === id)
}
