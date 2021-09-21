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

import {
  allowsInlineResize,
  isAnyRolling,
  isAutodetect,
  isGrowAndShrink,
  isRollingAll,
  isRollingByName,
  isRollingByZone,
  isRollingGrowAndShrink,
} from '../../lib/clusterStrategies'

import { Strategy } from '../../types'

type Props = {
  strategy: Strategy
}

const StrategyName: FunctionComponent<Props> = ({ strategy }) => {
  const rollingStrategyName = getRollingStrategyName(strategy)

  if (rollingStrategyName) {
    if (allowsInlineResize(strategy)) {
      return rollingStrategyName
    }

    return (
      <FormattedMessage
        id='strategy-name.rolling-strategy-without-inline-resize'
        defaultMessage='{ rollingStrategyName } without inline resize'
        values={{ rollingStrategyName }}
      />
    )
  }

  if (isRollingGrowAndShrink(strategy)) {
    return (
      <FormattedMessage
        id='strategy-name.rolling-grow-and-shrink-strategy'
        defaultMessage='Rolling grow and shrink'
      />
    )
  }

  if (isGrowAndShrink(strategy)) {
    return (
      <FormattedMessage
        id='strategy-name.grow-and-shrink-strategy'
        defaultMessage='Grow and shrink'
      />
    )
  }

  if (isAutodetect(strategy)) {
    return (
      <FormattedMessage
        id='strategy-name.autodetect-strategy'
        defaultMessage='Autodetect strategy'
      />
    )
  }

  return <FormattedMessage id='strategy-name.unspecified-strategy' defaultMessage='Unspecified' />
}

function getRollingStrategyName(strategy: Strategy) {
  if (!isAnyRolling(strategy)) {
    return null
  }

  if (isRollingByName(strategy)) {
    return (
      <FormattedMessage
        id='strategy-name.rolling-by-name-strategy'
        defaultMessage='Rolling change per node'
      />
    )
  }

  if (isRollingByZone(strategy)) {
    return (
      <FormattedMessage
        id='strategy-name.rolling-by-zone-strategy'
        defaultMessage='Rolling change per zone'
      />
    )
  }

  if (isRollingAll(strategy)) {
    return (
      <FormattedMessage
        id='strategy-name.rolling-all-strategy'
        defaultMessage='Full deployment restart'
      />
    )
  }

  return (
    <FormattedMessage
      id='strategy-name.rolling-by-default-group-strategy'
      defaultMessage='Rolling change'
    />
  )
}

export default StrategyName
