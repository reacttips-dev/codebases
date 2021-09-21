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

import BillingOverview from './BillingOverview'

import { updateBillingLevel } from '../../../actions/account'

import {
  fetchProfileRequest,
  fetchUpdateBillingLevelRequest,
  getProfile,
  getUsageDetails,
} from '../../../reducers'

import {
  AsyncRequestState,
  BillingSubscriptionLevel,
  ThunkDispatch,
  UserProfile,
} from '../../../../../types'
import { isFeatureActivated } from '../../../../../store'
import Feature from '../../../../../lib/feature'
import { FeaturesUsage } from '../../../../../lib/api/v1/types'

interface DispatchProps {
  updateBillingLevel: ({ level }: { level: BillingSubscriptionLevel }) => Promise<void>
}

interface StateProps {
  profile: UserProfile | null
  isGovCloud?: boolean
  fetchProfileRequest: AsyncRequestState
  updateBillingLevelRequest: AsyncRequestState
  usageDetails: FeaturesUsage
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  profile: getProfile(state),
  isGovCloud: isFeatureActivated(Feature.hideIrrelevantSectionsFromGovCloud),
  fetchProfileRequest: fetchProfileRequest(state),
  usageDetails: getUsageDetails(state),
  updateBillingLevelRequest: fetchUpdateBillingLevelRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  updateBillingLevel: (subscription) => dispatch(updateBillingLevel(subscription)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(BillingOverview)
