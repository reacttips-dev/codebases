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

import RestartDeployment from './RestartDeployment'

import {
  fetchDeployment,
  restartStackDeploymentEsResource,
  resetRestartStackDeploymentEsResource,
} from '../../../../../actions/stackDeployments'

import { restartStackDeploymentEsResourceRequest } from '../../../../../reducers'

import { getFirstEsRefId } from '../../../../../lib/stackDeployments'

import {
  ReduxState,
  AsyncRequestState,
  StackDeployment,
  RestartStrategy,
} from '../../../../../types'

type StateProps = {
  restartStackDeploymentEsResourceRequest: AsyncRequestState
}

type DispatchProps = {
  restartStackDeploymentEsResource: (strategy: RestartStrategy) => void
  resetRestartStackDeploymentEsResource: () => void
  fetchDeployment: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const refId = getFirstEsRefId({ deployment })

  return {
    restartStackDeploymentEsResourceRequest: restartStackDeploymentEsResourceRequest(
      state,
      deployment.id,
      refId,
    ),
  }
}

const mapDispatchToProps = (dispatch, { deployment }: ConsumerProps): DispatchProps => ({
  fetchDeployment: () => dispatch(fetchDeployment({ deploymentId: deployment.id })),
  restartStackDeploymentEsResource: (strategy: RestartStrategy) =>
    dispatch(
      restartStackDeploymentEsResource({
        deploymentId: deployment.id,
        resourceRefId: getFirstEsRefId({ deployment })!,
        groupAttribute: strategy,
      }),
    ),
  resetRestartStackDeploymentEsResource: () =>
    dispatch(
      resetRestartStackDeploymentEsResource(deployment.id, getFirstEsRefId({ deployment })!),
    ),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RestartDeployment)
