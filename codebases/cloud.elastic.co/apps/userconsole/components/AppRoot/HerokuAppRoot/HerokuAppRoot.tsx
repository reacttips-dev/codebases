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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer } from '@elastic/eui'

import LandingPage from '../../../../../components/LandingPage'
import ExternalLink from '../../../../../components/ExternalLink'

import { AsyncRequestState, HerokuAuthenticationParams } from '../../../../../types'

import herokuLogo from '../../../../../files/heroku-logo-greyscale.svg'

import './herokuAppRoot.scss'

type Props = {
  isHeroku: boolean
  isHerokuAuthenticated: boolean
  herokuAuthenticationParams: HerokuAuthenticationParams | null
  herokuAuthHandshakeRequest: AsyncRequestState
  startHerokuAuthHandshake: (authParams: HerokuAuthenticationParams) => void
}

export default class HerokuAppRoot extends Component<Props> {
  componentDidMount() {
    const { isHeroku, herokuAuthenticationParams, startHerokuAuthHandshake } = this.props

    if (!isHeroku) {
      return // sanity
    }

    if (herokuAuthenticationParams !== null) {
      startHerokuAuthHandshake(herokuAuthenticationParams)
    }
  }

  render() {
    const {
      isHeroku,
      isHerokuAuthenticated,
      herokuAuthenticationParams,
      herokuAuthHandshakeRequest,
      children,
    } = this.props

    if (isHeroku) {
      if (herokuAuthHandshakeRequest.error instanceof Error) {
        return this.renderLogin(`heroku-credentials-expired`)
      }

      if (!isHerokuAuthenticated) {
        if (herokuAuthenticationParams) {
          return this.renderLoggingIn()
        }

        return this.renderLogin(`heroku-credentials-missing`)
      }
    }

    return <Fragment>{children}</Fragment>
  }

  renderLogin(dataTestSubj) {
    return this.renderLandingPage({
      loading: false,
      children: (
        <div data-test-id={dataTestSubj}>
          <FormattedMessage
            id='heroku-app-root.please-log-in'
            defaultMessage='Please log in from your {herokuDashboard}'
            values={{
              herokuDashboard: (
                <ExternalLink href='https://dashboard.heroku.com/apps'>
                  <FormattedMessage
                    id='heroku-app-root.heroku-dashboard'
                    defaultMessage='Heroku Dashboard'
                  />
                </ExternalLink>
              ),
            }}
          />
        </div>
      ),
    })
  }

  renderLoggingIn() {
    return this.renderLandingPage({
      loading: true,
      children: (
        <div data-test-id='heroku-credentials-handshake'>
          <FormattedMessage id='heroku-app-root.authenticating' defaultMessage='Authenticating …' />
        </div>
      ),
    })
  }

  renderLandingPage({ loading, children }: { loading: boolean; children: JSX.Element }) {
    return (
      <LandingPage loading={loading}>
        <div className='herokuAppRoot-herokuLogo'>
          <ExternalLink href='https://dashboard.heroku.com/apps'>
            <img src={herokuLogo} />
          </ExternalLink>
        </div>

        <EuiSpacer size='l' />

        {children}
      </LandingPage>
    )
  }
}
