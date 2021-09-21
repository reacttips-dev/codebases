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

import { defineMessages } from 'react-intl'

const messages = defineMessages({
  enterCCDetails: {
    id: 'next-bill-info.enter-cc-details.text',
    defaultMessage:
      'You can enter your credit card details or {contactUs} for other forms of payment.',
  },
  seeBillingHistory: {
    id: 'next-bill-info.see-billing-history',
    defaultMessage:
      'See {billingHistory} for a summary of your prepaid account. To add more funds, contact your account sales executive.',
  },
})

export default messages
