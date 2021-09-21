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

import { startCase } from 'lodash'

import { EuiSpacer } from '@elastic/eui'

import ExternalLink from '../../../../../../components/ExternalLink'
import { awsBillingUrl, azureBillingUrl, gcpBillingUrl } from '../../../../urls'

import { UserProfile } from '../../../../../../types'

interface Props {
  profile: UserProfile
}

class MarketplaceCustomerInfo extends PureComponent<Props> {
  render(): ReactElement {
    const { profile } = this.props
    const { domain } = profile

    return (
      <div data-test-id='subscription-user'>
        <FormattedMessage
          id='billing-details-summary.marketplace-customer.text'
          defaultMessage={`Billed through your {domain} account.`}
          values={{ domain: domain === 'azure' ? startCase(domain) : domain.toUpperCase() }}
        />

        <EuiSpacer size='s' />

        <FormattedMessage
          data-test-id='marketplace-account-info-text'
          id='billing-details-summary.marketplace-customer.p2-text'
          defaultMessage='To make adjustments to your payment or subscription, go to your {marketplaceAccount}.'
          values={{
            marketplaceAccount: (
              <ExternalLink
                href={this.getPartnerConsoleLink()}
                data-test-id='marketplace-account-link'
              >
                <FormattedMessage
                  id='billing-details-summary.next-bill.marketplace-account-link'
                  defaultMessage='Marketplace account'
                />
              </ExternalLink>
            ),
          }}
        />
      </div>
    )
  }

  getPartnerConsoleLink(): string {
    const { profile } = this.props
    const partnerConsoleLinks = {
      aws: awsBillingUrl,
      gcp: gcpBillingUrl,
      azure: azureBillingUrl,
    }

    return partnerConsoleLinks[profile.domain]
  }
}

export default MarketplaceCustomerInfo
