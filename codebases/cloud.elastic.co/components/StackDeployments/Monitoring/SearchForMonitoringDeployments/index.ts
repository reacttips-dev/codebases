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

import SearchForMonitoringDeployments from './SearchForMonitoringDeployments'

import { searchDeployments } from '../../../../actions/stackDeployments'

import { getStackDeploymentsFromSearch, searchStackDeploymentsRequest } from '../../../../reducers'

import { AsyncRequestState, ReduxState, StackDeployment } from '../../../../types'
import { DeploymentsSearchResponse, SearchRequest } from '../../../../lib/api/v1/types'

type StateProps = {
  searchResults: DeploymentsSearchResponse | null
  searchResultsRequest: AsyncRequestState
}

type DispatchProps = {
  searchDeployments: (query: SearchRequest) => void
}

type ConsumerProps = {
  deployment: StackDeployment
  noneAlreadyMonitoring?: boolean
  onlyAlreadyMonitoring?: boolean
  placeholder?: string
  searchId: string
  selectedDeployment: StackDeployment | null
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  searchResults: getStackDeploymentsFromSearch(state, `deployments`),
  searchResultsRequest: searchStackDeploymentsRequest(state, `deployments`),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
  searchDeployments: (query: SearchRequest) =>
    dispatch(searchDeployments({ queryId: `deployments`, query })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForMonitoringDeployments)
