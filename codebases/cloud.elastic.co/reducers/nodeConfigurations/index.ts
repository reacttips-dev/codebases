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

import { keyBy, get } from 'lodash'

import { FETCH_NODE_CONFIGURATIONS } from '../../constants/actions'

import { fsMultiplierPath } from '../../config/nodeConfigurationPaths'

import { AsyncAction, NodeTypeOverrides, NodeTypesApiResponse, RegionId } from '../../types'

export interface State {
  [regionId: string]: {
    [id: string]: NodeConfigurationState
  }
}

export interface NodeConfigurationState {
  regionId: string
  id: string
  isDefault: boolean
  _source: Pick<NodeTypeOverrides, 'overrides'>
  overrides: { diskToMemoryRatio: number }
  hrefs: { update: string; remove: string }
}

export interface FetchNodeConfigurationsAction
  extends AsyncAction<typeof FETCH_NODE_CONFIGURATIONS, NodeTypesApiResponse> {
  meta: { regionId: RegionId; selfUrl: string }
}

function createOverrides(nodeConfiguration) {
  const diskToMemoryRatio = parseInt(get(nodeConfiguration, fsMultiplierPath), 10)

  return {
    diskToMemoryRatio,
  }
}

function createNodeConfiguration(
  rawNodeConfiguration: NodeTypeOverrides,
  regionId: string,
  selfUrl: string,
): NodeConfigurationState {
  const id = rawNodeConfiguration.node_type_id
  const hrefs = {
    update: `${selfUrl}/${id}`,
    remove: `${selfUrl}/${id}`,
  }
  const overrides = createOverrides(rawNodeConfiguration)

  return {
    regionId,
    id,
    isDefault: id === `default`,
    _source: {
      overrides: rawNodeConfiguration.overrides,
    },
    overrides,
    hrefs,
  }
}

function nodeConfigurationReducer(action: FetchNodeConfigurationsAction) {
  const { regionId, selfUrl } = action.meta

  const nodeConfigurations = action.payload!.node_types.map((nodeConfiguration) =>
    createNodeConfiguration(nodeConfiguration, regionId, selfUrl),
  )

  return keyBy(nodeConfigurations, `id`)
}

export default function nodeConfigurationsReducer(
  nodeConfigurations: State = {},
  action: FetchNodeConfigurationsAction,
): State {
  if (action.type === FETCH_NODE_CONFIGURATIONS) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta

      return {
        ...nodeConfigurations,
        [regionId]: nodeConfigurationReducer(action),
      }
    }
  }

  return nodeConfigurations
}

export const getByRegion = (state: State, regionId: RegionId) => state[regionId]

export const getById = (state: State, regionId: RegionId, nodeConfigurationId: string) => {
  const byRegion = getByRegion(state, regionId)

  return byRegion ? byRegion[nodeConfigurationId] : undefined
}
