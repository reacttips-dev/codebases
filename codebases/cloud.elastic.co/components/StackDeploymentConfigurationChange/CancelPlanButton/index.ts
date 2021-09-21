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

import CancelPlanButton from './CancelPlanButton'

import {
  cancelDeploymentResourcePlan,
  resetCancelDeploymentResourcePlan,
} from '../../../actions/stackDeployments'

import { cancelDeploymentResourcePlanRequest } from '../../../reducers'

import {
  AsyncRequestState,
  AnyResourceInfo,
  StackDeployment,
  SliderInstanceType,
  ThunkDispatch,
} from '../../../types'

type StateProps = {
  cancelPlanRequest: AsyncRequestState
}

type DispatchProps = {
  cancelPlan: () => void
  resetCancelPlanRequest: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
}

const mapStateToProps = (
  state: any,
  { deployment: { id }, resource: { ref_id }, resourceType }: ConsumerProps,
): StateProps => ({
  cancelPlanRequest: cancelDeploymentResourcePlanRequest(state, id, resourceType, ref_id),
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment: { id }, resource: { ref_id }, resourceType }: ConsumerProps,
): DispatchProps => ({
  cancelPlan: () =>
    dispatch(
      cancelDeploymentResourcePlan({
        deploymentId: id,
        resourceKind: resourceType,
        resourceRefId: ref_id,
      }),
    ),
  resetCancelPlanRequest: () =>
    dispatch(resetCancelDeploymentResourcePlan(id, resourceType, ref_id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CancelPlanButton)
