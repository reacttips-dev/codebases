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

import { connect } from 'react-redux'

import VacateNodesModal, { Node } from './VacateNodesModal'

import {
  getAllocatorVacateValidate,
  vacateAllocatorRequest,
  vacateAllocatorValidateRequest,
} from '../../../../reducers'

import {
  vacateAllocator,
  vacateAllocatorValidate,
  resetVacateAllocatorValidate,
  VacateAllocatorOptions,
  VacateAllocatorValidateOptions,
} from '../../../../actions/allocators'

import { Allocator, AsyncRequestState, RegionId, ThunkDispatch } from '../../../../types'
import { MoveClustersCommandResponse } from '../../../../lib/api/v1/types'

type StateProps = {
  vacateAllocatorRequest: AsyncRequestState
  vacateAllocatorValidateResult: MoveClustersCommandResponse | undefined
  vacateAllocatorValidateRequest: AsyncRequestState
}

type DispatchProps = {
  vacateAllocator: (params: VacateAllocatorOptions) => Promise<MoveClustersCommandResponse>
  vacateAllocatorValidate: (params: VacateAllocatorValidateOptions) => void
  resetVacateAllocatorValidate: (regionId: RegionId, id: string) => void
}

type ConsumerProps = {
  allocator: Allocator
  nodes: Node[]
}

const mapStateToProps = (state: any, { allocator }: ConsumerProps): StateProps => {
  const { regionId, id } = allocator

  return {
    vacateAllocatorRequest: vacateAllocatorRequest(state, regionId, id),
    vacateAllocatorValidateResult: getAllocatorVacateValidate(state, regionId, id),
    vacateAllocatorValidateRequest: vacateAllocatorValidateRequest(state, regionId, id),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  vacateAllocator: (params: VacateAllocatorOptions) => dispatch(vacateAllocator(params)),
  vacateAllocatorValidate: (params: VacateAllocatorValidateOptions) =>
    dispatch(vacateAllocatorValidate(params)),
  resetVacateAllocatorValidate: (regionId: RegionId, id: string) =>
    dispatch(resetVacateAllocatorValidate(regionId, id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(VacateNodesModal)
