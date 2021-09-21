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
import React, { Component, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { capitalize } from 'lodash'

import { EuiLoadingSpinner, EuiText } from '@elastic/eui'

import ChangeSubscriptionButton from '../../ChangeSubscriptionButton'
import BillingPanel from '../BillingPanel'
import ExternalLink from '../../../../../../components/ExternalLink'
import DocLink from '../../../../../../components/DocLink'

import { isMarketPlaceUser } from '../../../../../../lib/marketPlace'
import {
  isTrialUser,
  isAnnualCreditCardCustomer,
  isAnnualPurchaseOrderCustomer,
  isMonthlyCustomer,
  isPrepaidConsumptionCustomer,
} from '../../../../../../lib/billing'

import { UserProfile } from '../../../../../../types'

export type Props = {
  isGovCloud?: boolean
  profile: UserProfile
  onChangeSubscription?: () => void
  linkText?: ReactElement
  isLoading: boolean
}

class SubscriptionOverviewPanel extends Component<Props> {
  render(): ReactElement {
    return (
      <BillingPanel
        description={this.renderDescription()}
        footer={<EuiText size='s'>{this.renderSubscriptionInfo()}</EuiText>}
        title={this.renderTitle()}
        button={this.renderChangeSubscriptionButton()}
      />
    )
  }

  renderTitle(): ReactElement {
    return (
      <FormattedMessage
        id='billing-details-summary.subscription-level'
        defaultMessage='Subscription level'
      />
    )
  }

  renderDescription(): ReactElement | string {
    const { isLoading, profile } = this.props

    if (isLoading) {
      return <EuiLoadingSpinner />
    }

    if (isTrialUser(profile)) {
      return <FormattedMessage id='trial-billing-cycle.trial' defaultMessage='Trial' />
    }

    return capitalize(profile.level)
  }

  renderSubscriptionInfo(): ReactElement | null {
    const { isGovCloud, profile } = this.props

    if (isTrialUser(profile)) {
      return (
        <FormattedMessage
          id='billing-details-summary.subscription-level.trial-text'
          defaultMessage='Free {trialLength}-day trial. Learn more about our different {subscriptionLevel}.'
          values={{
            trialLength: isGovCloud ? 30 : 14,
            subscriptionLevel: this.renderSubscriptionLevelLink(),
          }}
        />
      )
    }

    if (isMarketPlaceUser(profile) || isMonthlyCustomer(profile)) {
      return (
        <FormattedMessage
          id='billing-details-summary.subscription-level.monthly-subscribed-text'
          defaultMessage='Monthly subscription. Learn more about our different {subscriptionLevel}.'
          values={{
            subscriptionLevel: this.renderSubscriptionLevelLink(),
          }}
        />
      )
    }

    if (isAnnualPurchaseOrderCustomer(profile) || isAnnualCreditCardCustomer(profile)) {
      return (
        <FormattedMessage
          id='billing-details-summary.subscription-level.annual-po-subscribed-text'
          defaultMessage='Annual subscription. Learn more about our {annualContracts}.'
          values={{
            annualContracts: this.renderAnnualContractsLink(),
          }}
        />
      )
    }

    if (isPrepaidConsumptionCustomer(profile)) {
      return (
        <FormattedMessage
          id='billing-details-summary.subscription-level.annual-prepaid-text'
          defaultMessage='Annual prepaid subscription. Learn more about our different {subscriptionLevel}.'
          values={{
            subscriptionLevel: this.renderSubscriptionLevelLink(),
          }}
        />
      )
    }

    return null
  }

  renderChangeSubscriptionButton(): ReactElement | null {
    const { linkText, profile } = this.props

    if (isAnnualPurchaseOrderCustomer(profile) || isTrialUser(profile)) {
      return null
    }

    return <ChangeSubscriptionButton text={linkText} onClick={() => this.onChangeSubscription()} />
  }

  renderSubscriptionLevelLink(): ReactElement {
    return (
      <DocLink link='subscriptionLevels'>
        <FormattedMessage
          id='billing-details-summary.subscription-level.subscription-level-link'
          defaultMessage='subscription levels'
        />
      </DocLink>
    )
  }

  renderAnnualContractsLink(): ReactElement {
    return (
      <ExternalLink href='https://www.elastic.co/guide/en/cloud/current/ec-faq-billing.html#faq-annualprepaid'>
        <FormattedMessage
          id='billing-details-summary.subscription-level.annual-contracts-link'
          defaultMessage='annual contracts'
        />
      </ExternalLink>
    )
  }

  onChangeSubscription(): void {
    const { onChangeSubscription } = this.props

    if (onChangeSubscription) {
      onChangeSubscription()
    }
  }
}

export default SubscriptionOverviewPanel
