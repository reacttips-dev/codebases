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
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui'

import EnterCCDetailsFooter from './EnterCCDetailsFooter'
import PrivacySensitiveContainer from '../../../../../../components/PrivacySensitiveContainer'

import { RecurlyBillingInfo } from '../../../../../../types'

import cardLogo from '../../../../../../files/payment_alt.svg'

interface Props {
  recurly_billing_info: RecurlyBillingInfo
}

const CreditCardCustomerInfo: FunctionComponent<Props> = ({ recurly_billing_info }) => {
  const { first_name, last_name, last_four, month, year } = recurly_billing_info

  return (
    <PrivacySensitiveContainer>
      <EuiFlexGroup alignItems='center' gutterSize='m'>
        <EuiFlexItem grow={false}>
          <EuiText>
            {first_name} {last_name}
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem grow={false} data-test-id='billing-cc-details'>
          <EuiFlexGroup gutterSize='s' alignItems='center'>
            <EuiFlexItem grow={false}>
              <img className='credit-card-number-logo' src={cardLogo} width={24} height={24} />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiText className='credit-card-last4'>{last_four}</EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiText>{`${month}/${year}`}</EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size='s' />

      <EnterCCDetailsFooter />
    </PrivacySensitiveContainer>
  )
}

export default CreditCardCustomerInfo
