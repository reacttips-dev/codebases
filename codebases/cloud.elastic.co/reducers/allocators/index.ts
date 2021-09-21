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

import createAllocator from './createAllocator'

import { ADD_ALLOCATOR_TAG, FETCH_ALLOCATOR, REMOVE_ALLOCATOR_TAG } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { Allocator, AsyncAction, RegionId } from '../../types'
import { AllocatorInfo, MetadataItem } from '../../lib/api/v1/types'

export interface State {
  [descriptor: string]: Allocator
}

interface FetchAction extends AsyncAction<typeof FETCH_ALLOCATOR, AllocatorInfo> {
  meta: {
    regionId: string
    ip: string
    selfUrl: string
  }
}

interface AddTagAction extends AsyncAction<typeof ADD_ALLOCATOR_TAG, MetadataItem[]> {
  meta: {
    regionId: RegionId
    ip: string
    id: string
  }
}

interface RemoveTagAction extends AsyncAction<typeof REMOVE_ALLOCATOR_TAG, MetadataItem[]> {
  meta: {
    regionId: RegionId
    ip: string
    id: string
  }
}

type Action = FetchAction | AddTagAction | RemoveTagAction

const initialState: State = {}

function allocatorReducer(state: Allocator, action: Action): Allocator {
  if (action.type === FETCH_ALLOCATOR) {
    if (!action.error && action.payload) {
      const { regionId, ip, selfUrl } = action.meta

      return createAllocator(regionId, ip, selfUrl, action.payload)
    }
  }

  if (
    (action.type === ADD_ALLOCATOR_TAG || action.type === REMOVE_ALLOCATOR_TAG) &&
    !action.error &&
    action.payload
  ) {
    return replaceIn(state, [`tags`], action.payload)
  }

  return state
}

function createDescriptor(regionId: RegionId, allocatorId: string): string {
  return `${regionId}/${allocatorId}`
}

export default function allocatorsReducer(allocators = initialState, action: Action): State {
  if (
    action.type !== FETCH_ALLOCATOR &&
    action.type !== ADD_ALLOCATOR_TAG &&
    action.type !== REMOVE_ALLOCATOR_TAG
  ) {
    return allocators
  }

  const { regionId, ip } = action.meta
  const descriptor = createDescriptor(regionId, ip)

  return {
    ...allocators,
    [descriptor]: allocatorReducer(allocators[descriptor], action),
  }
}

export function getAllocator(state, regionId, allocatorId): Allocator | undefined {
  return state[createDescriptor(regionId, allocatorId)]
}
