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

import HideDeployment from './HideDeployment'

import {
  resetShutdownStackDeployment,
  shutdownStackDeployment,
  fetchDeployment,
} from '../../../../../actions/stackDeployments'

import { shutdownStackDeploymentRequest } from '../../../../../reducers'

import { AsyncRequestState, StackDeployment, ReduxState } from '../../../../../types'

type StateProps = {
  shutdownStackDeploymentRequest: AsyncRequestState
}

type DispatchProps = {
  fetchDeployment: () => void
  shutdownStackDeployment: () => void
  resetShutdownStackDeployment: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => ({
  shutdownStackDeploymentRequest: shutdownStackDeploymentRequest(state, deployment.id),
})

const mapDispatchToProps = (dispatch, { deployment }: ConsumerProps): DispatchProps => ({
  fetchDeployment: () => dispatch(fetchDeployment({ deploymentId: deployment.id })),
  shutdownStackDeployment: () =>
    dispatch(shutdownStackDeployment({ deploymentId: deployment.id, hide: true })),
  resetShutdownStackDeployment: () => dispatch(resetShutdownStackDeployment(deployment.id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(HideDeployment)
