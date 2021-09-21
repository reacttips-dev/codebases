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

import SelectRemoteDeploymentsTable from './SelectRemoteDeploymentsTable'

import {
  fetchCcsEligibleRemotesForDeployment,
  resetFetchCcsEligibleRemotes,
} from '../../../../../actions/deployments/ccsSettings'

import { fetchCcsEligibleRemotesRequest, getCcsEligibleRemotes } from '../../../../../reducers'

import { getFirstRefId, getVersion } from '../../../../../lib/stackDeployments/selectors'

import { ReduxState, ThunkDispatch } from '../../../../../types'

import { StateProps, DispatchProps, ConsumerProps } from './types'

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const version = getVersion({ deployment })!

  return {
    eligibleRemoteDeployments: getCcsEligibleRemotes(state, version)?.deployments || [],
    searchEligibleRemoteDeploymentsRequest: fetchCcsEligibleRemotesRequest(state, version),
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment }: ConsumerProps,
): DispatchProps => {
  const refId = getFirstRefId({ deployment, sliderInstanceType: `elasticsearch` })!
  const version = getVersion({ deployment })!

  return {
    searchEligibleRemoteDeployments: (payload) =>
      dispatch(
        fetchCcsEligibleRemotesForDeployment({
          deploymentId: deployment.id,
          refId,
          version,
          payload,
        }),
      ),
    resetSearchCcsEligibleRemoteDeployments: () => dispatch(resetFetchCcsEligibleRemotes()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectRemoteDeploymentsTable)
