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

import StepTitle from './StepTitle'

import { cancelDeploymentResourcePlanRequest } from '../../../reducers'

import {
  ReduxState,
  AsyncRequestState,
  AnyResourceInfo,
  AnyClusterPlanInfo,
  SliderInstanceType,
  StackDeployment,
} from '../../../types'
import { ClusterPlanStepInfo } from '../../../lib/api/v1/types'

type StateProps = {
  cancelPlanRequest: AsyncRequestState
}

interface DispatchProps {}

type ConsumerProps = {
  deployment: StackDeployment
  resourceType: SliderInstanceType
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
  step: ClusterPlanStepInfo
}

const mapStateToProps = (
  state: ReduxState,
  { deployment, resourceType, resource }: ConsumerProps,
): StateProps => ({
  cancelPlanRequest: cancelDeploymentResourcePlanRequest(
    state,
    deployment.id,
    resourceType,
    resource.ref_id,
  ),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StepTitle)
