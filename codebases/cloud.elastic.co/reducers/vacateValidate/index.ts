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

import { VACATE_ALLOCATOR_VALIDATE } from '../../constants/actions'
import { AsyncAction } from '../../types'
import { MoveClustersCommandResponse } from '../../lib/api/v1/types'

export interface State {
  [regionAndAllocatorId: string]: MoveClustersCommandResponse
}

interface VacateAllocateValidateAction
  extends AsyncAction<typeof VACATE_ALLOCATOR_VALIDATE, MoveClustersCommandResponse> {
  meta: {
    regionId: string
    allocatorId: string
  }
}

export default function vacateAllocatorsReducer(
  allocators: State = {},
  action: VacateAllocateValidateAction,
): State {
  if (action.type !== VACATE_ALLOCATOR_VALIDATE) {
    return allocators
  }

  if (!action.error && action.payload) {
    const { regionId, allocatorId } = action.meta
    const descriptor = createDescriptor(regionId, allocatorId)

    return {
      ...allocators,
      [descriptor]: action.payload,
    }
  }

  return allocators
}

function createDescriptor(regionId: string, allocatorId: string): string {
  return `${regionId}/${allocatorId}`
}

export function getAllocatorVacateValidate(
  state: State,
  regionId: string,
  allocatorId: string,
): MoveClustersCommandResponse | undefined {
  return state[createDescriptor(regionId, allocatorId)]
}
