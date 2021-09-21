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
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { round } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

interface Props {
  dp?: number
  withSymbol?: boolean
  value: number
  unit?: 'cents' | 'centicents' | 'none'
}

const ElasticConsumptionUnits: FunctionComponent<Props> = ({
  dp = 2,
  withSymbol = true,
  unit = `centicents`,
  value,
}) => {
  const multiplier = {
    centicents: 10000,
    cents: 100,
    none: 1,
  }[unit]
  const roundedValue = round(Math.abs(value) / multiplier, dp)

  if (!withSymbol) {
    return <FormattedNumber value={roundedValue} minimumFractionDigits={dp} />
  }

  return (
    <EuiFlexGroup
      gutterSize='xs'
      alignItems='baseline'
      className='elastic-consumption-units'
      responsive={false}
    >
      <EuiFlexItem
        grow={false}
        className='elastic-consumption-units-value'
        style={{ wordBreak: 'normal' }}
      >
        <FormattedNumber value={roundedValue} minimumFractionDigits={dp} />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText
          size='s'
          className='elastic-consumption-units-unit'
          style={{ wordBreak: 'normal' }}
        >
          <FormattedMessage id='elastic-consumption-units' defaultMessage='ECU' />
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default ElasticConsumptionUnits
