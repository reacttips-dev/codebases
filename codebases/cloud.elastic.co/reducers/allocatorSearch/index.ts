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

import { flatMap, mapValues } from 'lodash'

import { SEARCH_ALLOCATORS, ADD_ALLOCATOR_TAG, REMOVE_ALLOCATOR_TAG } from '../../constants/actions'

import {
  AllocatorInfo,
  AllocatedInstanceStatus,
  AllocatorOverview,
  MetadataItem,
} from '../../lib/api/v1/types'
import { replaceIn } from '../../lib/immutability-helpers'
import { AllocatorSearchInstance, AllocatorSearchResult, AsyncAction } from '../../types'

export interface State {
  [regionQueryDescriptor: string]: AllocatorSearchResult[]
}

interface SearchAction extends AsyncAction<typeof SEARCH_ALLOCATORS, AllocatorOverview> {
  meta: {
    regionId: string
    queryId: string
  }
}

interface AddTagAction extends AsyncAction<typeof ADD_ALLOCATOR_TAG, MetadataItem[]> {
  meta: {
    id: string
  }
}

interface RemoveTagAction extends AsyncAction<typeof REMOVE_ALLOCATOR_TAG, MetadataItem[]> {
  meta: {
    id: string
    ip: string
  }
}

type Action = SearchAction | AddTagAction | RemoveTagAction

export default function allocatorSearchReducer(state: State = {}, action: Action): State {
  if (action.type === SEARCH_ALLOCATORS) {
    if (!action.error && action.payload) {
      const { regionId, queryId } = action.meta
      const allocators = flatMap(action.payload.zones, `allocators`)

      const searchResult = allocators.map((allocator) => createAllocator(regionId, allocator))

      return {
        ...state,
        [getId(regionId, queryId)]: searchResult,
      }
    }
  }

  if (
    (action.type === ADD_ALLOCATOR_TAG || action.type === REMOVE_ALLOCATOR_TAG) &&
    !action.error &&
    action.payload
  ) {
    return updateAllResults(state, setAllocatorTags(action.meta.id, action.payload))
  }

  return state
}

export const getResults = (state: State, regionId: string, queryId: string) =>
  state[getId(regionId, queryId)]

function getId(regionId, queryId) {
  return `${regionId}/${queryId}`
}

function createAllocator(regionId: string, allocator: AllocatorInfo): AllocatorSearchResult {
  const connected = allocator.status ? allocator.status.connected : false

  return {
    regionId,
    id: allocator.allocator_id,
    zoneId: allocator.zone_id,
    hostIp: allocator.host_ip,
    publicHostname: allocator.public_hostname,
    instances: allocator.instances.map(createAllocatorInstance),
    connected,
    healthy: connected || allocator.instances.length === 0,
    enabledFeatures: allocator.features || [],
    tags: allocator.metadata,
    settings: allocator.settings,
    memoryCapacity: allocator.capacity.memory,
    isInMaintenanceMode: allocator.status ? allocator.status.maintenance_mode === true : false,
    externalLinks: allocator.external_links || [],
  }
}

function createAllocatorInstance(instance: AllocatedInstanceStatus): AllocatorSearchInstance {
  return {
    clusterId: instance.cluster_id,
    name: instance.instance_name,
    kind: instance.cluster_type,
    memoryCapacity: instance.node_memory,
    stackDeploymentId: instance.deployment_id,
  }
}

function updateAllResults(
  state: State,
  getAllocatorState: (each: AllocatorSearchResult) => AllocatorSearchResult,
) {
  return mapValues(state, (allocators) => allocators.map(getAllocatorState))
}

function setAllocatorTags(allocatorId, tags) {
  return (state: AllocatorSearchResult): AllocatorSearchResult => {
    if (state.id !== allocatorId) {
      return state
    }

    return replaceIn(state, [`tags`], tags)
  }
}
