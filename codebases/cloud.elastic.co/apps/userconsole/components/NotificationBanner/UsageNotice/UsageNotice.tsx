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
import { EuiFlexItem, EuiText, EuiLink } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

import ReviewChangesLink from './ReviewChangesLink'
import SelectSubscriptionModal from '../../Billing/SelectSubscription'
import ReviewSubscriptionChangesModal from '../../Billing/ReviewSubscriptionChangesModal'

import { isUsageOutOfCompliance } from '../../../../../lib/usage'
import { isElasticStaff } from '../../../../../lib/billing'

import { UserProfile } from '../../../../../types'
import { FeaturesUsage } from '../../../../../lib/api/v1/types'

import './usageNotice.scss'

export type Props = {
  usageDetails: FeaturesUsage
  fetchUsageDetails: () => void
  accountDetails: UserProfile
  activity: {
    month_so_far: any
    now: any
  }
  fetchAccountActivity: () => void
}

type State = {
  showChangeSubscriptionModal: boolean
  showReviewChangesModal: boolean
  upgradeLevel: string | undefined
}

class UsageNotice extends Component<Props, State> {
  state = {
    showChangeSubscriptionModal: false,
    showReviewChangesModal: false,
    upgradeLevel: undefined,
  }

  componentDidMount() {
    const { usageDetails, fetchUsageDetails, activity, fetchAccountActivity } = this.props

    if (!usageDetails) {
      fetchUsageDetails()
    }

    if (!activity) {
      fetchAccountActivity()
    }
  }

  render() {
    const { usageDetails } = this.props
    const { upgradeLevel } = this.state

    if (!usageDetails) {
      return null
    }

    const { usage_level } = usageDetails
    const showUsageBanner = this.getShowUsageBanner()

    if (showUsageBanner) {
      return (
        <Fragment>
          <EuiFlexItem data-test-id='usage-notice' className='usageNotice'>
            <EuiText textAlign='center' size='s'>
              {this.renderMessage()}
            </EuiText>
          </EuiFlexItem>
          {this.state.showChangeSubscriptionModal && (
            <SelectSubscriptionModal
              upgradeLevel={upgradeLevel}
              closeModal={() =>
                this.setState({ showChangeSubscriptionModal: false, upgradeLevel: undefined })
              }
              onSeeReviewChanges={() =>
                this.setState({ showChangeSubscriptionModal: false, showReviewChangesModal: true })
              }
            />
          )}
          {this.state.showReviewChangesModal && (
            <ReviewSubscriptionChangesModal
              usageDetails={usageDetails}
              closeModal={() => this.setState({ showReviewChangesModal: false })}
              onUpgrade={() => this.onUpgrade(usage_level)}
            />
          )}
        </Fragment>
      )
    }

    return null
  }

  renderMessage() {
    const { accountDetails } = this.props
    const isAnnual = accountDetails.contract_type === `annual`

    if (isAnnual) {
      return (
        <FormattedMessage
          data-test-id='annual-usage-notice'
          id='annual-usage-notice.message'
          defaultMessage={`Your subscription level doesn't match the features you are using. Talk to your sales representative to upgrade your subscription or {removeFeatures}.`}
          values={{
            removeFeatures: (
              <ReviewChangesLink onReviewChanges={() => this.onReviewChanges()} isAnnual={true} />
            ),
          }}
        />
      )
    }

    return (
      <FormattedMessage
        data-test-id='monthly-usage-notice'
        id='usage-notices.message'
        defaultMessage={`Your subscription level doesn't match the features that you're using. {changeSubscription} or {reviewChanges}.`}
        values={{
          changeSubscription: (
            <EuiLink onClick={() => this.onChangeSubscription()} className='changeSubscriptionLink'>
              <FormattedMessage
                id='usage-notices.message.change-subscription'
                defaultMessage='Change your subscription'
              />
            </EuiLink>
          ),
          reviewChanges: <ReviewChangesLink onReviewChanges={() => this.onReviewChanges()} />,
        }}
      />
    )
  }

  onChangeSubscription() {
    this.setState({ showChangeSubscriptionModal: true })
  }

  onReviewChanges() {
    this.setState({ showReviewChangesModal: true })
  }

  onUpgrade(upgradeLevel) {
    this.setState({
      showReviewChangesModal: false,
      showChangeSubscriptionModal: true,
      upgradeLevel,
    })
  }

  getShowUsageBanner() {
    const { usageDetails, accountDetails } = this.props
    const { subscription_level, usage_level } = usageDetails
    const outOfCompliace = isUsageOutOfCompliance({
      subscriptionLevel: subscription_level,
      usageLevel: usage_level,
    })
    const { email } = accountDetails

    if (isElasticStaff({ email })) {
      // We don't want to show the banner to elastic employees
      return false
    }

    return outOfCompliace && !accountDetails.is_trial
  }
}

export default UsageNotice
