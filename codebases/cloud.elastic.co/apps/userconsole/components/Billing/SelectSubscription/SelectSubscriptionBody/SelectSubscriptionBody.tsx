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
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiText, EuiModalHeader, EuiModalBody } from '@elastic/eui'

import SubscriptionCard from './SubscriptionCard'

import {
  getSubscriptionsWithHourlyRates,
  isPrepaidConsumptionCustomer,
} from '../../../../../../lib/billing'

import { AsyncRequestState, BillingSubscriptionLevel, UserProfile } from '../../../../../../types'
import { LineItem } from '../../../../../../lib/api/v1/types'

import messages, { billingSubscriptions } from '../messages'

import './selectSubscriptionBody.scss'

export type Props = {
  intl: IntlShape
  updateBillingLevelRequest: AsyncRequestState
  activity: {
    month_so_far: any
    now: any
  }
  prepaidBalanceLineItems: LineItem[]
  profile: UserProfile
  onSelectSubscription: (subscription: any) => void
  selectedSubscription: BillingSubscriptionLevel
  resetUpdateBillingLevel: () => void
  onSeeReviewChanges?: () => void
}

class SelectSubscriptionBody extends Component<Props> {
  componentWillUnmount() {
    const { resetUpdateBillingLevel } = this.props

    resetUpdateBillingLevel()
  }

  render() {
    const {
      intl: { formatMessage },
      activity,
      selectedSubscription,
      onSelectSubscription,
    } = this.props

    const subscriptions = billingSubscriptions(formatMessage)
    const subscriptionsWithRates = subscriptions.map((subscription) =>
      getSubscriptionsWithHourlyRates({ subscription, activity }),
    )

    return (
      <Fragment>
        <EuiModalHeader>
          <EuiFlexGroup gutterSize='s' direction='column'>
            <EuiFlexItem>
              <EuiText>
                <h3>
                  <FormattedMessage {...messages.modalTitle} />
                </h3>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText color='subdued'>
                <p>
                  <FormattedMessage {...messages.modalDescription} />
                </p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiModalHeader>
        <EuiModalBody className='subscriptionModalBody'>
          <EuiFlexGroup style={{ margin: 0 }} gutterSize='l'>
            {subscriptionsWithRates.map((subscription, i) => (
              <EuiFlexItem style={{ margin: '8px', width: '25%' }} key={i}>
                <SubscriptionCard
                  data-test-id={`subscription-card-${subscription.value}`}
                  onClick={() => onSelectSubscription(subscription)}
                  selected={selectedSubscription === subscription.value}
                  subscription={subscription}
                  hasActivePrepaidBalanceLineItems={this.hasActivePrepaidBalanceLineItems()}
                />
              </EuiFlexItem>
            ))}
          </EuiFlexGroup>
        </EuiModalBody>
      </Fragment>
    )
  }

  hasActivePrepaidBalanceLineItems(): boolean {
    const { prepaidBalanceLineItems, profile } = this.props

    if (!isPrepaidConsumptionCustomer(profile)) {
      return false
    }

    const activeItems = prepaidBalanceLineItems.filter(({ active }) => active)
    return activeItems.length > 0
  }
}

export default injectIntl(SelectSubscriptionBody)
