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

import { EuiFlexGroup, EuiFlexItem, EuiProgress, EuiText, EuiSpacer } from '@elastic/eui'

import StatPressureLabel from './StatPressureLabel'

export default function StatPressureIndicator({
  label,
  pressure,
  pressureFormatter,
  total,
  hideTotal,
  isStressed,
  statFormatter,
}) {
  const insufficient = pressure == null || Number.isNaN(pressure) || total == null
  const textColor = getTextColor({ insufficient, isStressed })
  const progressColor = getProgressColor({ insufficient, isStressed })

  return (
    <div>
      <EuiFlexGroup gutterSize='s' justifyContent='spaceBetween' alignItems='flexEnd'>
        {label && (
          <EuiFlexItem grow={false}>
            <EuiText size='s' color={textColor}>
              {label}
            </EuiText>
          </EuiFlexItem>
        )}

        <EuiFlexItem className='nodeTile-alignRight'>
          <StatPressureLabel
            pressure={pressure}
            pressureFormatter={pressureFormatter}
            total={total}
            hideTotal={hideTotal}
            color={textColor}
            statFormatter={statFormatter}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size='xs' />

      {pressure != null && !Number.isNaN(pressure) && (
        <EuiProgress color={progressColor} value={pressure} max={100} size='l' />
      )}
    </div>
  )
}

function getTextColor({ insufficient, isStressed }) {
  if (insufficient) {
    return `subdued`
  }

  if (isStressed) {
    return `warning`
  }

  return `default`
}

function getProgressColor({ insufficient, isStressed }) {
  if (insufficient) {
    return `subdued`
  }

  if (isStressed) {
    return `danger`
  }

  return `subdued`
}
