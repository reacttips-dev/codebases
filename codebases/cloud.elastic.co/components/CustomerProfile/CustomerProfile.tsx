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

import React, { Component, ReactNode, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiTitle } from '@elastic/eui'

import PrivacySensitiveContainer from '../PrivacySensitiveContainer'

import { ProfileState } from '../../types'

import './customerProfile.scss'
import { getUsername } from '../../lib/profile'

type Props = {
  isHeroku: boolean
  isPrivate: boolean
  profile: ProfileState
  userIdFromToken: string | null
  usernameFromToken: string | null
}

export default class CustomerProfile extends Component<Props> {
  render() {
    return (
      <Fragment>
        <div>
          <PrivacySensitiveContainer>
            <EuiTitle size='xs'>
              <h4>{this.renderUsername()}</h4>
            </EuiTitle>
          </PrivacySensitiveContainer>
        </div>
      </Fragment>
    )
  }

  renderUsername(): ReactNode {
    const { isHeroku, profile, userIdFromToken, usernameFromToken } = this.props
    const username = getUsername({ isHeroku, profile, userIdFromToken, usernameFromToken })

    if (username === null) {
      return (
        <FormattedMessage id='customer-profile.unauthenticated' defaultMessage='Unauthenticated' />
      )
    }

    return username
  }
}
