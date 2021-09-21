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
import { Link } from 'react-router-dom'
import moment from 'moment'

import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import TrialWelcome from '../TrialWelcome'

import { accountBillingUrl } from '../../../apps/userconsole/urls'

import { isEsStopped } from '../../../lib/stackDeployments'

import { ProfileState } from '../../../types'
import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

type Props = {
  profile: NonNullable<ProfileState>
  deployments: DeploymentSearchResponse[] | null
}

class TrialState extends Component<Props> {
  render() {
    const { deployments, profile } = this.props

    if (!deployments) {
      return null
    }

    const { canExtendTrial } = profile
    const emptyDeploymentsArray = deployments && deployments.length < 1

    if (profile.hasExpiredTrial) {
      if (emptyDeploymentsArray) {
        return this.renderTrialEnded()
      }

      if (this.isEveryEsStopped()) {
        return this.renderTrialEndedAndDeploymentsStopped()
      }

      return this.renderTrialEndedAndDeploymentsRunning()
    }

    if (emptyDeploymentsArray && canExtendTrial) {
      return this.renderTrialWelcome()
    }

    return null
  }

  renderTrialEnded() {
    return (
      <Fragment>
        <EuiCallOut
          data-test-id='trial-ended'
          title={
            <FormattedMessage
              id='deployments.trial-expired'
              defaultMessage='Your trial has ended'
            />
          }
          iconType='clock'
        >
          <p>
            <FormattedMessage
              id='deployments.trial-expired-description'
              defaultMessage='Unfortunately your trial has ended. {addCreditCard} to continue using the Elasticsearch Service.'
              values={{
                addCreditCard: (
                  <Link to={accountBillingUrl()}>
                    <FormattedMessage
                      id='deployments.trial-expired-description.billing-details-link'
                      defaultMessage='Add a credit card'
                    />
                  </Link>
                ),
              }}
            />
          </p>
        </EuiCallOut>
        <EuiSpacer />
      </Fragment>
    )
  }

  renderTrialEndedAndDeploymentsStopped() {
    const daysToCleanup = this.getDaysUntilCleanup()

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='deployment-was-terminated'
          title={
            <FormattedMessage
              id='deployments.trial-expired.was-terminated'
              defaultMessage='Your deployment was terminated'
            />
          }
          color='danger'
          iconType='clock'
        >
          <p className='addCreditCardLink'>
            <FormattedMessage
              id='deployments.trial-expired-description.was-terminated'
              defaultMessage='Your trial period is over and your deployment has been terminated. {addCreditCard} to prevent your deployment from being completely deleted {daysToCleanup}.'
              values={{
                addCreditCard: (
                  <Link to={accountBillingUrl()}>
                    <FormattedMessage
                      id='deployments.trial-expired-description.was-terminated.billing-details-link'
                      defaultMessage='Add a credit card'
                    />
                  </Link>
                ),
                daysToCleanup:
                  daysToCleanup > 0 ? (
                    <FormattedMessage
                      id='deployments.trial-expired-description.was-terminated.days'
                      defaultMessage='in {days} {days, plural, one {day} other {days}}'
                      values={{
                        days: daysToCleanup,
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id='deployments.trial-expired-description.soon'
                      defaultMessage='soon'
                    />
                  ),
              }}
            />
          </p>
        </EuiCallOut>

        <EuiSpacer />
      </Fragment>
    )
  }

  renderTrialEndedAndDeploymentsRunning() {
    const daysToTermination = this.getDaysUntilTermination()
    return (
      <Fragment>
        <EuiCallOut
          data-test-id='deployment-will-be-terminated'
          title={
            <FormattedMessage
              id='deployments.trial-expired.will-be-terminated'
              defaultMessage='Your deployment will be terminated'
            />
          }
          color='warning'
          iconType='clock'
        >
          <p>
            <FormattedMessage
              id='deployments.trial-expired-description.will-be-terminated'
              defaultMessage='Even though our trial has ended, you still have {time} to {addCreditCard} to keep your deployment from being terminated and losing all your data.'
              values={{
                addCreditCard: (
                  <Link to={accountBillingUrl()}>
                    <FormattedMessage
                      id='deployments.trial-expired-description.will-be-terminated.billing-details-link'
                      defaultMessage='add a credit card'
                    />
                  </Link>
                ),
                time:
                  daysToTermination > 0 ? (
                    <FormattedMessage
                      id='deployments.trial-expired-description.will-be-terminated.days'
                      defaultMessage='{days} {days, plural, one {day} other {days}}'
                      values={{
                        days: daysToTermination,
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id='deployments.trial-expired-description.some-time'
                      defaultMessage='some time'
                    />
                  ),
              }}
            />
          </p>
        </EuiCallOut>
        <EuiSpacer />
      </Fragment>
    )
  }

  renderTrialWelcome() {
    const { profile } = this.props
    return <TrialWelcome profile={profile} />
  }

  isEveryEsStopped() {
    const { deployments } = this.props
    return deployments && deployments.every((deployment) => isEsStopped({ deployment }))
  }

  getCleanupDate() {
    return this.getDateOfAction({ daysToAction: 30 })
  }

  getDaysUntilCleanup() {
    const cleanupDate = this.getCleanupDate()
    const currentDate = moment().startOf('day')
    return cleanupDate ? Math.floor(moment.duration(cleanupDate.diff(currentDate)).asDays()) : 0
  }

  getTerminationDate() {
    return this.getDateOfAction({ daysToAction: 3 })
  }

  getDaysUntilTermination() {
    const terminationDate = this.getTerminationDate()
    const currentDate = moment().startOf('day')
    return terminationDate
      ? Math.floor(moment.duration(terminationDate.diff(currentDate)).asDays())
      : 0
  }

  getDateOfAction({ daysToAction }: { daysToAction: number }) {
    const { profile } = this.props
    const { currentTrial } = profile

    if (!currentTrial || !currentTrial.end) {
      return null
    }

    const currentDate = moment().startOf('day')

    if (moment(currentTrial.end).isBefore(currentDate)) {
      return moment(currentTrial.end).add(daysToAction, 'days')
    }

    return null
  }
}

export default TrialState
