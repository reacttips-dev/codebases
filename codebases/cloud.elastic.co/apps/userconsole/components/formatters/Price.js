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
import jif from 'jif'
import { round } from 'lodash'
import { FormattedNumber } from 'react-intl'

export default function Price({ value, unit = `centicents`, dp = 2, ...rest }) {
  const multiplier = {
    centicents: 10000,
    cents: 100,
    none: 1,
  }[unit]

  const rawValue = round(Math.abs(value) / multiplier, dp)
  const displayValue = (
    <FormattedNumber style='currency' currency='USD' value={rawValue} minimumFractionDigits={dp} />
  )

  return (
    <span {...rest}>
      {jif(value < 0, () => (
        <span>&minus;</span>
      ))}
      {displayValue}
    </span>
  )
}
