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

import Login from '../../../../components/Login'
import { getLoginRequest, getTheme } from '../../../../reducers'
import { resendEmailVerificationLinkRequest } from '../../reducers'
import { loginAndRedirect } from '../../actions/auth'
import { resendEmailVerificationLink } from '../../actions/account'

const mapStateToProps = (state) => ({
  authMethods: { password: true, saml: false },
  loginRequest: getLoginRequest(state),
  theme: getTheme(state),
  resendEmailVerificationLinkRequest: resendEmailVerificationLinkRequest(state),
})

const mapDispatchToProps = {
  loginAndRedirect,
  resendEmailVerificationLink,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
