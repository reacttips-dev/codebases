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

import React from 'react'

import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiFlexItem } from '@elastic/eui'

import { accountBillingUrl } from '../../urls'

import history from '../../../../lib/history'

const ProvideBillingDetailsButton = ({ close, fill, grow }) => (
  <EuiFlexItem grow={grow}>
    <EuiButton
      fill={fill}
      onClick={() => {
        close()
        history.push(accountBillingUrl())
      }}
    >
      <FormattedMessage
        id='trial-modal.provide-billing-details'
        defaultMessage='Provide billing details'
      />
    </EuiButton>
  </EuiFlexItem>
)

export default ProvideBillingDetailsButton
