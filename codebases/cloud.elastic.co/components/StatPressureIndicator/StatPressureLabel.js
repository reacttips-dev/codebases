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

import { EuiText } from '@elastic/eui'

import prettySize from '../../lib/prettySize'
import Percentage from '../../lib/Percentage'

export default function StatPressureLabel({
  pressure,
  pressureFormatter = (pressure) => <Percentage value={pressure / 100} />,
  total,
  hideTotal,
  color,
  statFormatter = prettySize,
}) {
  if (pressure == null || Number.isNaN(pressure) || total == null) {
    return (
      <EuiText size='s' color={color}>
        <FormattedMessage id='stat-pressure-label.no-data' defaultMessage='No data' />
      </EuiText>
    )
  }

  const pressurePercent = pressureFormatter(pressure)

  if (hideTotal) {
    return (
      <EuiText size='s' color={color}>
        {pressurePercent}
      </EuiText>
    )
  }

  return (
    <EuiText size='s' color={color}>
      <FormattedMessage
        id='stat-pressure-label.pressure-percentage'
        defaultMessage='{ pressurePercent } of { total }'
        values={{
          pressurePercent,
          total: statFormatter(total),
        }}
      />
    </EuiText>
  )
}
