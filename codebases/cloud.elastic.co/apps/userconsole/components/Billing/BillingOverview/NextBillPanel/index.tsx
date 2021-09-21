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
import { FormattedMessage } from 'react-intl'

import moment from 'moment'

import BillingPanel from '../BillingPanel'
import CreditCardModalButton from '../../CreditCardModalButton'
import MarketplaceCustomerInfo from './MarketplaceCustomerInfo'
import PurchaseOrderCustomerInfo from './PurchaseOrderCustomerInfo'
import CreditCardCustomerInfo from './CreditCardCustomerInfo'
import PrepaidCustomerInfo from './PrepaidCustomerInfo'

import { isMarketPlaceUser } from '../../../../../../lib/marketPlace'
import {
  isAnnualPurchaseOrderCustomer,
  isCreditCardCustomer,
  isMonthlyPurchaseOrderCustomer,
  isPrepaidConsumptionCustomer,
} from '../../../../../../lib/billing'

import { UserProfile } from '../../../../../../types'

import './nextBillPanel.scss'

interface Props {
  profile: UserProfile
}

class NextBillPanel extends PureComponent<Props> {
  render(): ReactElement {
    const nextMonth = moment().endOf('month').add(1, 'days')
    const nextBillDate = nextMonth.format(`MMM DD, YYYY`)

    return (
      <BillingPanel
        description={nextBillDate}
        footer={this.renderPaymentMethodSummary()}
        title={
          <FormattedMessage id='billing-details-summary.next-bill' defaultMessage='Next bill' />
        }
        button={this.renderUpdatePaymentMethodButton()}
        className='billing-details-summary-next-bill'
      />
    )
  }

  renderPaymentMethodSummary(): ReactElement | null {
    const { profile } = this.props
    const { recurly_billing_info } = profile

    if (isMarketPlaceUser(profile)) {
      return <MarketplaceCustomerInfo profile={profile} />
    }

    if (isCreditCardCustomer(profile)) {
      return <CreditCardCustomerInfo recurly_billing_info={recurly_billing_info!} />
    }

    if (isMonthlyPurchaseOrderCustomer(profile) || isAnnualPurchaseOrderCustomer(profile)) {
      return <PurchaseOrderCustomerInfo profile={profile} />
    }

    if (isPrepaidConsumptionCustomer(profile)) {
      return <PrepaidCustomerInfo />
    }

    return null
  }

  renderUpdatePaymentMethodButton(): ReactElement | null {
    const { profile } = this.props

    if (isCreditCardCustomer(profile)) {
      return (
        <CreditCardModalButton type='full'>
          <FormattedMessage
            id='payment-details-summary.update-payment-method'
            defaultMessage='Update payment method'
          />
        </CreditCardModalButton>
      )
    }

    if (isMonthlyPurchaseOrderCustomer(profile)) {
      return (
        <CreditCardModalButton type='full'>
          <FormattedMessage
            id='payment-details-summary.add-payment-method'
            defaultMessage='Add payment method'
          />
        </CreditCardModalButton>
      )
    }

    return null
  }
}

export default NextBillPanel
