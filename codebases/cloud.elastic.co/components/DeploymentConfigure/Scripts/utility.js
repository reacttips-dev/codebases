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

import { EuiFlexItem, EuiIconTip } from '@elastic/eui'

export function getTooltip(valueToMatch, currentValue, previousValue) {
  if (previousValue == null || previousValue === currentValue || currentValue !== valueToMatch) {
    return null
  }

  return (
    <EuiFlexItem grow={false}>
      <EuiIconTip
        aria-label='More information'
        content={`You chose ${currentValue}. (It was ${previousValue} before.)`}
        type='iInCircle'
      />
    </EuiFlexItem>
  )
}

export function mapToString(scriptSettings) {
  if (scriptSettings == null) {
    return null
  }

  if (scriptSettings.enabled === true) {
    return scriptSettings.sandbox_mode === true ? `sandbox` : `on`
  }

  return `off`
}
