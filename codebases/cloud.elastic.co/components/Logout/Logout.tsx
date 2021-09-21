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

import React, { Component, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import LandingPage from '../LandingPage'
import LandingPageContainer from '../LandingPageContainer/NewLandingPageContainer'

import { getConfigForKey } from '../../store'

import lock from '../../files/cloud-lock-white.svg'
import lockDark from '../../files/cloud-lock-dark.svg'

import './logout.scss'

type Props = {
  logout: ({ redirectTo }: { redirectTo?: string }) => void
  isUnauthorised: boolean
  redirectTo?: string
}

class Logout extends Component<Props> {
  componentDidMount(): void {
    const { logout, redirectTo } = this.props

    logout({ redirectTo })
  }

  render(): ReactElement {
    const isEssUserconsole =
      getConfigForKey(`APP_PLATFORM`) === `saas` && getConfigForKey(`APP_NAME`) === `userconsole`

    if (isEssUserconsole) {
      return (
        <LandingPageContainer
          image={lock}
          darkImage={lockDark}
          title={this.renderLogoutMessage()}
          subtitle={this.renderIsUnauthorisedMessage()}
          panelProps={{
            className: 'logout-content-panel',
            hasShadow: false,
            hasBorder: false,
            style: { background: 'transparent' },
          }}
        />
      )
    }

    return (
      <LandingPage loading={true}>
        <div data-test-id='logout-page'>{this.renderLogoutMessage()}</div>
      </LandingPage>
    )
  }

  renderLogoutMessage(): ReactElement {
    const { isUnauthorised } = this.props

    if (isUnauthorised) {
      return (
        <FormattedMessage
          id='logout.processing-for-unauthorised.redirecting'
          defaultMessage='Redirecting to login page …'
        />
      )
    }

    return <FormattedMessage id='logout.processing' defaultMessage='Logging out' />
  }

  renderIsUnauthorisedMessage(): ReactElement | null {
    const { isUnauthorised } = this.props

    if (!isUnauthorised) {
      return null
    }

    return (
      <FormattedMessage
        id='logout.processing-for-unauthorised'
        defaultMessage='You are not logged in or your session has expired.'
      />
    )
  }
}

export default Logout
