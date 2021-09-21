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

import StackDeploymentUpdateDryRunWarnings from './StackDeploymentUpdateDryRunWarnings'

import { updateDeployment, resetUpdateDeploymentDryRun } from '../../actions/stackDeployments'

import { getUpdateDeploymentDryRunResult, updateStackDeploymentDryRunRequest } from '../../reducers'

import { AsyncRequestState, ReduxState } from '../../types'

import { DeploymentUpdateRequest, DeploymentUpdateResponse } from '../../lib/api/v1/types'

type StateProps = {
  updateDeploymentDryRunResult: DeploymentUpdateResponse | null
  updateDeploymentDryRunRequest: AsyncRequestState
}

type DispatchProps = {
  updateDeploymentDryRun: () => void
  resetUpdateDeploymentDryRun: () => void
}

type ConsumerProps = {
  deploymentId: string
  deployment: DeploymentUpdateRequest
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const mapStateToProps = (state: ReduxState, { deploymentId }: ConsumerProps): StateProps => ({
  updateDeploymentDryRunRequest: updateStackDeploymentDryRunRequest(state, deploymentId),
  updateDeploymentDryRunResult: getUpdateDeploymentDryRunResult(state, deploymentId),
})

const mapDispatchToProps = (dispatch, { deploymentId, deployment }): DispatchProps => ({
  updateDeploymentDryRun: () =>
    dispatch(updateDeployment({ deploymentId, deployment, dryRun: true })),
  resetUpdateDeploymentDryRun: () => dispatch(resetUpdateDeploymentDryRun(deploymentId)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackDeploymentUpdateDryRunWarnings)
