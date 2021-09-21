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

import { EuiSpacer, EuiText } from '@elastic/eui'

import CreditCardModalButton from '../../CreditCardModalButton'
import TrialBillingMoreFeatures from '../../../TrialModal/TrialModalBody/TrialBillingMoreFeatures'

import './trialBillingFeatures.scss'

const TrialBillingFeatures: FunctionComponent = () => (
  <div data-test-id='trial-billing-features' className='trial-billing-features'>
    <EuiText color='subdued'>
      <FormattedMessage
        id='trial-billing-features.with-cloud'
        defaultMessage='With Cloud you can:'
      />

      <EuiSpacer size='s' />

      <TrialBillingMoreFeatures />
    </EuiText>

    <EuiSpacer size='s' />

    <EuiText color='subdued'>
      <FormattedMessage
        id='trial-billing-features.billing-info'
        defaultMessage='Adding a credit card ends your free trial. You can scale down your deployment at any time to reduce costs.'
      />
    </EuiText>

    <EuiSpacer size='s' />

    <CreditCardModalButton type='full'>
      <FormattedMessage
        id='trial-billing-features.add-billing-info'
        defaultMessage='Add billing information'
      />
    </CreditCardModalButton>
  </div>
)

export default TrialBillingFeatures
