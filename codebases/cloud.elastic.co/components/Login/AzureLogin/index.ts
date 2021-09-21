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

import { loginWithAzure, RegistrationSource, redirectAfterLogin } from '../../../actions/auth/auth'

import { getBearerToken } from '../../../lib/auth'
import { MarketoParamsType } from '../../../lib/urlUtils'
import { ReduxState } from '../../../types/redux'

import AzureLogin from './AzureLogin'

interface ConsumerProps extends RouteComponentProps {}

interface DispatchProps {
  loginWithAzure: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  redirectAfterLogin: (redirectTo: string) => () => void
}

interface StateProps {
  redirectTo?: string
  queryString: string
  newBearerToken: string | null
}

const mapStateToProps = (_state: ReduxState, { location }: ConsumerProps): StateProps => {
  const { search, hash } = location
  const { redirectTo } = parse(location.search.slice(1))
  const newBearerToken = getBearerToken(hash)

  return {
    redirectTo: typeof redirectTo === 'string' ? redirectTo : undefined,
    newBearerToken,
    queryString: search,
  }
}

const mapDispatchToProps = {
  redirectAfterLogin,
  loginWithAzure,
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(AzureLogin)
