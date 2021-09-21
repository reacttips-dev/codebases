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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiSpacer } from '@elastic/eui'

import EnterCCDetailsFooter from './EnterCCDetailsFooter'
import PrepaidCustomerInfo from './PrepaidCustomerInfo'

import { isAnnualCustomer } from '../../../../../../lib/billing'
import { UserProfile } from '../../../../../../types'

interface Props {
  profile: UserProfile
}

const PurchaseOrderCustomerInfo: FunctionComponent<Props> = ({ profile }) => (
  <Fragment>
    <FormattedMessage
      id='billing-details-summary.subscription-level.monthly-po-text'
      defaultMessage='Paid by purchase order.'
    />

    <EuiSpacer size='s' />

    {isAnnualCustomer(profile) ? <PrepaidCustomerInfo /> : <EnterCCDetailsFooter />}
  </Fragment>
)

export default PurchaseOrderCustomerInfo
