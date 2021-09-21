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

import CostOverview from './CostOverview'

import { fetchAccountCostOverviewIfNeeded } from '../../../actions/account'

import {
  fetchAccountCostOverviewRequest,
  fetchProfileRequest,
  fetchAccountCostsRequest,
  getProfile,
  getAccountCosts,
  getAccountCostsOverview,
} from '../../../reducers'
import { AccountCosts, AsyncRequestState, ThunkDispatch, UserProfile } from '../../../../../types'
import { CostsOverview } from '../../../../../lib/api/v1/types'

interface DispatchProps {
  fetchAccountCostOverviewIfNeeded: ({ organizationId }: { organizationId: string }) => void
}

interface StateProps {
  accountCosts: AccountCosts
  accountCostOverview: CostsOverview
  fetchAccountCostOverviewRequest: AsyncRequestState
  profile: UserProfile
  fetchProfileRequest: AsyncRequestState
  fetchAccountCostsRequest: AsyncRequestState
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  accountCosts: getAccountCosts(state),
  accountCostOverview: getAccountCostsOverview(state),
  fetchAccountCostOverviewRequest: fetchAccountCostOverviewRequest(state),
  fetchAccountCostsRequest: fetchAccountCostsRequest(state),
  fetchProfileRequest: fetchProfileRequest(state),
  profile: getProfile(state) as UserProfile,
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchAccountCostOverviewIfNeeded: ({ organizationId }) =>
    dispatch(fetchAccountCostOverviewIfNeeded({ organizationId })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CostOverview)
