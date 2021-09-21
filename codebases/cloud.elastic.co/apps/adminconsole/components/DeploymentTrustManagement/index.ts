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

import DeploymentTrustManagement from './DeploymentTrustManagement'

import {
  fetchTrustRelationships,
  resetFetchTrustRelationships,
} from '../../../../actions/trustManagement'

import { fetchTrustRelationshipsRequest, getTrustRelationships } from '../../../../reducers'

import { getRegionId } from '../../../../lib/stackDeployments'

import { ReduxState, ThunkDispatch } from '../../../../types'

import { StateProps, DispatchProps, ConsumerProps } from './types'

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const regionId = getRegionId({ deployment })!

  return {
    trustRelationships: getTrustRelationships(state, regionId),
    fetchTrustRelationshipsRequest: fetchTrustRelationshipsRequest(state, regionId),
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment }: ConsumerProps,
): DispatchProps => {
  const regionId = getRegionId({ deployment })!

  return {
    fetchTrustRelationships: () =>
      dispatch(
        fetchTrustRelationships({
          regionId,
        }),
      ),
    resetFetchTrustRelationships: () => dispatch(resetFetchTrustRelationships(regionId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentTrustManagement)
