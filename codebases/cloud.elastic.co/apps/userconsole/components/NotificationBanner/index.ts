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

import NotificationBanner from './NotificationBanner'

import { fetchAccountDetailsIfNeeded } from '../../actions/account'

import { getAccountDetails } from '../../reducers'
import { SAD_hasUnexpiredSession } from '../../../../lib/auth'

import { UserProfile } from '../../../../types'

type StateProps = {
  loggedIn: boolean
  accountDetails: UserProfile
}

type DispatchProps = {
  fetchAccountDetails: () => void
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  accountDetails: getAccountDetails(state),
  loggedIn: SAD_hasUnexpiredSession(),
})

const mapDispatchToProps: DispatchProps = {
  fetchAccountDetails: fetchAccountDetailsIfNeeded,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationBanner)
