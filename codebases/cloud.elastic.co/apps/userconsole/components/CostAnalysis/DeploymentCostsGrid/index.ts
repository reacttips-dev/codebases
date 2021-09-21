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
import DeploymentCostsGrid from './DeploymentCostsGrid'
import {
  fetchAccountCostsRequest,
  getAccountCosts,
  getAccountCostsOverview,
  getProfile,
} from '../../../reducers'
import { isPrepaidConsumptionCustomer } from '../../../../../lib/billing'
import { AccountCosts, AsyncRequestState, UserProfile } from '../../../../../types'

interface StateProps {
  accountCosts: AccountCosts
  isTrialConversionUser: boolean
  isPrepaidConsumptionUser: boolean
  fetchAccountCostsRequest: AsyncRequestState
}

const mapStateToProps = (state): StateProps => {
  const accountCostOverview = getAccountCostsOverview(state)
  const profile = getProfile(state) as UserProfile

  return {
    accountCosts: getAccountCosts(state),
    fetchAccountCostsRequest: fetchAccountCostsRequest(state),
    isTrialConversionUser: accountCostOverview && accountCostOverview.isTrialConversionUser,
    isPrepaidConsumptionUser: isPrepaidConsumptionCustomer(profile),
  }
}

export default connect<StateProps>(mapStateToProps)(DeploymentCostsGrid)
