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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiListGroup, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui'

import DocLink from '../../../../../components/DocLink'

import './suggestedContentPanel.scss'

const SuggestedContentPanel: FunctionComponent = () => (
  <EuiPanel style={{ flexGrow: 0 }} className='suggested-content-title'>
    <EuiTitle size='xxxs'>
      <h3 data-test-id='billing-history.suggested-content-title'>
        <FormattedMessage
          id='billing-history.suggested-content-title'
          defaultMessage='Suggested content'
        />
      </h3>
    </EuiTitle>

    <EuiSpacer size='s' />

    <EuiListGroup
      listItems={[
        {
          label: (
            <DocLink link='billingFAQ'>
              <FormattedMessage id='suggested-content.billing-faq' defaultMessage='Billing FAQs' />
            </DocLink>
          ),
        },
        {
          label: (
            <DocLink link='accountBilling'>
              <FormattedMessage
                id='suggested-content.billing-account-faq'
                defaultMessage='Your account and billing'
              />
            </DocLink>
          ),
        },
        {
          label: (
            <DocLink link='billingCalculationFAQ'>
              <FormattedMessage
                id='suggested-content.billing-calculation-faq'
                defaultMessage='How my bill is calculated'
              />
            </DocLink>
          ),
        },
        {
          label: (
            <DocLink link='stopBillingCharges'>
              <FormattedMessage
                id='suggested-content.billing.stop-charges'
                defaultMessage='How to stop charges for a deployment'
              />
            </DocLink>
          ),
        },
      ]}
    />
  </EuiPanel>
)

export default SuggestedContentPanel
