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

import HideDeploymentInUserconsole from './HideDeploymentInUserconsole'

import searchClustersQuery from '../../../../../lib/clusters/searchClustersQuery'

import {
  resetShutdownStackDeployment,
  shutdownStackDeployment,
  fetchDeployment,
} from '../../../../../actions/stackDeployments'

import { searchClusters } from '../../../../../actions/searchClusters'

import { submitUserFeedbackForDeployment } from '../../../../../actions/user'

import {
  getDeletedClusters,
  getSearchClustersById,
  shutdownStackDeploymentRequest,
  searchClusterRequest,
} from '../../../../../reducers'

import { getProfile } from '../../../../../apps/userconsole/reducers'

import { SearchRecord } from '../../../../../reducers/searchClusters'

import { AsyncRequestState, StackDeployment, ProfileState } from '../../../../../types'
import { FeedbackType } from '../../../../../types/custom'

type StateProps = {
  shutdownStackDeploymentRequest: AsyncRequestState
  deletedClusters: string[]
  searchResults?: SearchRecord | null
  searchResultsRequest: AsyncRequestState
  profile: NonNullable<ProfileState>
}

type DispatchProps = {
  fetchDeployment: () => void
  stopAndHideDeployment: () => void
  resetShutdownStackDeployment: () => void
  fetchClusters: (options: { esQuery?: any; deletedClusters: string[]; size?: number }) => void
  submitUserFeedback: (options: {
    deployment: StackDeployment
    type: string
    reasons: FeedbackType[]
    feedback: string
  }) => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const searchId = `all-user-deployments`

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => ({
  shutdownStackDeploymentRequest: shutdownStackDeploymentRequest(state, deployment.id),
  deletedClusters: getDeletedClusters(state),
  searchResults: getSearchClustersById(state, searchId),
  searchResultsRequest: searchClusterRequest(state, searchId),
  profile: getProfile(state)!,
})

const mapDispatchToProps = (dispatch, { deployment }: ConsumerProps): DispatchProps => ({
  stopAndHideDeployment: () =>
    dispatch(
      shutdownStackDeployment({
        deploymentId: deployment.id,
        hide: true,
        skipSnapshot: true,
        showAsDeleted: true,
      }),
    ),
  resetShutdownStackDeployment: () => dispatch(resetShutdownStackDeployment(deployment.id)),
  fetchDeployment: () => dispatch(fetchDeployment({ deploymentId: deployment.id })),
  fetchClusters: (options) => dispatch(searchClusters(searchId, searchClustersQuery(options))),
  submitUserFeedback: (options) => dispatch(submitUserFeedbackForDeployment(options)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(HideDeploymentInUserconsole)
