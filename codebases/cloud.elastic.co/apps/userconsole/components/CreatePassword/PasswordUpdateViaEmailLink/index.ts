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

import PasswordUpdateViaEmailLink from './PasswordUpdateViaEmailLink'

import { verifyAccount } from '../../../actions/account'
import { verifyAccountRequest, setInitialPasswordRequest } from '../../../reducers'
import { getLoginRequest } from '../../../../../reducers'

import { parseCreationQueryParams } from '../../../../../lib/conversionFlow'

import { AsyncRequestState, ReduxState } from '../../../../../types'

interface StateProps {
  activate: boolean
  email?: string
  expires: number
  redirectTo?: string
  source?: string
  activationHash?: string
  verificationHash?: string
  loginRequest: AsyncRequestState
  verifyAccountRequest: AsyncRequestState
  setInitialPasswordRequest: AsyncRequestState
}

interface DispatchProps {
  verifyAccount: (email: string, expires: number, hash: string) => void
}

interface ConsumerProps extends RouteComponentProps {}

const mapStateToProps = (state: ReduxState, { location }: ConsumerProps): StateProps => {
  const query = parse(location.search.slice(1))
  const activate = parseCreationQueryParams({ query })

  return {
    activate,
    email: typeof query.email === `string` ? query.email : undefined,
    expires: Number.parseInt(String(query.e), 10),
    redirectTo: typeof query.redirectTo === `string` ? query.redirectTo : undefined,
    source: typeof query.source === `string` ? query.source : undefined,
    activationHash: typeof query.ah === `string` ? query.ah : undefined,
    verificationHash: typeof query.vh === `string` ? query.vh : undefined,
    loginRequest: getLoginRequest(state),
    verifyAccountRequest: verifyAccountRequest(state),
    setInitialPasswordRequest: setInitialPasswordRequest(state),
  }
}

const mapDispatchToProps = {
  verifyAccount,
}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(PasswordUpdateViaEmailLink),
)
