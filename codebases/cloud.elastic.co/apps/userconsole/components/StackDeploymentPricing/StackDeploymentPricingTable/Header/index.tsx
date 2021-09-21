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

import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import { CuiRouterLinkButton, CuiThemedIcon } from '../../../../../../cui'

import { loginUrl, registerUrl } from '../../../../../../lib/urlBuilder'

import './header.scss'

import elasticLogo from '../../../../../../files/elastic-logo-H-color.png'
import elasticLogoDark from '../../../../../../files/elastic-logo-H-color-dark.png'

const Header = (): ReactElement => (
  <EuiFlexGroup
    className='stack-deployment-pricing-table-header'
    alignItems='center'
    responsive={false}
  >
    <EuiFlexItem>
      <Link to='/'>
        <CuiThemedIcon
          size='xxl'
          lightType={elasticLogo}
          darkType={elasticLogoDark}
          className='cloud-signup-page-elastic-logo'
        />
      </Link>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiFlexGroup
        gutterSize='m'
        alignItems='flexEnd'
        justifyContent='flexEnd'
        className='stack-deployment-pricing-table-header-buttons'
        responsive={false}
      >
        <EuiFlexItem grow={false}>
          <CuiRouterLinkButton
            size='s'
            fill={true}
            className='stack-deployment-pricing-table-login-link'
            data-test-id='stack-deployment-pricing-table.login-link'
            to={loginUrl}
          >
            <FormattedMessage id='stack-deployment-pricing-table.login' defaultMessage='Login' />
          </CuiRouterLinkButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <CuiRouterLinkButton
            size='s'
            fill={true}
            className='stack-deployment-pricing-table-free-link'
            data-test-id='stack-deployment-pricing-table.try-free-link'
            to={registerUrl}
          >
            <FormattedMessage
              id='stack-deployment-pricing-table.try-free'
              defaultMessage='Try free'
            />
          </CuiRouterLinkButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default Header
