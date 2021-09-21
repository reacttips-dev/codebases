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

import StackDeploymentSearch from './StackDeploymentSearch'

import { searchDeployments } from '../../actions/stackDeployments'

import {
  getDeletedStackDeploymentIds,
  getStackDeploymentsFromSearch,
  searchStackDeploymentsRequest,
} from '../../reducers'

import { isFeatureActivated } from '../../selectors'

import { getProfile, getExternalSubscription } from '../../apps/userconsole/reducers'
import { isPermitted } from '../../lib/requiresPermission'
import Permission from '../../lib/api/v1/permissions'
import Feature from '../../lib/feature'

import { AsyncRequestState, ProfileState, ReduxState, UserSubscription } from '../../types'
import { DeploymentsSearchResponse, SearchRequest } from '../../lib/api/v1/types'

type StateProps = {
  deletedDeploymentIds: string[]
  searchResults: DeploymentsSearchResponse | null
  searchResultsRequest: AsyncRequestState
  profile: ProfileState
  subscription?: UserSubscription
  hideCreateClusterButton: boolean
  exportDeployments: boolean
  showIlmMigrationCallout: boolean
}

type DispatchProps = {
  searchDeployments: (query: SearchRequest) => void
}

interface ConsumerProps {}

const mapStateToProps = (state: ReduxState): StateProps => ({
  deletedDeploymentIds: getDeletedStackDeploymentIds(state),
  searchResults: getStackDeploymentsFromSearch(state, `deployments`),
  searchResultsRequest: searchStackDeploymentsRequest(state, `deployments`),
  hideCreateClusterButton: isPermitted(Permission.createDeployment)
    ? isFeatureActivated(state, Feature.hideCreateClusterButton)
    : true,
  exportDeployments: isFeatureActivated(state, Feature.exportDeployments),
  profile: getProfile(state),
  subscription: getExternalSubscription(state),
  showIlmMigrationCallout: isFeatureActivated(state, Feature.ilmTemplateMigrationFeature),
})

const mapDispatchToProps: DispatchProps = {
  searchDeployments: (query) => searchDeployments({ queryId: `deployments`, query }),
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackDeploymentSearch)
