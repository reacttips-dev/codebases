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

import SelectSubscriptionBody from './SelectSubscriptionBody'

import {
  fetchUpdateBillingLevelRequest,
  getAccountActivity,
  getPrepaidBalanceLineItems,
  getProfile,
} from '../../../../reducers'

import { resetUpdateBillingLevel } from '../../../../actions/account'

import {
  AsyncRequestState,
  BillingSubscriptionLevel,
  ThunkDispatch,
  UserProfile,
} from '../../../../../../types'
import { LineItem } from '../../../../../../lib/api/v1/types'

type StateProps = {
  activity: {
    month_so_far: any
    now: any
  }
  prepaidBalanceLineItems: LineItem[]
  profile: UserProfile | null
  updateBillingLevelRequest: AsyncRequestState
}

type DispatchProps = {
  resetUpdateBillingLevel: () => void
}

type ConsumerProps = {
  selectedSubscription: BillingSubscriptionLevel
  onSelectSubscription: (subscription: any) => void
  onSeeReviewChanges?: () => void
}

const mapStateToProps = (state): StateProps => ({
  activity: getAccountActivity(state),
  prepaidBalanceLineItems: getPrepaidBalanceLineItems(state),
  profile: getProfile(state),
  updateBillingLevelRequest: fetchUpdateBillingLevelRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  resetUpdateBillingLevel: () => dispatch(resetUpdateBillingLevel()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectSubscriptionBody)
