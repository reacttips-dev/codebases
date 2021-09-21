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

import VacateNodeThroughAllocatorModal from './VacateNodeThroughAllocatorModal'

import { fetchAllocator } from '../../../../actions/allocators'

import { getAllocator, getAllocatorRequest } from '../../../../reducers'

import {
  Allocator,
  AnyResourceInfo,
  AsyncRequestState,
  SliderInstanceType,
} from '../../../../types'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

type StateProps = {
  allocator?: Allocator
  fetchAllocatorRequest: AsyncRequestState
}

type DispatchProps = {
  fetchAllocator: () => Promise<any>
}

type ConsumerProps = {
  resource: AnyResourceInfo
  instance: ClusterInstanceInfo
  kind: SliderInstanceType
  close: () => void
  onAfterVacate: () => void
}

const mapStateToProps = (
  state,
  { resource, instance: { allocator_id = `` } }: ConsumerProps,
): StateProps => ({
  allocator: getAllocator(state, resource.region, allocator_id),
  fetchAllocatorRequest: getAllocatorRequest(state, resource.region, allocator_id),
})

const mapDispatchToProps = (
  dispatch,
  { resource, instance: { allocator_id = `` } }: ConsumerProps,
): DispatchProps => ({
  fetchAllocator: () => dispatch(fetchAllocator(resource.region, allocator_id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(VacateNodeThroughAllocatorModal)
