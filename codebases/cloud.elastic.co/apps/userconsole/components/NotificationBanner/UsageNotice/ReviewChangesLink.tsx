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

import { EuiLink } from '@elastic/eui'

import './usageNotice.scss'

type Props = {
  onReviewChanges: () => void
  isAnnual?: boolean
}

const ReviewChangesLink: FunctionComponent<Props> = ({ onReviewChanges, isAnnual }) => (
  <EuiLink onClick={() => onReviewChanges()} className='reviewChangesLink'>
    {isAnnual ? (
      <FormattedMessage
        id='annual-usage-notices.message.review-changes'
        defaultMessage='remove these features'
      />
    ) : (
      <FormattedMessage
        id='usage-notices.message.review-changes'
        defaultMessage='review required feature changes'
      />
    )}
  </EuiLink>
)

export default ReviewChangesLink
