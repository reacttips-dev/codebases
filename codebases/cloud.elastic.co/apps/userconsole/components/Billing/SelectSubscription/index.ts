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

import SelectSubscriptionModal from './SelectSubscriptionModal'

import {
  fetchUpdateBillingLevelRequest,
  getUsageDetails,
  fetchUsageDetailsRequest,
  getProfile,
} from '../../../reducers'

import { updateBillingLevel } from '../../../actions/account'
import { fetchUsageDetails } from '../../../actions/billing/details'

import {
  AsyncRequestState,
  ThunkDispatch,
  UserProfile,
  BillingSubscriptionLevel,
} from '../../../../../types'
import { FeaturesUsage } from '../../../../../lib/api/v1/types'

type StateProps = {
  profile: UserProfile | null
  updateBillingLevelRequest: AsyncRequestState
  fetchUsageDetailsRequest: AsyncRequestState
  usageDetails: FeaturesUsage
}

type DispatchProps = {
  updateBillingLevel: ({ level }: { level: BillingSubscriptionLevel }) => Promise<void>
  fetchUsageDetails: () => void
}

type ConsumerProps = {
  closeModal: () => void
  onSeeReviewChanges?: () => void
}

const mapStateToProps = (state): StateProps => ({
  profile: getProfile(state),
  updateBillingLevelRequest: fetchUpdateBillingLevelRequest(state),
  usageDetails: getUsageDetails(state),
  fetchUsageDetailsRequest: fetchUsageDetailsRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  updateBillingLevel: (subscription) => dispatch(updateBillingLevel(subscription)),
  fetchUsageDetails,
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectSubscriptionModal)
