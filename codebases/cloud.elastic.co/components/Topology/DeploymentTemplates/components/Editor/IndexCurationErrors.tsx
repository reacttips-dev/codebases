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

import React, { Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import { IndexCurationValidationErrors } from '../../../../../lib/curation'

type Props = {
  errors: IndexCurationValidationErrors[]
}

export default function IndexCurationErrors({ errors }: Props) {
  const errorMessages = [] as ReactNode[]

  if (errors.includes(IndexCurationValidationErrors.MISSING_HOT)) {
    errorMessages.push(
      <Fragment key='hot'>
        <EuiSpacer size='m' />
        <EuiCallOut
          title={
            <FormattedMessage
              id='index-curation-errors.specify-hot'
              defaultMessage='You must specify a hot instance configuration.'
            />
          }
          color='danger'
          iconType='cross'
        />
      </Fragment>,
    )
  }

  if (errors.includes(IndexCurationValidationErrors.MISSING_WARM)) {
    errorMessages.push(
      <Fragment key='warm'>
        <EuiSpacer size='m' />
        <EuiCallOut
          title={
            <FormattedMessage
              id='index-curation-errors.specify-warm'
              defaultMessage='You must specify a warm instance configuration.'
            />
          }
          color='danger'
          iconType='cross'
        />
      </Fragment>,
    )
  }

  if (errors.includes(IndexCurationValidationErrors.SAME_CONFIGURATION_HOT_WARM)) {
    errorMessages.push(
      <Fragment key='same'>
        <EuiSpacer size='m' />
        <EuiCallOut
          title={
            <FormattedMessage
              id='index-curation-errors.specify-different'
              defaultMessage='You must specify different instance configurations for hot and warm.'
            />
          }
          color='danger'
          iconType='cross'
        />
      </Fragment>,
    )
  }

  if (errors.includes(IndexCurationValidationErrors.NO_INDEX_PATTERNS)) {
    errorMessages.push(
      <Fragment key='no-index-patterns'>
        <EuiSpacer size='m' />
        <EuiCallOut
          title={
            <FormattedMessage
              id='index-curation-errors.specify-at-least-one-index-pattern'
              defaultMessage='You must specify at least one index pattern.'
            />
          }
          color='danger'
          iconType='cross'
        />
      </Fragment>,
    )
  }

  if (errors.includes(IndexCurationValidationErrors.EMPTY_INDEX_PATTERN)) {
    errorMessages.push(
      <Fragment key='no-index-patterns'>
        <EuiSpacer size='m' />
        <EuiCallOut
          title={
            <FormattedMessage
              id='index-curation-errors.specify-non-empty-index-patterns'
              defaultMessage="Index patterns can't be empty."
            />
          }
          color='danger'
          iconType='cross'
        />
      </Fragment>,
    )
  }

  return <Fragment>{errorMessages}</Fragment>
}
