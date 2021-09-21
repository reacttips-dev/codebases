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
import { RouteComponentProps } from 'react-router'
import { parse } from 'query-string'

import UserconsoleLogin from './UserconsoleLogin'

import { logout, redirectAfterLogin } from '../../actions/auth'
import { getMfa, getLoginRequest } from '../../reducers'

import { isFeatureActivated } from '../../selectors'

import Feature from '../../lib/feature'
import { getRegistrationSource } from '../../lib/urlUtils'

import { AsyncRequestState, Theme, ReduxState } from '../../types'
import { MfaState } from '../../reducers/auth/types'

interface LoginParams {
  redirectTo: string
  credentials: { email: string; password: string }
}

type StateProps = {
  redirectTo?: string
  fromURI?: string
  source?: string
  newBearerToken: string | null
  mfa: MfaState
  loginRequest: AsyncRequestState
}

type DispatchProps = {
  logout: ({ fromURI }: { fromURI?: string }) => void
  redirectAfterLogin: (redirectTo: string) => () => void
}

type QueryStringParameters = {
  redirectTo?: string
  fromURI?: string
}

type ConsumerProps = RouteComponentProps<QueryStringParameters> & {
  loginRequest: AsyncRequestState
  loginAndRedirect: (params: LoginParams) => Promise<any>
  resendEmailVerificationLink: (email: string) => void
  resendEmailVerificationLinkRequest: AsyncRequestState
  theme: Theme
}

export type Props = StateProps & DispatchProps & ConsumerProps

const mapStateToProps = (state: ReduxState, { location }: ConsumerProps): StateProps => {
  const { hash, search } = location
  const { redirectTo, fromURI, source } = parse(search.slice(1))
  const newBearerToken = getBearerToken(state, hash)

  return {
    redirectTo: typeof redirectTo === `string` ? redirectTo : undefined,
    fromURI: typeof fromURI === `string` ? fromURI : undefined,
    source: typeof source === `string` ? getRegistrationSource(search) : undefined,
    newBearerToken,
    mfa: getMfa(state),
    loginRequest: getLoginRequest(state),
  }
}

const mapDispatchToProps: DispatchProps = {
  logout,
  redirectAfterLogin,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(UserconsoleLogin)

function getBearerToken(state: ReduxState, hash: string): string | null {
  try {
    if (!isFeatureActivated(state, Feature.basicAuthProxyPass)) {
      return null // the smaller the surface, the better
    }

    const poundlessHash = String(hash).slice(1)
    const hashParams = parse(poundlessHash)
    const newBearerToken = hashParams.bearer_token

    if (typeof newBearerToken !== `string`) {
      return null // the hash might not contain a bearer token, and that's fine
    }

    return newBearerToken
  } catch (err) {
    return null // the hash might not be a query string, and that's fine
  }
}
