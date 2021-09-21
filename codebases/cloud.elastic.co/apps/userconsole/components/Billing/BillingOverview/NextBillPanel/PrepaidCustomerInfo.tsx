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
import { Link } from 'react-router-dom'

import { FormattedMessage } from 'react-intl'

import { accountBillingHistoryUrl } from '../../../../urls'

import messages from './messages'

const PrepaidCustomerInfo: FunctionComponent = () => (
  <FormattedMessage
    {...messages.seeBillingHistory}
    values={{
      billingHistory: (
        <Link to={accountBillingHistoryUrl()}>
          <FormattedMessage
            id='billing-details-summary.billing-history-link'
            defaultMessage='billing history'
          />
        </Link>
      ),
    }}
  />
)

export default PrepaidCustomerInfo
