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

import React, { FormEvent, FunctionComponent, ReactElement } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFieldText } from '@elastic/eui'

import PrivacySensitiveContainer from '../PrivacySensitiveContainer'

interface Props extends WrappedComponentProps {
  disabled?: boolean
  value: string
  onChange: (event: FormEvent<HTMLInputElement>) => void
  append?: ReactElement
}

const messages = defineMessages({
  label: {
    id: 'cluster-console-path.label',
    defaultMessage: 'Path',
  },
  placeholder: {
    id: `cluster-console-path.path-placeholder`,
    defaultMessage: `Path, e.g. "_cat/indices"`,
  },
})

const ClusterConsolePath: FunctionComponent<Props> = ({
  intl: { formatMessage },
  disabled,
  value,
  onChange,
  append,
}) => (
  <PrivacySensitiveContainer>
    <EuiFieldText
      aria-label={formatMessage(messages.label)}
      fullWidth={true}
      placeholder={formatMessage(messages.placeholder)}
      disabled={disabled}
      value={value}
      onChange={onChange}
      append={append}
      data-test-id='console-path-field'
    />
  </PrivacySensitiveContainer>
)

export default injectIntl(ClusterConsolePath)
