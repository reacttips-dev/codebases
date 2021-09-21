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

import CostAnalysis from './CostAnalysis'

import { fetchAccountCosts } from '../../actions/account'
import { searchDeployments } from '../../../../actions/stackDeployments'

import {
  fetchAccountCostsRequest,
  fetchDeploymentCostItemsRequest,
  fetchProfileRequest,
  getAccountCosts,
  getProfile,
} from '../../reducers'

import {
  AsyncRequestState,
  ThunkDispatch,
  UserProfile,
  AccountCosts,
  AccountCostTimePeriod,
} from '../../../../types'
import { SearchRequest } from '../../../../lib/api/v1/types'

interface DispatchProps {
  fetchAccountCosts: ({
    organizationId,
    timePeriod,
  }: {
    organizationId: string
    timePeriod: AccountCostTimePeriod
  }) => void
  searchDeployments: (query: SearchRequest) => void
}

interface StateProps {
  accountCosts: AccountCosts
  fetchAccountCostsRequest: AsyncRequestState
  fetchDeploymentCostItemsRequest: AsyncRequestState
  profile: UserProfile
  fetchProfileRequest: AsyncRequestState
}

const mapStateToProps = (state): StateProps => ({
  accountCosts: getAccountCosts(state),
  fetchAccountCostsRequest: fetchAccountCostsRequest(state),
  fetchProfileRequest: fetchProfileRequest(state),
  fetchDeploymentCostItemsRequest: fetchDeploymentCostItemsRequest(state),
  profile: getProfile(state) as UserProfile,
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  searchDeployments: (query) => dispatch(searchDeployments({ queryId: `deployments`, query })),
  fetchAccountCosts: (args) => dispatch(fetchAccountCosts(args)),
})

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(CostAnalysis)
