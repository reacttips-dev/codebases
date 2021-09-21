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

import DeploymentAliasEdit from './DeploymentAliasEdit'

import { updateDeploymentAlias } from '../../../../actions/deploymentAlias'

import { fetchDeployment } from '../../../../actions/stackDeployments'

import { updateDeploymentDomainAliasRequest } from '../../../../reducers'

import { AsyncRequestState, ReduxState, StackDeployment } from '../../../../types'

type StateProps = {
  updateDeploymentAliasRequest: AsyncRequestState
}

type DispatchProps = {
  updateDeploymentAlias: (alias: string) => Promise<any>
}

type ConsumerProps = {
  deployment: StackDeployment
  onClose: () => void
}

const mapStateToProps = (state: ReduxState, { deployment }): StateProps => ({
  updateDeploymentAliasRequest: updateDeploymentDomainAliasRequest(state, deployment.id),
})

const mapDispatchToProps = (dispatch, { deployment }: ConsumerProps): DispatchProps => ({
  updateDeploymentAlias: (alias: string) =>
    dispatch(updateDeploymentAlias({ deployment, alias })).then(() =>
      dispatch(fetchDeployment({ deploymentId: deployment.id })),
    ),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentAliasEdit)
