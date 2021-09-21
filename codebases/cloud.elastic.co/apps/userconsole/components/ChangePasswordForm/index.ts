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

import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'

import { parse } from 'query-string'

import { setInitialPassword } from '../../actions/account'
import { setInitialPasswordRequest } from '../../reducers'
import { getLoginRequest } from '../../../../reducers'

import ChangePasswordForm from './ChangePasswordForm'

import { AsyncRequestState, ReduxState } from '../../../../types'

interface StateProps {
  email: string
  expires: number
  activationHash?: string
  loginRequest: AsyncRequestState
  setInitialPasswordRequest: AsyncRequestState
}

interface DispatchProps {
  setInitialPassword: (args: {
    email: string
    expires: number
    hash: string
    password: string
  }) => void
}

interface ConsumerProps extends RouteComponentProps {}

const mapStateToProps = (state: ReduxState, { location }: ConsumerProps): StateProps => {
  const query = parse(location.search.slice(1))

  return {
    email: String(query.email),
    expires: Number.parseInt(String(query.e), 10),
    activationHash: typeof query.ah === `string` ? query.ah : undefined,
    loginRequest: getLoginRequest(state),
    setInitialPasswordRequest: setInitialPasswordRequest(state),
  }
}

const mapDispatchToProps: DispatchProps = {
  setInitialPassword,
}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(ChangePasswordForm),
)
