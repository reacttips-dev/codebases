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

import CcsEditRemoteDeployments from './CcsEditRemoteDeployments'

import {
  fetchCcsSettings,
  updateCcsSettings,
  resetUpdateCcsSettingsRequest,
} from '../../../actions/deployments/ccsSettings'

import {
  getCcsSettings,
  fetchCcsSettingsRequest,
  updateCcsSettingsRequest,
} from '../../../reducers'

import { getFirstEsRefId } from '../../../lib/stackDeployments/selectors'

import { RemoteResources } from '../../../lib/api/v1/types'
import { AsyncRequestState, ReduxState, StackDeployment, ThunkDispatch } from '../../../types'

type StateProps = {
  ccsSettings: RemoteResources | null
  updateCcsSettingsRequest: AsyncRequestState
  fetchCcsSettingsRequest: AsyncRequestState
}

type DispatchProps = {
  fetchCcsSettings: () => void
  updateCcsSettings: (settings: RemoteResources) => Promise<void>
  resetUpdateCcsSettingsRequest: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
  regionId: string
}

const mapStateToProps = (state: ReduxState, { deployment: { id } }: ConsumerProps): StateProps => ({
  ccsSettings: getCcsSettings(state, id),
  fetchCcsSettingsRequest: fetchCcsSettingsRequest(state, id),
  updateCcsSettingsRequest: updateCcsSettingsRequest(state, id),
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment, deployment: { id } }: ConsumerProps,
): DispatchProps => {
  const refId = getFirstEsRefId({ deployment })!

  return {
    fetchCcsSettings: () => dispatch(fetchCcsSettings({ deploymentId: id, refId })),
    updateCcsSettings: (settings) =>
      dispatch(updateCcsSettings({ deploymentId: id, refId, settings })),
    resetUpdateCcsSettingsRequest: () => dispatch(resetUpdateCcsSettingsRequest(id)),
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CcsEditRemoteDeployments)
