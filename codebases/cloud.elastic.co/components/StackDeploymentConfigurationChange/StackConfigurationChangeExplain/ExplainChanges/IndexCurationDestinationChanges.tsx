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

import { EuiBadge } from '@elastic/eui'

export default function IndexCurationDestinationChanges({ oldDestination, currentDestination }) {
  if (!oldDestination) {
    return (
      <FormattedMessage
        id='explain-changes.elasticsearch-set-curation-destination'
        defaultMessage='Set Index Curation destination to {current}'
        values={{
          current: <EuiBadge color='hollow'>{currentDestination}</EuiBadge>,
        }}
      />
    )
  }

  return (
    <FormattedMessage
      id='explain-changes.elasticsearch-change-curation-destination'
      defaultMessage='Change Index Curation destination from {old} to {current}'
      values={{
        old: (
          <EuiBadge color='hollow'>
            <del>{oldDestination}</del>
          </EuiBadge>
        ),
        current: <EuiBadge color='hollow'>{currentDestination}</EuiBadge>,
      }}
    />
  )
}
