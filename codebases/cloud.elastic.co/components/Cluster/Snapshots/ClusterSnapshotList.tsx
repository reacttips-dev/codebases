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

import { EuiLink, EuiSpacer } from '@elastic/eui'

import ShardFailures from './ShardFailures'
import SnapshotHistory from './SnapshotHistory'

import RequiresSudo from '../../RequiresSudo'

import { ClusterSnapshot, ElasticsearchCluster } from '../../../types'

type Props = {
  cluster: ElasticsearchCluster
  snapshotHistory: ClusterSnapshot[] | null
  readonly?: boolean
}

const ClusterSnapshotList: FunctionComponent<Props> = ({ cluster, snapshotHistory, readonly }) => {
  const { snapshots } = cluster
  const status = snapshots.status || {}
  const { pendingInitialSnapshot, missingInfo } = status
  const noSnapshotsYet = pendingInitialSnapshot || missingInfo

  if (noSnapshotsYet) {
    return null
  }

  const failures = snapshotHistory && snapshotHistory[0] ? snapshotHistory[0].failures : []

  return (
    <Fragment>
      {failures.length > 0 && (
        <Fragment>
          <EuiSpacer size='m' />
          <ShardFailures failures={failures} />
          <EuiSpacer size='m' />
        </Fragment>
      )}

      <EuiSpacer size='m' />

      <RequiresSudo
        color='primary'
        buttonType={EuiLink}
        to={
          <FormattedMessage
            id='cluster-snapshots.reveal-snapshot-history-requires-sudo'
            defaultMessage='Reveal the snapshot history'
          />
        }
        data-test-id='cluster-snapshots.snapshot-history'
        helpText={false}
        actionPrefix={false}
      >
        <SnapshotHistory cluster={cluster} readonly={readonly} />
      </RequiresSudo>
    </Fragment>
  )
}

export default ClusterSnapshotList
