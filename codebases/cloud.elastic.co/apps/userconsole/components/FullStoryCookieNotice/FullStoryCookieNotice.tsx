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

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,

  // @ts-ignore: whatever
  EuiBottomBar,
} from '@elastic/eui'

import ExternalLink from '../../../../components/ExternalLink'

import LocalStorageKey from '../../../../constants/localStorageKeys'

import './fullStoryCookieNotice.scss'

const elasticCoReferrer = /^https?:\/\/([^\/]+\.)?elastic\.co(\/|$)/i

type Props = {
  isFullStoryEnabled: boolean
  children?: ReactNode
}

type State = {
  showCookieNotice: boolean
}

class FullStoryCookieNotice extends Component<Props, State> {
  state: State = {
    showCookieNotice: shouldShowCookieNotice(this.props),
  }

  render() {
    const { children } = this.props
    const { showCookieNotice } = this.state

    return (
      <Fragment>
        {children}

        {showCookieNotice && (
          <EuiBottomBar paddingSize='s'>
            <EuiFlexGroup gutterSize='s' alignItems='center' justifyContent='spaceBetween'>
              <EuiFlexItem grow={false}>
                <div className='cookieNotice-legal'>
                  <EuiText size='xs'>
                    <FormattedMessage
                      id='cookie-notice.legal-notice'
                      defaultMessage='This website or its third-party tools use cookies, which are necessary to its functioning and required to achieve the purposes illustrated in the {cookiePolicy}. If you want to know more or withdraw your consent to all or some of the cookies, please refer to the {cookiePolicy}.'
                      values={{
                        cookiePolicy: (
                          <ExternalLink
                            href='https://www.elastic.co/legal/privacy-statement'
                            color='ghost'
                          >
                            <FormattedMessage
                              id='cookie-notice.cookie-policy'
                              defaultMessage='cookie policy'
                            />
                          </ExternalLink>
                        ),
                      }}
                    />

                    <br />

                    <FormattedMessage
                      id='cookie-notice.legal-implicit-agreement'
                      defaultMessage='By closing this banner, scrolling this page, clicking a link or continuing to browse otherwise, you agree to the use of cookies.'
                    />
                  </EuiText>
                </div>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  color='ghost'
                  size='s'
                  iconType='check'
                  onClick={this.dismissCookieNotice}
                >
                  <FormattedMessage id='cookie-notice.dismiss' defaultMessage='Dismiss' />
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiBottomBar>
        )}
      </Fragment>
    )
  }

  dismissCookieNotice = () => {
    this.setState({ showCookieNotice: false })
    localStorage.setItem(LocalStorageKey.acceptCookiesDismissed, `true`)
  }
}

export default FullStoryCookieNotice

function shouldShowCookieNotice({ isFullStoryEnabled }: Props): boolean {
  if (!isFullStoryEnabled) {
    return false
  }

  const implicitAgreement = localStorage.getItem(LocalStorageKey.acceptCookiesDismissed) === `true`

  if (implicitAgreement) {
    return false
  }

  const cameFromElasticCo = elasticCoReferrer.test(document.referrer)

  if (cameFromElasticCo) {
    return false
  }

  return true
}
