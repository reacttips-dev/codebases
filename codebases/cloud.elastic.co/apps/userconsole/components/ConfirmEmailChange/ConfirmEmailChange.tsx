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

import { EuiTitle, EuiSpacer, EuiText } from '@elastic/eui'

import history from '../../../../lib/history'
import { accountDetailsUrl } from '../../urls'
import LandingPage from '../../../../components/LandingPage'
import { AsyncRequestState } from '../../../../types'
import { supportUrl, userSettingsUrl } from '../../../../lib/urlBuilder'
import { CuiLink } from '../../../../cui'
import { isFeatureActivated } from '../../../../store'
import Feature from '../../../../lib/feature'

type Props = {
  // These three are nullable because they come from the URL, so we can't guarantee their presence.
  email: string | null
  newEmail: string | null
  hash: string | null
  expires: number | null
  confirmEmailChange: (email: string, newEmail: string, expires: number, hash: string) => void
  confirmEmailChangeRequest: AsyncRequestState
}

enum ViewState {
  INIT = 'INIT',
  CONFIRMING = 'CONFIRMING',
  CONFIRMATION_FAILED = 'CONFIRMATION_FAILED',
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
    const { confirmEmailChangeRequest } = this.props
    const { viewState } = this.state

    return (
      <LandingPage
        loading={viewState === ViewState.CONFIRMING || confirmEmailChangeRequest.inProgress}
      >
        <div className='activateAccount-wrapper'>
          <Fragment>
            <EuiTitle>
              <h1>
                <FormattedMessage
                  id='activate-account.title'
                  defaultMessage='Welcome to Elastic Cloud'
                />
              </h1>
            </EuiTitle>

            <EuiSpacer size='xs' />

            {this.renderContent()}
          </Fragment>
        </div>
      </LandingPage>
    )
  }

  renderContent() {
    const { viewState } = this.state

    switch (viewState) {
      case ViewState.INIT:
      case ViewState.CONFIRMING:
        return (
          <EuiText color='subdued' size='s'>
            <FormattedMessage
              id='activate-account.fetching-details'
              defaultMessage='Fetching your details …'
            />
          </EuiText>
        )

      case ViewState.CONFIRMATION_FAILED:
        return (
          <EuiText color='subdued' size='s'>
            <FormattedMessage
              data-test-id='fetch-details-failed'
              id='confirm-email.failed'
              defaultMessage="Your details couldn't be fetched. Please {link}."
              values={{
                link: (
                  <CuiLink to={supportUrl()}>
                    <FormattedMessage
                      id='confirm-email.contact-support'
                      defaultMessage='contact Support'
                    />
                  </CuiLink>
                ),
              }}
            />
          </EuiText>
        )

      default:
        return null
    }
  }

  calculateViewState(props: Props) {
    const { confirmEmailChange, confirmEmailChangeRequest } = props

    switch (this.state.viewState) {
      case ViewState.INIT: {
        if (
          !confirmEmailChangeRequest.inProgress &&
          !confirmEmailChangeRequest.isDone &&
          !confirmEmailChangeRequest.error
        ) {
          const { email, newEmail, hash, expires } = props

          if (email && newEmail && hash && expires) {
            confirmEmailChange(email, newEmail, expires, hash)
            this.setState({ viewState: ViewState.CONFIRMING })
          } else {
            // If our parameters are absent then someone has accessed a bad URL. Redirect since there's
            // nothing else to be done.
            history.replace(`/`)
          }
        }

        break
      }

      case ViewState.CONFIRMING:
        if (confirmEmailChangeRequest.error) {
          this.setState({ viewState: ViewState.CONFIRMATION_FAILED })
        } else if (confirmEmailChangeRequest.isDone) {
          isFeatureActivated(Feature.cloudPortalEnabled)
            ? history.replace(userSettingsUrl())
            : history.replace(accountDetailsUrl())
        }

        break

      default:
        break
    }
  }
}
