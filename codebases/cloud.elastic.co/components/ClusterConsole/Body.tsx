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
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import { CuiCodeEditor } from '../../cui'

interface Props extends WrappedComponentProps {
  disabled?: boolean
  value: string
  onChange: (object) => void
}

const messages = defineMessages({
  body: {
    id: 'cluster-console-body.body',
    defaultMessage: 'body',
  },
})

const ClusterConsoleBody: FunctionComponent<Props> = ({
  intl: { formatMessage },
  disabled,
  value,
  onChange,
}) => (
  <CuiCodeEditor
    height='200px'
    aria-label={formatMessage(messages.body)}
    language='json'
    value={value}
    disabled={disabled}
    onChange={onChange}
  />
)

export default injectIntl(ClusterConsoleBody)
