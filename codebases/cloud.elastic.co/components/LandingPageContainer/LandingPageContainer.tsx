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

import React, { ReactNode, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import cx from 'classnames'

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiTitle } from '@elastic/eui'
import Footer from './Footer'

import './landingPageContainer.scss'

import { Theme } from '../../types'

type Props = {
  children: ReactNode
  className?: string
  scrollPage?: boolean
  loading?: boolean
  linkElastic?: boolean
  cloudStatusUrl: string
  theme: Theme
}

const LandingPageContainer: FunctionComponent<Props> = ({
  children,
  className,
  scrollPage = false,
  loading = false,
  cloudStatusUrl,
}) => (
  <div
    className={cx(
      ['landing-container', className],
      scrollPage ? 'scroll-landing' : 'static-landing',
    )}
  >
    <EuiFlexGroup
      className='landing-page-wrapper'
      gutterSize='none'
      alignItems='flexStart'
      wrap={true}
      responsive={false}
    >
      <EuiFlexItem>
        <div className='titlePane-panel'>
          <div className={'landing-container-logo-wrapper'}>
            <div className={cx('loading-indicator', { loading })} />
            <EuiIcon type='logoElastic' size='original' aria-label='Elastic Cloud' />
          </div>
        </div>
        <EuiTitle className='landing-container-title'>
          <h3>
            <FormattedMessage
              id='landing-container-page.page-title'
              defaultMessage='Elastic Cloud'
            />
          </h3>
        </EuiTitle>
      </EuiFlexItem>

      <EuiFlexItem className='landing-container-body'>{children}</EuiFlexItem>

      <EuiFlexItem className='landing-container-wrapper-footer'>
        <Footer cloudStatusUrl={cloudStatusUrl} />
      </EuiFlexItem>
    </EuiFlexGroup>
  </div>
)

export default LandingPageContainer
