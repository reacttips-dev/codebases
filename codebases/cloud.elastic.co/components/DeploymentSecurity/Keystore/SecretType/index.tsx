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
import { defineMessages, IntlShape, injectIntl } from 'react-intl'

import {
  // @ts-ignore: TODO EUI typings issues
  EuiButtonGroup,
  EuiFormRow,
} from '@elastic/eui'

const SecretType = ({
  selected,
  label,
  onChange,
  intl: { formatMessage },
}: {
  selected: string
  label: string
  onChange: (option) => void
  intl: IntlShape
}) => {
  const messages = defineMessages({
    legend: {
      id: `secretType.legend`,
      defaultMessage: `Secret type`,
    },
    single: {
      id: `secretType.single`,
      defaultMessage: `Single string`,
    },
    multi: {
      id: `secretType.multiple`,
      defaultMessage: `Multiple strings`,
    },
    file: {
      id: `secretType.file`,
      defaultMessage: `JSON block / file`,
    },
  })
  const toggleButtons = [
    {
      id: 'single',
      label: formatMessage(messages.single),
    },
    {
      id: 'multi',
      label: formatMessage(messages.multi),
    },
    {
      id: 'file',
      label: formatMessage(messages.file),
    },
  ]

  return (
    <EuiFormRow fullWidth={true} label={label}>
      <EuiButtonGroup
        legend={formatMessage(messages.legend)}
        options={toggleButtons}
        idSelected={selected}
        onChange={onChange}
        color='primary'
        isFullWidth={true}
      />
    </EuiFormRow>
  )
}

export default injectIntl(SecretType)
