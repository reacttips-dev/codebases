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

import React, { Fragment, Component } from 'react'

import VerifyEmailBanner from './VerifyEmailBanner'
import UsageNotice from './UsageNotice'

import { UserProfile } from '../../../../types'

import './notificationBanner.scss'

type Props = {
  loggedIn: boolean
  accountDetails: UserProfile
  fetchAccountDetails: () => void
}

class NotificationBanner extends Component<Props> {
  componentDidMount() {
    const { accountDetails, fetchAccountDetails, loggedIn } = this.props

    if (!loggedIn) {
      return
    }

    if (!accountDetails) {
      fetchAccountDetails()
    }
  }

  render() {
    const { accountDetails, loggedIn } = this.props

    if (!loggedIn) {
      return null
    }

    if (!accountDetails) {
      return null
    }

    return (
      <Fragment>
        <UsageNotice accountDetails={accountDetails} />
        <VerifyEmailBanner accountDetails={accountDetails} />
      </Fragment>
    )
  }
}

export default NotificationBanner
