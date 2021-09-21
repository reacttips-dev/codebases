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

import SnapshotRestore from './SnapshotRestore'

import { resetUpdateDeployment, updateDeployment } from '../../../../actions/stackDeployments'
import { updateStackDeploymentRequest } from '../../../../reducers'

import { ReduxState, ThunkDispatch } from '../../../../types'
import { StateProps, DispatchProps, ConsumerProps } from './types'

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => ({
  updateDeploymentRequest: updateStackDeploymentRequest(state, deployment.id),
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment }: ConsumerProps,
): DispatchProps => ({
  updateDeployment: (payload) =>
    dispatch(updateDeployment({ deploymentId: deployment.id, deployment: payload })),
  resetUpdateDeployment: () => dispatch(resetUpdateDeployment(deployment.id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SnapshotRestore)
