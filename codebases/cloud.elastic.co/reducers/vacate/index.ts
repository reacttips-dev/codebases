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

import { keyBy, flatten, values, mapValues } from 'lodash'

import { VACATE_ALLOCATOR } from '../../constants/actions'

import { AsyncAction, VacateItemCluster, VacateResult, SliderInstanceType } from '../../types'

import {
  BasicFailedReplyElement,
  MoveClustersCommandResponse,
  MoveClustersDetails,
} from '../../lib/api/v1/types'

export interface State {
  [descriptor: string]: VacateResult
}

interface Action extends AsyncAction<typeof VACATE_ALLOCATOR, MoveClustersCommandResponse> {
  meta: {
    regionId: string
    allocatorId: string
  }
}

type MoveAnyClustersDetails = {
  [key in keyof MoveClustersDetails]: MoveAnyClusterDetails[]
}

interface MoveAnyClusterDetails {
  cluster_id: string
  errors?: BasicFailedReplyElement[]
}

export default function vacateAllocatorsReducer(allocators: State = {}, action: Action): State {
  if (action.type !== VACATE_ALLOCATOR) {
    return allocators
  }

  const { regionId, allocatorId } = action.meta
  const descriptor = createDescriptor(regionId, allocatorId)

  return {
    ...allocators,
    [descriptor]: vacateAllocatorReducer(allocators[descriptor], action),
  }
}

function vacateAllocatorReducer(state: VacateResult, action: Action): VacateResult {
  if (action.type === VACATE_ALLOCATOR) {
    if (!action.error && action.payload) {
      return createVacate(action.payload)
    }
  }

  return state
}

function createVacate(payload: MoveClustersCommandResponse): VacateResult {
  const failures: MoveAnyClustersDetails = payload.failures
  const moves: MoveAnyClustersDetails = payload.moves

  const failureVacateGroups = mapValues<MoveAnyClustersDetails, VacateItemCluster[]>(
    failures,
    mapMoveClustersDetailsIntoVacateResults,
  )
  const failureVacateGroupValues = values(failureVacateGroups)
  const failureVacates = flatten(failureVacateGroupValues)
  const failed = keyBy(failureVacates, 'clusterId')

  const moveVacateGroups = mapValues<MoveAnyClustersDetails, VacateItemCluster[]>(
    moves,
    mapMoveClustersDetailsIntoVacateResults,
  )
  const moveVacateGroupValues = values(moveVacateGroups)
  const moveVacates = flatten(moveVacateGroupValues)
  const vacating = keyBy(moveVacates, 'clusterId')

  return {
    failed,
    vacating,
  }

  function mapMoveClustersDetailsIntoVacateResults(
    moveDetails: MoveAnyClusterDetails[],
    key: keyof MoveAnyClustersDetails,
  ): VacateItemCluster[] {
    const sliderInstanceType = parseSliderInstanceTypeFromMoveCommandResponseKey(key)

    return moveDetails.map(({ cluster_id, errors }) => ({
      sliderInstanceType,
      clusterId: cluster_id,
      errors: errors ? errors.map((error) => error.message) : [],
    }))
  }

  function parseSliderInstanceTypeFromMoveCommandResponseKey(
    key: keyof MoveClustersDetails,
  ): SliderInstanceType | undefined {
    const endsWithClusters = /_clusters$/

    if (!endsWithClusters.test(key)) {
      return undefined
    }

    const sliderInstanceType = key.replace(endsWithClusters, '')
    return sliderInstanceType
  }
}

function createDescriptor(regionId: string, allocatorId: string): string {
  return `${regionId}/${allocatorId}`
}

export function getAllocatorVacate(
  state: State,
  regionId: string,
  allocatorId: string,
): VacateResult | undefined {
  return state[createDescriptor(regionId, allocatorId)]
}
