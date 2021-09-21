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

import React, { PureComponent, ReactElement } from 'react'
import { CuiThemedIcon } from '../../../../cui'

import LoginButton from './LoginButton'
import SignupButton from './SignupButton'

import elasticLogo from '../../../../files/elastic-logo-H-color.png'
import elasticLogoDark from '../../../../files/elastic-logo-H-color-dark.png'

import './header.scss'

interface Props {
  type?: 'login' | 'signup'
  locationQueryString: string
}

class Header extends PureComponent<Props> {
  render(): ReactElement {
    return (
      <div className='cloud-landing-page-logo'>
        {this.renderButton()}

        <CuiThemedIcon
          size='xxl'
          lightType={elasticLogo}
          darkType={elasticLogoDark}
          className='cloud-landing-page-elastic-logo'
        />
      </div>
    )
  }

  renderButton(): ReactElement | null {
    const { type, locationQueryString } = this.props

    if (!type) {
      return null
    }

    if (type === 'login') {
      return <LoginButton locationQueryString={locationQueryString} />
    }

    return <SignupButton locationQueryString={locationQueryString} />
  }
}

export default Header
