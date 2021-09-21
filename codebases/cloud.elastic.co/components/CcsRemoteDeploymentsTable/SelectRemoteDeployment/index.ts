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

import SelectRemoteDeployment from './SelectRemoteDeployment'

import {
  fetchCcsEligibleRemotesForDeployment,
  fetchCcsEligibleRemotesForVersion,
} from '../../../actions/deployments/ccsSettings'

import { fetchCcsEligibleRemotesRequest, getCcsEligibleRemotes } from '../../../reducers'

import { getFirstEsRefId } from '../../../lib/stackDeployments/selectors'

import { ReduxState, ThunkDispatch } from '../../../types'

import { StateProps, DispatchProps, ConsumerProps } from './types'

const mapStateToProps = (state: ReduxState, { deploymentVersion }: ConsumerProps): StateProps => ({
  deploymentSearchResults: getCcsEligibleRemotes(state, deploymentVersion),
  searchDeploymentsRequest: fetchCcsEligibleRemotesRequest(state, deploymentVersion),
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment, deploymentVersion: version }: ConsumerProps,
) => ({
  searchDeployments: () => {
    // We use the deployment specific endpoint where possible for better accuracy in results,
    // and fall back to searching by version during creation when a deployment doesn't exist yet.
    if (deployment) {
      const refId = getFirstEsRefId({ deployment })!

      return dispatch(
        fetchCcsEligibleRemotesForDeployment({
          deploymentId: deployment.id,
          refId,
          version,
        }),
      )
    }

    return dispatch(fetchCcsEligibleRemotesForVersion({ version }))
  },
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectRemoteDeployment)
