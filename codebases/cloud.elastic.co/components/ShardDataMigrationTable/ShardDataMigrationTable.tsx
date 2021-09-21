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

import React, { Fragment, FunctionComponent } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiCode, EuiFormHelpText } from '@elastic/eui'

import { CuiAlert, CuiTable } from '../../cui'

import StatPressureIndicator from '../StatPressureIndicator'

import prettyTime from '../../lib/prettyTime'
import { atPath } from '../../lib/objects'
import { getStatus } from '../../lib/error'

import schedule from '../../lib/schedule'
import { allSettled } from '../../lib/schedule/allSettled'

import { AsyncRequestState, StackDeployment } from '../../types'
import { ClusterHealth, RecoveryInfo } from '../../reducers/clusters/clusterTypes'

type Props = {
  deployment: StackDeployment
  recoveryInfoRequest: AsyncRequestState
  recoveryInfo?: RecoveryInfo[] | null
  clusterHealth?: ClusterHealth | null
  fetchRecoveryInfo: () => Promise<any>
  fetchClusterHealth: () => Promise<any>
}

const messages = defineMessages({
  fileCount: {
    id: `shard-data-migration-table.file-count`,
    defaultMessage: `{fileCount} files`,
  },
})

const ShardDataMigrationTable: FunctionComponent<Props & WrappedComponentProps> = ({
  intl: { formatMessage },
  recoveryInfoRequest,
  recoveryInfo,
  clusterHealth,
}) => {
  if (recoveryInfoRequest.error) {
    // @ts-ignore when no indices, Security gives us a 404
    if (getStatus(recoveryInfoRequest.error) === 404) {
      return null
    }

    return <CuiAlert type='warning'>{recoveryInfoRequest.error}</CuiAlert>
  }

  if (recoveryInfo == null || recoveryInfo.length === 0) {
    return null
  }

  const columns = [
    {
      label: (
        <FormattedMessage id='shard-data-migration-table.label-index' defaultMessage='Index' />
      ),
      render: (info) => <EuiCode>{info.index}</EuiCode>,
      sortKey: `index`,
    },
    {
      label: (
        <FormattedMessage id='shard-data-migration-table.label-shard' defaultMessage='Shard' />
      ),
      render: atPath(`shard`),
      sortKey: `shard`,
    },
    {
      label: (
        <FormattedMessage id='shard-data-migration-table.label-stage' defaultMessage='Stage' />
      ),
      render: (info) => <EuiCode>{info.stage}</EuiCode>,
      sortKey: `stage`,
    },
    {
      label: (
        <FormattedMessage
          id='shard-data-migration-table.label-time-spent'
          defaultMessage='Time spent'
        />
      ),
      render: (info) => prettyTime(info.totalTime),
      sortKey: `totalTime`,
    },
    {
      label: (
        <FormattedMessage
          id='shard-data-migration-table.label-files-processed'
          defaultMessage='Files processed'
        />
      ),
      render: (info) => (
        <StatPressureIndicator
          pressure={parseFloat(String(info.files.percent).slice(0, -1))}
          total={info.files.total}
          statFormatter={(fileCount) => formatMessage(messages.fileCount, { fileCount })}
        />
      ),
      sortKey: `files.total`,
    },
    {
      label: (
        <FormattedMessage
          id='shard-data-migration-table.label-data-processed'
          defaultMessage='Data processed'
        />
      ),
      render: (info) => (
        <StatPressureIndicator
          pressure={parseFloat(String(info.size.percent).slice(0, -1))}
          total={info.size.total}
        />
      ),
      sortKey: `size.total`,
    },
  ]

  return (
    <Fragment>
      <CuiTable
        rows={recoveryInfo}
        getRowId={atPath(`id`)}
        isEmbeddedTable={true}
        columns={columns}
      />

      {clusterHealth && (
        <EuiFormHelpText>
          <FormattedMessage
            id='shard-data-migration-table.relocating-initializing-unassigned-shards'
            defaultMessage='Relocating {relocating} {relocating, plural, one {shard} other {shards}}. Initializing {initializing} {initializing, plural, one {shard} other {shards}}. {unassigned} {unassigned, plural, one {shard is} other {shards are}} unassigned.'
            values={{
              relocating: `${clusterHealth.shards.relocating}`,
              initializing: `${clusterHealth.shards.initializing}`,
              unassigned: `${clusterHealth.shards.unassigned}`,
            }}
          />
        </EuiFormHelpText>
      )}
    </Fragment>
  )
}

export default injectIntl(
  schedule(
    ShardDataMigrationTable,
    ({ fetchRecoveryInfo, fetchClusterHealth }) =>
      allSettled([fetchRecoveryInfo(), fetchClusterHealth()]),
    [[`deployment`, `id`]],
  ),
)
