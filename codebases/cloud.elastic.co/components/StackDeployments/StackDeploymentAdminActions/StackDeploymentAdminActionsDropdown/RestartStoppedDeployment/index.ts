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

import RestartStoppedDeployment from './RestartStoppedDeployment'

import {
  restoreStackDeployment,
  resetRestoreStackDeployment,
  fetchDeployment,
} from '../../../../../actions/stackDeployments'

import { fetchInstanceConfigurationIfNeeded } from '../../../../../actions/topology/instanceConfigurations'

import { getInstanceConfigurations, restoreStackDeploymentRequest } from '../../../../../reducers'

import { getProfile } from '../../../../../apps/userconsole/reducers'

import { getRegionId } from '../../../../../lib/stackDeployments'

import { ProfileState, ReduxState, AsyncRequestState, StackDeployment } from '../../../../../types'

import { InstanceConfiguration } from '../../../../../lib/api/v1/types'

type StateProps = {
  instanceConfigurations: InstanceConfiguration[]
  restoreStackDeploymentRequest: AsyncRequestState
  profile: ProfileState
}

type DispatchProps = {
  fetchDeployment: () => void
  restoreStackDeployment: () => void
  resetRestoreStackDeployment: () => void
  fetchInstanceConfigurationIfNeeded: (instanceConfigId: string) => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const regionId = getRegionId({ deployment })!

  return {
    instanceConfigurations: getInstanceConfigurations(state, regionId!),
    restoreStackDeploymentRequest: restoreStackDeploymentRequest(state, deployment.id),
    profile: getProfile(state),
  }
}

const mapDispatchToProps = (dispatch, { deployment }: ConsumerProps): DispatchProps => ({
  restoreStackDeployment: () =>
    dispatch(
      restoreStackDeployment({
        deploymentId: deployment.id,
        restoreSnapshot: true,
      }),
    ),
  resetRestoreStackDeployment: () => dispatch(resetRestoreStackDeployment(deployment.id)),
  fetchInstanceConfigurationIfNeeded: (instanceConfigurationId) =>
    dispatch(
      fetchInstanceConfigurationIfNeeded(getRegionId({ deployment })!, instanceConfigurationId),
    ),
  fetchDeployment: () => dispatch(fetchDeployment({ deploymentId: deployment.id })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RestartStoppedDeployment)
