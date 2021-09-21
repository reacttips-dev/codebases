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
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFormRow, EuiSelect } from '@elastic/eui'

import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'

const messages = defineMessages({
  prompt: {
    id: `supportCaseCategorySelector.prompt`,
    defaultMessage: `Select a category...`,
  },
  billing: {
    id: `supportCaseCategorySelecor.billing`,
    defaultMessage: `Billing issue`,
  },
  config: {
    id: `supportCaseCategorySelecor.config`,
    defaultMessage: `Configuration change issue`,
  },
  down: {
    id: `supportCaseCategorySelecor.down`,
    defaultMessage: `System down`,
  },
  impaired: {
    id: `supportCaseCategorySelecor.impaired`,
    defaultMessage: `System impaired`,
  },
  other: {
    id: `supportCaseCategorySelecor.other`,
    defaultMessage: `Other`,
  },
})

interface Props extends WrappedComponentProps {
  value: string
  onChange: (category: string) => void
  error: undefined | ReactNode
}

function SupportCaseCategorySelector({ value, onChange, error, intl: { formatMessage } }: Props) {
  const options = [
    { value: ``, text: formatMessage(messages.prompt) },
    { value: `billing`, text: formatMessage(messages.billing) },
    { value: `config`, text: formatMessage(messages.config) },
    { value: `down`, text: formatMessage(messages.down) },
    { value: `impaired`, text: formatMessage(messages.impaired) },
    { value: `other`, text: formatMessage(messages.other) },
  ]

  const label = (
    <FormattedMessage id='supportCaseCategorySelector.label' defaultMessage='Category' />
  )

  return (
    <PrivacySensitiveContainer>
      <EuiFormRow label={label} isInvalid={!!error} error={error}>
        <EuiSelect
          options={options}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          isInvalid={!!error}
        />
      </EuiFormRow>
    </PrivacySensitiveContainer>
  )
}

export default injectIntl(SupportCaseCategorySelector)
