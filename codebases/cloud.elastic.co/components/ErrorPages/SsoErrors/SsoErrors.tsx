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
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'

import { EuiLoadingContent, EuiEmptyPrompt, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

import { CuiRouterLinkButton } from '../../../cui'

import HttpErrorPage from '../HttpErrorPage'

import { describeSsoError } from '../../../lib/ssoErrors'

import { loginUrl } from '../../../lib/urlBuilder'

export interface Props {
  intl: IntlShape
  loggedIn: boolean
  isPortalFeatureEnabled: boolean
  errorCode: string | null
  redirectToPortal: () => void
}

class SsoErrors extends Component<Props> {
  componentDidMount() {
    const { redirectToPortal, isPortalFeatureEnabled } = this.props

    if (isPortalFeatureEnabled) {
      redirectToPortal()
    }
  }

  render() {
    const {
      intl: { formatMessage },
      loggedIn,
      isPortalFeatureEnabled,
      errorCode,
    } = this.props

    if (isPortalFeatureEnabled) {
      return <EuiLoadingContent />
    }

    const { title, description } = describeSsoError(errorCode)

    return (
      <HttpErrorPage>
        <EuiEmptyPrompt
          titleSize='m'
          title={<h2>{formatMessage(title)}</h2>}
          body={<EuiText size='s'>{formatMessage(description)}</EuiText>}
          actions={
            <EuiFlexGroup justifyContent='center' alignItems='center' gutterSize='l'>
              {loggedIn ? (
                <EuiFlexItem grow={false}>
                  <div>
                    <CuiRouterLinkButton fill={true} to='/' color='primary'>
                      <FormattedMessage id='sso-errors.home-button' defaultMessage='Home' />
                    </CuiRouterLinkButton>
                  </div>
                </EuiFlexItem>
              ) : (
                <EuiFlexItem grow={false}>
                  <div>
                    <CuiRouterLinkButton fill={true} to={loginUrl()}>
                      <FormattedMessage
                        id='sso-errors.cloud-login-button'
                        defaultMessage='Log in to Cloud'
                      />
                    </CuiRouterLinkButton>
                  </div>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          }
        />
      </HttpErrorPage>
    )
  }
}

export default injectIntl(SsoErrors)
