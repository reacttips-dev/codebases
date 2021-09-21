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

import StopDeployment from './StopDeployment'

import {
  shutdownStackDeployment,
  fetchDeployment,
  resetShutdownStackDeployment,
} from '../../../../../actions/stackDeployments'

import { shutdownStackDeploymentRequest } from '../../../../../reducers'

import { AsyncRequestState, StackDeployment } from '../../../../../types'

type StateProps = {
  shutdownStackDeploymentRequest: AsyncRequestState
}

type DispatchProps = {
  shutdownStackDeployment: (params: {
    deploymentId: string
    hide?: boolean
    skipSnapshot?: boolean
  }) => void
  resetShutdownStackDeployment: (deploymentId: string) => void
  fetchDeployment: (params: { deploymentId: string }) => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => ({
  shutdownStackDeploymentRequest: shutdownStackDeploymentRequest(state, deployment.id),
})

const mapDispatchToProps: DispatchProps = {
  shutdownStackDeployment,
  resetShutdownStackDeployment,
  fetchDeployment,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StopDeployment)
