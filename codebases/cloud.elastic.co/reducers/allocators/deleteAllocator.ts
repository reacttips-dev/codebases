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

import { DELETE_ALLOCATOR } from '../../constants/actions'
import { RegionId } from '../../types'

export interface DeleteAllocatorState {
  isDeleting?: boolean
  isDeleted?: boolean
  error?: Error
}

export interface State {
  [descriptor: string]: DeleteAllocatorState
}

interface DeleteAction {
  type: typeof DELETE_ALLOCATOR
  error?: boolean
  meta: {
    regionId: string
    ip: string
  }
}

type SuccessAction = DeleteAction & { payload?: any }
type ErrorAction = DeleteAction & { payload?: Error }
type Action = SuccessAction | ErrorAction

const initialDeleteAllocatorState: DeleteAllocatorState = {
  isDeleting: false,
  error: undefined,
  isDeleted: false,
}

const isSuccess = (action: Action): action is SuccessAction => !action.error && !!action.payload

const isError = (action: Action): action is ErrorAction => !!action.error

function deleteAllocatorReducer(
  deleteAllocatorState: DeleteAllocatorState = initialDeleteAllocatorState,
  action: Action,
): DeleteAllocatorState {
  if (action.type !== DELETE_ALLOCATOR) {
    return deleteAllocatorState
  }

  if (isError(action)) {
    return {
      ...deleteAllocatorState,
      isDeleting: false,
      error: action.payload,
    }
  }

  if (isSuccess(action)) {
    return {
      ...deleteAllocatorState,
      isDeleting: false,
      error: undefined,
      isDeleted: true,
    }
  }

  return {
    ...deleteAllocatorState,
    isDeleting: true,
  }
}

function createDescriptor(regionId: RegionId, allocatorId: string): string {
  return `${regionId}/${allocatorId}`
}

export default function deleteAllocatorsReducer(allocators: State = {}, action: Action): State {
  if (action.type !== DELETE_ALLOCATOR) {
    return allocators
  }

  const { regionId, ip } = action.meta
  const descriptor = createDescriptor(regionId, ip)

  return {
    ...allocators,
    [descriptor]: deleteAllocatorReducer(allocators[descriptor], action),
  }
}

export function getDeleteAllocatorInformation(
  state: State,
  regionId: RegionId,
  allocatorId: string,
): DeleteAllocatorState | undefined {
  return state[createDescriptor(regionId, allocatorId)]
}
