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

import VerifyEmailBanner from './VerifyEmailBanner'

import {
  resendEmailVerificationLink,
  resetEmailVerificationLinkRequest,
} from '../../../actions/account'

import { resendEmailVerificationLinkRequest } from '../../../reducers'

import { SAD_hasUnexpiredSession } from '../../../../../lib/auth'

import { AsyncRequestState, UserProfile } from '../../../../../types'

type StateProps = {
  resendEmailVerificationLinkRequest: AsyncRequestState
  loggedIn: boolean
}

type DispatchProps = {
  resendEmailVerificationLink: (email: string) => void
  resetEmailVerificationLinkRequest: () => void
}

interface ConsumerProps {
  accountDetails: UserProfile
}

const mapStateToProps = (state): StateProps => ({
  resendEmailVerificationLinkRequest: resendEmailVerificationLinkRequest(state),
  loggedIn: SAD_hasUnexpiredSession(),
})

const mapDispatchToProps: DispatchProps = {
  resendEmailVerificationLink,
  resetEmailVerificationLinkRequest,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEmailBanner)
