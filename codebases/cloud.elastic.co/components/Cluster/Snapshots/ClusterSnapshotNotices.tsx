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

import React, { Fragment, FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import { ElasticsearchCluster } from '../../../types'

type Props = {
  cluster: ElasticsearchCluster
  isUserConsole: boolean
}

const ClusterSnapshotNotices: FunctionComponent<Props> = ({ cluster, isUserConsole }) => {
  const { snapshots } = cluster
  const { enabled: snapshotsEnabled } = snapshots
  const status = snapshots.status || {}
  const { pendingInitialSnapshot } = status
  const adminconsoleNoSnapshots = !isUserConsole && !snapshotsEnabled
  const userconsoleNoInitialSnapshot = isUserConsole && pendingInitialSnapshot

  const notices: ReactElement[] = []

  if (adminconsoleNoSnapshots) {
    notices.push(
      <CuiAlert
        iconType='alert'
        type='warning'
        data-test-id='deploymentSnapshots-snapshotsDisabled'
      >
        <FormattedMessage
          id='cluster-snapshots.snapshots-not-available'
          defaultMessage='Snapshots are not enabled for this Elasticsearch cluster.'
        />
      </CuiAlert>,
    )
  }

  if (userconsoleNoInitialSnapshot) {
    notices.push(
      <EuiCallOut
        iconType='clock'
        data-test-id='deploymentSnapshots-firstSnapshotSoon'
        title={
          <FormattedMessage
            id='cluster-snapshots.overview.saas.pending'
            defaultMessage='Your first snapshot will appear here shortly.'
          />
        }
      />,
    )
  }

  return (
    <Fragment>
      {notices.map((notice: ReactElement, i: number) => (
        <Fragment key={notice.props['data-test-id']}>
          {i !== 0 && <EuiSpacer size='m' />}
          {notice}
        </Fragment>
      ))}
      {notices.length > 0 && <EuiSpacer size='m' />}
    </Fragment>
  )
}

export default ClusterSnapshotNotices
