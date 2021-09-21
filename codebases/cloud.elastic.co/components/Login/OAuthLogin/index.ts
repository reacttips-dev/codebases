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

import OAuthLogin from './OAuthLogin'
import { authorizeSaasOauthToken, redirectAfterLogin } from '../../../actions/auth'

import { authorizeSaasOauthTokenRequest } from '../../../apps/userconsole/reducers'

import { buildLoginUrl } from '../../../lib/urlUtils'
import { AsyncRequestState } from '../../../types'
import { extractIdpFromCookie } from '../../../actions/auth/auth'

type StateProps = {
  authorizeSaasOauthTokenRequest: AsyncRequestState
  idp: string | null
  loginUrl: string
}

type DispatchProps = {
  authorizeSaasOauthToken: (args: {
    state: string | null
    code: string | null
    idp_id: string
    settings?: string
  }) => void
  redirectAfterLogin: (redirectTo: string) => () => void
}

type ConsumerProps = {
  location: RouteComponentProps['location']
}

const mapStateToProps = (state): StateProps => {
  const locationQueryString = location.search

  return {
    authorizeSaasOauthTokenRequest: authorizeSaasOauthTokenRequest(state),
    idp: extractIdpFromCookie(),
    loginUrl: buildLoginUrl({ locationQueryString }),
  }
}

const mapDispatchToProps: DispatchProps = {
  authorizeSaasOauthToken,
  redirectAfterLogin,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(OAuthLogin)
