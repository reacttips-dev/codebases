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

import DeploymentHealthStatus, {
  StateProps,
  DispatchProps,
  ConsumerProps,
} from './DeploymentHealthStatus'

import { fetchCcsSettings } from '../../../actions/deployments/ccsSettings'

import { getCcsSettings } from '../../../reducers'

import { getFirstEsRefId } from '../../../lib/stackDeployments/selectors'

import { ReduxState, ThunkDispatch } from '../../../types'

const mapStateToProps = (state: ReduxState, { stackDeployment }: ConsumerProps): StateProps => ({
  ccsSettings: stackDeployment ? getCcsSettings(state, stackDeployment.id) : null,
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { stackDeployment }: ConsumerProps,
): DispatchProps => {
  const refId = stackDeployment ? getFirstEsRefId({ deployment: stackDeployment })! : null
  const id = stackDeployment ? stackDeployment.id : null

  return {
    fetchCcsSettings: () =>
      refId && id ? dispatch(fetchCcsSettings({ deploymentId: id, refId })) : null,
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentHealthStatus)
