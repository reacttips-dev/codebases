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
import { defineMessages, injectIntl, IntlShape } from 'react-intl'

import { EuiHealth } from '@elastic/eui'

import { HeapDump } from '../../types/heapDump'

interface Props {
  intl: IntlShape
  heapDump: HeapDump
}

const messages = defineMessages({
  capturing: {
    id: 'heap-dump-status.heap-dump-capturing',
    defaultMessage: 'Capturing',
  },
  compressing: {
    id: 'heap-dump-status.heap-dump-compressing',
    defaultMessage: 'Compressing',
  },
  complete: {
    id: 'heap-dump-status.heap-dump-completed',
    defaultMessage: 'Completed',
  },
})

const HeapDumpStatus: FunctionComponent<Props> = ({
  intl: { formatMessage },
  heapDump: { status },
}) => (
  <EuiHealth color={status === 'complete' ? 'secondary' : 'subdued'}>
    {formatMessage(messages[status])}
  </EuiHealth>
)

export default injectIntl(HeapDumpStatus)
