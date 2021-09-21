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
import { RouteComponentProps } from 'react-router'

import PortalLandingPage from './PortalLandingPage'

import { searchDeployments } from '../../../../actions/stackDeployments'
import { fetchProfile } from '../../../../apps/userconsole/actions/profile'

import {
  getDeletedStackDeploymentIds,
  getStackDeploymentsFromSearch,
  searchStackDeploymentsRequest,
} from '../../../../reducers'

import { getProfile, fetchProfileRequest } from '../../../../apps/userconsole/reducers'

import { getConfigForKey, isFeatureActivated } from '../../../../selectors'

import Feature from '../../../../lib/feature'

import { DeploymentsSearchResponse, SearchRequest } from '../../../../lib/api/v1/types'
import { AsyncRequestState, ThunkDispatch, ProfileState } from '../../../../types'

interface StateProps {
  hasCloudStatusTile: boolean
  deletedDeploymentIds: string[]
  searchResults: DeploymentsSearchResponse | null
  fetchProfileRequest: AsyncRequestState
  profile: ProfileState
  searchResultsRequest: AsyncRequestState
  pollingInterval: number
  intercomChatFeature: boolean
}

interface DispatchProps {
  fetchProfile: () => Promise<any>
  searchDeployments: (query: SearchRequest) => void
}

interface ConsumerProps extends RouteComponentProps {
  isRouteFSTraced?: boolean
}

const mapStateToProps = (state): StateProps => {
  const appFamily = getConfigForKey(state, `APP_FAMILY`)

  return {
    hasCloudStatusTile: appFamily === 'saas',
    deletedDeploymentIds: getDeletedStackDeploymentIds(state),
    searchResults: getStackDeploymentsFromSearch(state, `deployments`),
    searchResultsRequest: searchStackDeploymentsRequest(state, `deployments`),
    fetchProfileRequest: fetchProfileRequest(state),
    profile: getProfile(state),
    pollingInterval: getConfigForKey(state, `POLLING_INTERVAL`),
    intercomChatFeature: isFeatureActivated(state, Feature.intercomChat),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  searchDeployments: (query) => dispatch(searchDeployments({ queryId: `deployments`, query })),
  fetchProfile: () => dispatch(fetchProfile()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PortalLandingPage)
