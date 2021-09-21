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
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiSelect } from '@elastic/eui'

import PrivacySensitiveContainer from '../PrivacySensitiveContainer'
import { isPermitted } from '../../lib/requiresPermission'
import Permission from '../../lib/api/v1/permissions'

const messages = defineMessages({
  method: {
    id: 'cluster-console-method.method',
    defaultMessage: 'Method',
  },
})

interface Props extends WrappedComponentProps {
  disabled?: boolean
  value: string
  onChange: (event: React.SyntheticEvent) => void
}

type Options = Array<{
  value: 'GET' | 'POST' | 'PUT' | 'DELETE'
  text: 'GET' | 'POST' | 'PUT' | 'DELETE'
  disabled?: boolean
}>

const ClusterConsoleMethod = ({ intl: { formatMessage }, disabled, value, onChange }: Props) => {
  const methodMap = {
    GET: Permission.getEsProxyRequests,
    POST: Permission.postEsProxyRequests,
    PUT: Permission.putEsProxyRequests,
    DELETE: Permission.deleteEsProxyRequests,
  }

  const options: Options = [
    { value: `GET`, text: `GET` },
    { value: `POST`, text: `POST` },
    { value: `PUT`, text: `PUT` },
    { value: `DELETE`, text: `DELETE` },
  ]

  for (const option of options) {
    option.disabled = !isPermitted(methodMap[option.value])
  }

  return (
    <PrivacySensitiveContainer>
      <div className='clusterConsole--method'>
        <EuiSelect
          aria-label={formatMessage(messages.method)}
          value={value}
          onChange={onChange}
          disabled={disabled}
          options={options}
          data-test-id='console-method-select'
        />
      </div>
    </PrivacySensitiveContainer>
  )
}

export default injectIntl(ClusterConsoleMethod)
