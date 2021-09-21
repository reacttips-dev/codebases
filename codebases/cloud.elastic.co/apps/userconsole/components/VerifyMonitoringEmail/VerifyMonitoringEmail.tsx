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
import { FormattedMessage } from 'react-intl'

import { EuiTitle } from '@elastic/eui'

import history from '../../../../lib/history'
import LandingPage from '../../../../components/LandingPage'
import { AsyncRequestState } from '../../../../types'

import './verifyMonitoringEmail.scss'
import { CuiLink } from '../../../../cui'
import { supportUrl } from '../../../../lib/urlBuilder'

type Props = {
  // These three are nullable because they come from the URL, so we can't guarantee their presence.
  email: string | null
  hash: string | null
  expires: number | null
  whitelistMonitoringEmailRequest: AsyncRequestState
  whitelistMonitoringEmail: (email: string, expires: number, hash: string) => void
}

enum ViewState {
  INIT = 'INIT',
  VERIFYING = 'VERIFYING',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
}

type State = {
  viewState: ViewState
}

export default class ActivateAccount extends Component<Props, State> {
  state: State = {
    viewState: ViewState.INIT,
  }

  componentDidMount() {
    this.calculateViewState(this.props)
  }

  componentDidUpdate() {
    this.calculateViewState(this.props)
  }

  render() {
    const { whitelistMonitoringEmailRequest } = this.props
    const { viewState } = this.state
    return (
      <LandingPage
        loading={viewState === ViewState.VERIFYING || whitelistMonitoringEmailRequest.inProgress}
      >
        <div>
          <EuiTitle>
            <h1>
              <FormattedMessage
                id='verify-monitoring-email.title'
                defaultMessage='Monitoring Email Verification'
              />
            </h1>
          </EuiTitle>
          {this.renderContent()}
        </div>
      </LandingPage>
    )
  }

  renderContent() {
    const { viewState } = this.state

    switch (viewState) {
      case ViewState.INIT:
      case ViewState.VERIFYING:
        return (
          <div>
            <FormattedMessage id='verify-monitoring-email.verifying' defaultMessage='Verifying …' />
          </div>
        )

      case ViewState.VERIFICATION_FAILED:
        return (
          <div data-test-id='verification-failed'>
            <FormattedMessage
              id='verify-monitoring-email.failed'
              defaultMessage='Something went wrong. Please { link }'
              values={{
                link: (
                  <CuiLink to={supportUrl()}>
                    <FormattedMessage
                      id='verify-monitoring-email.contact-support'
                      defaultMessage='contact Support'
                    />
                  </CuiLink>
                ),
              }}
            />
          </div>
        )

      case ViewState.VERIFICATION_SUCCESS:
        return (
          <div className='verifyMonitoringEmail-sucessMessage'>
            <FormattedMessage
              id='verify-monitoring-email.success'
              defaultMessage='Your email has been confirmed. You may now send Monitoring emails to this email.'
            />
          </div>
        )

      default:
        return null
    }
  }

  calculateViewState(props: Props) {
    const { whitelistMonitoringEmailRequest } = props

    switch (this.state.viewState) {
      case ViewState.INIT: {
        if (
          !whitelistMonitoringEmailRequest.inProgress &&
          !whitelistMonitoringEmailRequest.isDone &&
          !whitelistMonitoringEmailRequest.error
        ) {
          const { email, hash, expires, whitelistMonitoringEmail } = props

          if (email && hash && expires) {
            whitelistMonitoringEmail(email, expires, hash)
            this.setState({ viewState: ViewState.VERIFYING })
          } else {
            // If our parameters are absent then someone has accessed a bad URL. Redirect since there's
            // nothing else to be done.
            history.replace(`/`)
          }
        }

        break
      }

      case ViewState.VERIFYING:
        if (whitelistMonitoringEmailRequest.error) {
          this.setState({ viewState: ViewState.VERIFICATION_FAILED })
        } else if (whitelistMonitoringEmailRequest.isDone) {
          this.setState({ viewState: ViewState.VERIFICATION_SUCCESS })
        }

        break

      default:
        break
    }
  }
}
