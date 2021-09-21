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

import UsageNotice from './UsageNotice'

import { fetchUsageDetails } from '../../../actions/billing/details'
import { fetchAccountActivity } from '../../../actions/account'

import { getUsageDetails, fetchUsageDetailsRequest, getAccountActivity } from '../../../reducers'

import { AsyncRequestState, UserProfile } from '../../../../../types'
import { FeaturesUsage } from '../../../../../lib/api/v1/types'

type StateProps = {
  usageDetails: FeaturesUsage
  fetchUsageDetailsRequest: AsyncRequestState
  activity: {
    month_so_far: any
    now: any
  }
}

type DispatchProps = {
  fetchUsageDetails: () => void
  fetchAccountActivity: () => void
}

interface ConsumerProps {
  accountDetails: UserProfile
}

const mapStateToProps = (state): StateProps => ({
  usageDetails: getUsageDetails(state),
  fetchUsageDetailsRequest: fetchUsageDetailsRequest(state),
  activity: getAccountActivity(state),
})

const mapDispatchToProps: DispatchProps = {
  fetchUsageDetails,
  fetchAccountActivity,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(UsageNotice)
