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

export default function IndexCurationSourceChanges({ oldSource, currentSource }) {
  if (!oldSource) {
    return (
      <FormattedMessage
        id='explain-changes.elasticsearch-set-curation-source'
        defaultMessage='Set Index Curation source to {current}'
        values={{
          current: <EuiBadge color='hollow'>{currentSource}</EuiBadge>,
        }}
      />
    )
  }

  return (
    <FormattedMessage
      id='explain-changes.elasticsearch-change-curation-source'
      defaultMessage='Change Index Curation source from {old} to {current}'
      values={{
        old: (
          <EuiBadge color='hollow'>
            <del>{oldSource}</del>
          </EuiBadge>
        ),
        current: <EuiBadge color='hollow'>{currentSource}</EuiBadge>,
      }}
    />
  )
}
