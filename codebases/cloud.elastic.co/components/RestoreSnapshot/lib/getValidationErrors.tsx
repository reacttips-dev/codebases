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

import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import messages from '../messages'

interface ValidationErrors {
  matchPatternError?: ReactNode
}

export default function getValidationErrors({
  snapshot,
  matchPattern,
  renamePattern,
}: {
  snapshot: boolean
  matchPattern: string
  renamePattern: string
}): ValidationErrors {
  if (!snapshot) {
    return {}
  }

  const errors: ValidationErrors = {}

  const hasPatternMatch = matchPattern.length === 0
  const hasReplacePattern = renamePattern.length === 0

  if (hasPatternMatch !== hasReplacePattern) {
    errors.matchPatternError = <FormattedMessage {...messages.supplyBothOrNoPatterns} />
  } else if (hasPatternMatch) {
    try {
      // eslint-disable-next-line no-new
      new RegExp(matchPattern)
    } catch (err) {
      errors.matchPatternError = <FormattedMessage {...messages.invalidRegex} />
    }
  }

  return errors
}
