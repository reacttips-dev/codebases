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

import React, { PureComponent, ReactElement } from 'react'

import AppLoadingRoot from '../../AppLoadingRoot'

import { RegistrationSource } from '../../../actions/auth/auth'

import { buildSignInQuery, MarketoParamsType } from '../../../lib/urlUtils'
import { hasRedirectOnMount, redirectOnMount } from '../../../lib/auth'

export interface Props {
  loginWithAzure: (
    args?: { fromURI?: string; source?: RegistrationSource } & MarketoParamsType,
  ) => void
  queryString: string
  redirectTo?: string
  newBearerToken: string | null
  redirectAfterLogin: (redirectTo: string) => () => void
}

class AzureLogin extends PureComponent<Props> {
  componentDidMount(): void {
    const { loginWithAzure, queryString, redirectAfterLogin, redirectTo, newBearerToken } =
      this.props
    const query = buildSignInQuery({ search: queryString, withReferrer: true })

    if (hasRedirectOnMount(newBearerToken)) {
      redirectOnMount({ redirectAfterLogin, redirectTo, newBearerToken })
      return
    }

    loginWithAzure(query)
  }

  render(): ReactElement {
    return <AppLoadingRoot />
  }
}

export default AzureLogin
