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
import { FormattedMessage } from 'react-intl'

import { EuiTitle } from '@elastic/eui'

import { CuiTable, CuiTableColumn } from '../../../cui'

import { ClusterSnapshotFailure } from '../../../types'

interface Props {
  failures: ClusterSnapshotFailure[]
}

const ShardFailures: FunctionComponent<Props> = ({ failures }) => {
  const columns: Array<CuiTableColumn<ClusterSnapshotFailure>> = [
    {
      label: (
        <FormattedMessage id='cluster-snapshots.shard-failures-index' defaultMessage='Index' />
      ),
      render: (failure) => failure.index,
      sortKey: `index`,
    },
    {
      label: (
        <FormattedMessage id='cluster-snapshots.shard-failures-shard-id' defaultMessage='Shard' />
      ),
      render: (failure) => failure.shard_id,
      sortKey: `shard_id`,
    },
    {
      label: (
        <FormattedMessage id='cluster-snapshots.shard-failures-reason' defaultMessage='Reason' />
      ),
      render: (failure) => failure.reason,
      sortKey: `reason`,
    },
  ]

  return (
    <div>
      <EuiTitle>
        <h5>
          <FormattedMessage
            id='cluster-snapshots.shard-failures-summary'
            defaultMessage='{ count, plural,
                =0 {No shard failures}
                one {1 shard failure}
                other {# shard failures}
              }'
            values={{
              count: failures.length,
            }}
          />
        </h5>
      </EuiTitle>

      <CuiTable
        rows={failures}
        getRowId={(failure) => `${failure.index}-${failure.shard_id}`}
        fullWidth={false}
        columns={columns}
      />
    </div>
  )
}

export default ShardFailures
