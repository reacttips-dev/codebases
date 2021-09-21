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

import { EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiSelect } from '@elastic/eui'

import JqExpression from './JqExpression'
import RegexExpression from './RegexExpression'

import { ConsoleRequestState } from '../../../reducers/clusterConsole'
import { ElasticsearchCluster } from '../../../types'

export interface Props {
  request: ConsoleRequestState
  onChange: (request: ConsoleRequestState, cluster: ElasticsearchCluster) => void
  cluster: ElasticsearchCluster
}

const messages = defineMessages({
  filterResponseBy: {
    id: 'cluster-console-request.filter-by',
    defaultMessage: 'Filter response by',
  },
  regularExpression: {
    id: 'cluster-console-request.filter-by.regular-expression',
    defaultMessage: 'Regular expression',
  },
  jqExpression: {
    id: 'cluster-console-request.filter-by.jq-expression',
    defaultMessage: 'JQ expression',
  },
})

const AdvancedFields: FunctionComponent<Props & WrappedComponentProps> = ({
  intl: { formatMessage },
  request,
  onChange,
  cluster,
}) => (
  <EuiFlexGroup>
    <EuiFlexItem grow={false}>
      <EuiFormRow label={formatMessage(messages.filterResponseBy)}>
        <EuiSelect
          value={request.filterBy || 'regex'}
          onChange={(e) =>
            onChange({ ...request, filterBy: e.target.value as 'regex' | 'jq' }, cluster)
          }
          options={[
            {
              value: 'regex',
              text: formatMessage(messages.regularExpression),
            },
            {
              value: 'jq',
              text: formatMessage(messages.jqExpression),
            },
          ]}
        />
      </EuiFormRow>
    </EuiFlexItem>

    {request.filterBy === 'regex' && (
      <RegexExpression onChange={onChange} request={request} cluster={cluster} />
    )}

    {request.filterBy === 'jq' && (
      <JqExpression onChange={onChange} request={request} cluster={cluster} />
    )}
  </EuiFlexGroup>
)

export default injectIntl(AdvancedFields)
