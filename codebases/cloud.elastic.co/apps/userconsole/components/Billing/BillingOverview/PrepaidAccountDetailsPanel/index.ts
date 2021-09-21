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

import PrepaidAccountDetailsPanel from './PrepaidAccountDetailsPanel'

import { fetchPrepaidBalanceLineItemsIfNeeded } from '../../../../actions/account'

import {
  fetchPrepaidBalanceLineItemsRequest,
  fetchProfileRequest,
  getProfile,
  getPrepaidBalanceLineItems,
} from '../../../../reducers'

import { AsyncRequestState, ThunkDispatch, UserProfile } from '../../../../../../types'
import { LineItem } from '../../../../../../lib/api/v1/types'

interface DispatchProps {
  fetchPrepaidBalanceLineItemsIfNeeded: () => Promise<any>
}

interface StateProps {
  prepaidBalanceLineItems: LineItem[]
  fetchPrepaidBalanceLineItemsRequest: AsyncRequestState
  profile: UserProfile
  fetchProfileRequest: AsyncRequestState
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  prepaidBalanceLineItems: getPrepaidBalanceLineItems(state),
  fetchPrepaidBalanceLineItemsRequest: fetchPrepaidBalanceLineItemsRequest(state),
  profile: getProfile(state) as UserProfile,
  fetchProfileRequest: fetchProfileRequest(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchPrepaidBalanceLineItemsIfNeeded: () => dispatch(fetchPrepaidBalanceLineItemsIfNeeded()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(PrepaidAccountDetailsPanel)
