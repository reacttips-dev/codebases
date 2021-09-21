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

import { withTransaction } from '@elastic/apm-rum-react'

import ForgotPassword from './ForgotPassword'

import { resendEmailVerificationLink, resetPasswordResetRequest } from '../../actions/account'

import { resendEmailVerificationLinkRequest, resetPasswordRequest } from '../../reducers'

import { getTheme } from '../../../../reducers'

const mapStateToProps = (state) => ({
  resetPasswordRequest: resetPasswordRequest(state),
  resendEmailVerificationLinkRequest: resendEmailVerificationLinkRequest(state),
  theme: getTheme(state),
})

export default connect(mapStateToProps, {
  resendEmailVerificationLink,
  resetPasswordResetRequest,
})(withTransaction(`Forgot password`, `component`)(ForgotPassword))
