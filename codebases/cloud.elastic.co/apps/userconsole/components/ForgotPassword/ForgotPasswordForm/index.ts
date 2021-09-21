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
import { RouteComponentProps, withRouter } from 'react-router'

import ForgotPasswordForm from './ForgotPasswordForm'

import { resetPassword } from '../../../actions/account'
import { buildLoginUrl } from '../../../../../lib/urlUtils'
import { AsyncRequestState, ReduxState } from '../../../../../types'

interface ConsumerProps extends RouteComponentProps {
  resetPasswordRequest: AsyncRequestState
  onChangeEmail: (e: string) => void
  email: string
}

interface DispatchProps {
  resetPassword: (email: string) => void
}

interface StateProps {
  loginUrl: string
}

const mapStateToProps = (_state: ReduxState, { location }: ConsumerProps): StateProps => {
  const locationQueryString = location.search

  return {
    loginUrl: buildLoginUrl({ locationQueryString }),
  }
}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps, {
    resetPassword,
  })(ForgotPasswordForm),
)
