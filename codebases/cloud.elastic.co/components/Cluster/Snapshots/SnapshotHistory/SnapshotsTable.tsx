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
import { FormattedMessage } from 'react-intl'

import { EuiSpacer } from '@elastic/eui'

import { CuiDuration, CuiLink, CuiTimeAgo, CuiTable, CuiTableColumn } from '../../../../cui'

import SnapshotHealth from '../SnapshotHealth'
import SnapshotInProgress from '../SnapshotInProgress'

import SnapshotTableRowActions from './SnapshotTableRowActions'

import { atPath } from '../../../../lib/objects'
import { clusterSnapshotUrl } from '../../../../lib/urlBuilder'

import { ClusterSnapshot, ElasticsearchCluster } from '../../../../types'

type Props = {
  cluster: ElasticsearchCluster
  snapshots: ClusterSnapshot[]
  readonly?: boolean
}

type SnapshotNameProps = {
  cluster: ElasticsearchCluster
  snapshot: ClusterSnapshot
  readonly?: boolean
}

type SnapshotProps = {
  snapshot: ClusterSnapshot
}

const SnapshotName: FunctionComponent<SnapshotNameProps> = ({
  cluster: { stackDeploymentId },
  snapshot: { snapshot },
  readonly,
}) =>
  readonly ? (
    <Fragment>{snapshot}</Fragment>
  ) : (
    <CuiLink to={clusterSnapshotUrl(stackDeploymentId!, snapshot)}>{snapshot}</CuiLink>
  )

const SnapshotEndTime: FunctionComponent<SnapshotProps> = ({ snapshot: { state, end_time } }) =>
  state === `IN_PROGRESS` ? null : <CuiTimeAgo date={end_time} longTime={true} />

const SnapshotDuration: FunctionComponent<SnapshotProps> = ({
  snapshot: { state, duration_in_millis },
}) => (state === `IN_PROGRESS` ? null : <CuiDuration milliseconds={duration_in_millis} />)

const SnapshotsTable: FunctionComponent<Props> = ({ cluster, snapshots, readonly }) => {
  const columns: Array<CuiTableColumn<ClusterSnapshot>> = [
    {
      label: <FormattedMessage id='cluster-snapshots-table.name' defaultMessage='Snapshot' />,
      render: (snapshot) => (
        <SnapshotName cluster={cluster} snapshot={snapshot} readonly={readonly} />
      ),
      sortKey: `snapshot`,
    },

    {
      label: <FormattedMessage id='cluster-snapshots-table.status' defaultMessage='Status' />,
      render: (snapshot) => <SnapshotHealth state={snapshot.state} />,
      sortKey: `state`,
    },

    {
      label: <FormattedMessage id='cluster-snapshots-table.completed' defaultMessage='Completed' />,
      render: (snapshot) => <SnapshotEndTime snapshot={snapshot} />,
      sortKey: `end_time`,
    },

    {
      label: <FormattedMessage id='cluster-snapshots-table.duration' defaultMessage='Duration' />,
      render: (snapshot) => <SnapshotDuration snapshot={snapshot} />,
      sortKey: `duration_in_millis`,
    },
  ]

  if (!readonly) {
    columns.push({
      id: 'snapshotTableRowActions',
      render: (snapshot) => (
        <SnapshotTableRowActions cluster={cluster} snapshot={snapshot} readonly={readonly} />
      ),
      width: '150px',
      actions: true,
      mobile: {
        label: <FormattedMessage id='cluster-snapshots-table.actions' defaultMessage='Actions' />,
      },
    })
  }

  return (
    <CuiTable<ClusterSnapshot>
      pageSize={10}
      fullWidth={false}
      rows={snapshots}
      getRowId={atPath(`uuid`)}
      hasDetailRow={(row) => row.state === `IN_PROGRESS`}
      renderDetailRow={(row) => (
        <Fragment>
          <SnapshotInProgress cluster={cluster} snapshotName={row.snapshot} />

          <EuiSpacer size='m' />
        </Fragment>
      )}
      className='snapshotsTable snapshotsHistory'
      columns={columns}
    />
  )
}

export default SnapshotsTable
