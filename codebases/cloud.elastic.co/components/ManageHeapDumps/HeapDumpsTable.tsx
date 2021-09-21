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
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { EuiButtonIcon, EuiButton, EuiIcon } from '@elastic/eui'

import { CuiTable, CuiTableColumn, CuiTimeAgo } from '../../cui'

import RequiresSudo from '../RequiresSudo'

import HeapDumpStatus from './HeapDumpStatus'

import schedule from '../../lib/schedule'

import { HeapDump } from '../../types/heapDump'

export interface Props {
  intl: IntlShape
  heapDumps?: HeapDump[]
  fetchHeapDumps: () => void
  getHeapDumpDownloadUrl: (resourceKind: string, refId: string, instanceId: string) => string
}

const messages = defineMessages({
  oom: {
    id: 'heap-dump-type.heap-dump-oom',
    defaultMessage: 'Out-of-memory',
  },
  'on-demand': {
    id: 'heap-dump-type.heap-dump-on-demand',
    defaultMessage: 'On-demand',
  },
})

const HeapDumpsTable: FunctionComponent<Props> = ({
  heapDumps,
  getHeapDumpDownloadUrl,
  intl: { formatMessage },
}) => {
  const columns: Array<CuiTableColumn<HeapDump>> = [
    {
      label: <FormattedMessage id='heap-dumps-table.instance-id' defaultMessage='Instance' />,
      render: ({ instanceId }) => instanceId,
    },

    {
      label: <FormattedMessage id='heap-dumps-table.instance-type' defaultMessage='Type' />,
      render: ({ type }) => formatMessage(messages[type]),
    },

    {
      label: <FormattedMessage id='heap-dumps-table.instance-status' defaultMessage='Status' />,
      render: (heapDump) => <HeapDumpStatus heapDump={heapDump} />,
    },

    {
      label: (
        <FormattedMessage id='heap-dumps-table.heap-dump-timestamp' defaultMessage='Timestamp' />
      ),
      render: ({ captured }) => <CuiTimeAgo date={captured} longTime={true} />,
    },

    {
      label: <FormattedMessage id='heap-dumps-table.download' defaultMessage='Download' />,
      align: 'center' as const,
      width: '100px',
      actions: true,
      render: (heapDump) => {
        if (heapDump.status === 'complete') {
          return (
            <RequiresSudo
              color='primary'
              buttonType={EuiButton}
              to={<EuiIcon type='download' aria-label='Download' />}
            >
              <EuiButtonIcon
                href={getHeapDumpDownloadUrl(
                  heapDump.resourceKind,
                  heapDump.refId,
                  heapDump.instanceId,
                )}
                iconType='download'
                aria-label='Download'
              />
            </RequiresSudo>
          )
        }

        return null
      },
    },
  ]

  return (
    <CuiTable<HeapDump>
      columns={columns}
      rows={heapDumps}
      getRowId={({ instanceId }) => instanceId}
      pageSize={10}
      initialLoading={!heapDumps}
    />
  )
}

export default injectIntl(schedule(HeapDumpsTable, ({ fetchHeapDumps }) => fetchHeapDumps()))
