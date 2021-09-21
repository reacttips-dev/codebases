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

import React, { Component } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import { RouteComponentProps } from 'react-router-dom'
import { parse } from 'query-string'

import AppLoadingRoot from '../../AppLoadingRoot'

import history from '../../../lib/history'

import { AsyncRequestState } from '../../../types'

export type Props = {
  authorizeSaasOauthToken: (args: {
    state: string | null
    code: string | null
    idp_id: string
    settings?: string
  }) => void
  location: RouteComponentProps['location']
  authorizeSaasOauthTokenRequest: AsyncRequestState
  idp: string
  redirectAfterLogin: (redirectTo: string) => () => void
  loginUrl: string
}

class OAuthLogin extends Component<Props & WrappedComponentProps> {
  componentDidMount() {
    const { authorizeSaasOauthToken, idp, loginUrl } = this.props

    const { state, code, settings } = this.getHashParameters()

    if (!this.hasValidHashParameters()) {
      history.push(loginUrl)
      return
    }

    authorizeSaasOauthToken({ state, code, idp_id: idp, settings })
  }

  componentDidUpdate() {
    const { authorizeSaasOauthTokenRequest, loginUrl } = this.props

    if (authorizeSaasOauthTokenRequest.error) {
      history.push(loginUrl)
      return
    }
  }

  render() {
    if (!this.hasValidHashParameters()) {
      return null
    }

    return <AppLoadingRoot />
  }

  getHashParameters(): {
    state: string | null
    code: string | null
    settings?: string
  } {
    const { location } = this.props
    const params = parse(location.hash.slice(1))

    return {
      code: typeof params.code === `string` ? params.code : null,
      state: typeof params.state === `string` ? params.state : null,
      settings: typeof params.settings === `string` ? params.settings : undefined,
    }
  }

  hasValidHashParameters(): boolean {
    const { state, code } = this.getHashParameters()
    return state !== null && code !== null
  }
}

export default injectIntl(OAuthLogin)
