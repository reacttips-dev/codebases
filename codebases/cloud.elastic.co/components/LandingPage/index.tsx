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

import React, { FunctionComponent } from 'react'
import cx from 'classnames'

import { EuiIcon, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import SupportFooter from './SupportFooter'

import './landingPage.scss'

type Props = {
  loading?: boolean
  children: JSX.Element | JSX.Element[]
  className?: string
  includeSupportFooter?: boolean
  scrollPage?: boolean
}

const LandingPage: FunctionComponent<Props> = ({
  loading,
  children,
  className,
  includeSupportFooter = true,
  scrollPage = false,
}) => (
  <div className={cx('landing-page', scrollPage ? 'scroll-landing' : 'static-landing')}>
    <EuiFlexGroup className='landing-page-wrapper' gutterSize='none'>
      <EuiFlexItem className='left'>
        <div className='landing-page-logo-wrapper'>
          <div className={cx(`loading-indicator`, { loading })} />
          <EuiIcon type='logoElastic' size='original' aria-label='Elastic' />
        </div>

        <div className={cx(`left-content`, className)}>{children}</div>

        {includeSupportFooter ? <SupportFooter /> : null}
      </EuiFlexItem>

      <EuiFlexItem className='right' />
    </EuiFlexGroup>
  </div>
)

export default LandingPage
