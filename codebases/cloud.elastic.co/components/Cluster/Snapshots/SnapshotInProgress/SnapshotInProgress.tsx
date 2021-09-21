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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiTextColor,
} from '@elastic/eui'

import { CuiAlert, CuiDuration, CuiTable } from '../../../../cui'

import StatPressureIndicator from '../../../StatPressureIndicator'

import { atPath } from '../../../../lib/objects'
import prettySize from '../../../../lib/prettySize'

import {
  ClusterSnapshot,
  ClusterSnapshotStatus,
  Stats,
  AsyncRequestState,
  ElasticsearchId,
  RegionId,
} from '../../../../types'

import './snapshotInProgress.scss'

type Props = {
  cluster: { regionId: RegionId; id: ElasticsearchId }
  snapshot: ClusterSnapshot | null
  snapshotStatus: ClusterSnapshotStatus | null
  fetchSnapshotStatusRequest: AsyncRequestState
}

type SnapshotStatusDetails = {
  id: string
  progress: {
    fileCount: number
    fileSize: number
  }
  total: {
    fileCount: number
    fileSize: number
  }
  duration: number
}

export default class SnapshotInProgress extends Component<Props> {
  render() {
    const { fetchSnapshotStatusRequest, snapshotStatus } = this.props

    if (fetchSnapshotStatusRequest.error) {
      return <CuiAlert type='error'>{fetchSnapshotStatusRequest.error}</CuiAlert>
    }

    if (snapshotStatus == null) {
      return (
        <EuiFlexGroup gutterSize='m' alignItems='center'>
          <EuiFlexItem grow={false}>
            <EuiLoadingSpinner size='m' />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='snapshot-in-progress.loading'
              defaultMessage='Loading snapshot progress stats'
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    const { state: snapshotState, stats, shards_stats: shardStats, indices } = snapshotStatus!

    if (snapshotState === `ABORTED`) {
      return (
        <CuiAlert type='warning'>
          <FormattedMessage
            id='snapshot-in-progress.snapshot-aborted'
            defaultMessage='The snapshot was aborted'
          />
        </CuiAlert>
      )
    }

    const statsSummary = this.getStatsSummary(`summary`, stats)

    const indexSummaries: SnapshotStatusDetails[] = Object.keys(indices).map((indexName) =>
      this.getStatsSummary(indexName, indices[indexName].stats),
    )

    const activeSummaries = indexSummaries.filter(
      (info) =>
        (info.progress.fileCount > 0 && info.progress.fileCount < 100) ||
        (info.progress.fileSize > 0 && info.progress.fileSize < 100),
    )

    const columns = [
      {
        label: <FormattedMessage id='snapshot-in-progress.label-index' defaultMessage='Index' />,
        render: (index) => <EuiCode>{index.id}</EuiCode>,
        sortKey: `id`,
      },

      {
        label: (
          <FormattedMessage
            id='snapshot-in-progress.label-files-processed'
            defaultMessage='Files processed'
          />
        ),
        textOnly: false,
        render: (info) => (
          <div style={{ width: `100%` }}>
            <StatPressureIndicator
              pressure={info.progress.fileCount}
              total={info.total.fileCount}
              statFormatter={(stat) => (
                <FormattedMessage
                  id='snapshot-in-progress.stat-files'
                  defaultMessage='{stat} files'
                  values={{ stat }}
                />
              )}
            />
          </div>
        ),
      },

      {
        label: (
          <FormattedMessage
            id='snapshot-in-progress.label-data-processed'
            defaultMessage='Data processed'
          />
        ),
        textOnly: false,
        render: (info) => (
          <div style={{ width: `100%` }}>
            <StatPressureIndicator pressure={info.progress.fileSize} total={info.total.fileSize} />
          </div>
        ),
      },

      {
        label: (
          <FormattedMessage id='snapshot-in-progress.duration-label' defaultMessage='Duration' />
        ),
        render: (info) => <CuiDuration milliseconds={info.duration} />,
      },
    ]

    return (
      <Fragment>
        <StatsSummary statsSummary={statsSummary} shardStats={shardStats} />

        <EuiSpacer size='xl' />

        <CuiTable
          data-test-id='snapshot-in-progress-index-table'
          rows={activeSummaries.length ? activeSummaries : indexSummaries}
          pageSize={5}
          getRowId={atPath(`id`)}
          columns={columns}
        />
      </Fragment>
    )
  }

  getStatsSummary(id: string, stats: Stats): SnapshotStatusDetails {
    const totalFileCount = stats.incremental ? stats.incremental.file_count : stats.number_of_files

    const progressFileCount =
      totalFileCount === 0 ? 0 : (stats.processed_files / totalFileCount) * 100

    const sizeInBytes = stats.incremental
      ? stats.incremental.size_in_bytes
      : stats.total_size_in_bytes

    const totalFileSize = sizeInBytes / 1024 / 1024
    const processedFileSize = stats.processed_size_in_bytes / 1024 / 1024

    const progressFileSize = totalFileSize === 0 ? 0 : (processedFileSize / totalFileSize) * 100

    return {
      id,
      progress: {
        fileCount: progressFileCount,
        fileSize: progressFileSize,
      },
      total: {
        fileCount: totalFileCount,
        fileSize: totalFileSize,
      },
      duration: stats.time_in_millis,
    }
  }
}

function StatsSummary({ statsSummary, shardStats }) {
  return (
    <EuiFlexGroup gutterSize='m'>
      <EuiFlexItem grow={1}>
        <div className='snapshotInProgress-shardStats'>
          <StatPressureIndicator
            pressure={(shardStats.done / shardStats.total || 0) * 100}
            total={shardStats.total}
            statFormatter={(value) => (
              <FormattedMessage
                id='snapshot-in-progress.shards-processed'
                defaultMessage='{value} shards processed'
                values={{ value }}
              />
            )}
          />

          {shardStats.failed > 0 && (
            <EuiFormHelpText>
              <EuiTextColor color='danger'>
                <FormattedMessage
                  id='snapshot-in-progress.shards-failed'
                  defaultMessage='{failedCount} {failedCount, plural, one {shard} other {shards}} failed.'
                  values={{ failedCount: String(shardStats.failed) }}
                />
              </EuiTextColor>
            </EuiFormHelpText>
          )}
        </div>
      </EuiFlexItem>

      <EuiFlexItem grow={1}>
        <StatPressureIndicator
          pressure={statsSummary.progress.fileSize}
          total={statsSummary.total.fileSize}
          statFormatter={(stat) => (
            <FormattedMessage
              id='snapshot-in-progress.percentage-processed'
              defaultMessage='{value} data processed'
              values={{ value: prettySize(stat) }}
            />
          )}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
