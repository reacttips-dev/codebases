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

import { EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui'

import { CuiFlexItemSeparator } from '../../../../cui'

import SnapshotStat, { DateStat } from './SnapshotStat'
import SnapshotFrequency from './SnapshotFrequency'
import SnapshotRetentionTime from './SnapshotRetentionTime'

import { AsyncRequestState, DeploymentSnapshotState, ElasticsearchCluster } from '../../../../types'

type Props = {
  status: {
    nextSnapshotAt: string | null
    latestSuccessAt: string | null
    hasRecentEnoughSuccess: boolean
  }
  snapshotSettings: DeploymentSnapshotState | null
  fetchSnapshotSettingsRequest: AsyncRequestState
  deployment: ElasticsearchCluster
  canEditSettings: boolean
  isUserConsole: boolean
}

const SnapshotStatus: FunctionComponent<Props> = ({
  status: { nextSnapshotAt, latestSuccessAt, hasRecentEnoughSuccess },
  snapshotSettings,
  fetchSnapshotSettingsRequest,
  deployment,
  canEditSettings,
  isUserConsole,
}) => (
  <EuiFlexGroup>
    <EuiFlexItem grow={false}>
      <EuiPanel>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <SnapshotStat
              label={
                <FormattedMessage
                  id='deployment-snapshots-status.last-successful-snapshot'
                  defaultMessage='Last successful snapshot'
                />
              }
              color={hasRecentEnoughSuccess ? undefined : `danger`}
            >
              <DateStat date={latestSuccessAt} />
            </SnapshotStat>
          </EuiFlexItem>

          {nextSnapshotAt && (
            <EuiFlexItem grow={false}>
              <SnapshotStat
                label={
                  <FormattedMessage
                    id='deployment-snapshots-status.next-snapshot'
                    defaultMessage='Next snapshot'
                  />
                }
              >
                <DateStat date={nextSnapshotAt} />
              </SnapshotStat>
            </EuiFlexItem>
          )}

          <CuiFlexItemSeparator />

          <EuiFlexItem grow={false}>
            <SnapshotStat
              label={
                <FormattedMessage
                  id='deployment-snapshots-status.snapshot-frequency'
                  defaultMessage='Snapshot frequency'
                />
              }
            >
              <SnapshotFrequency snapshotSettings={snapshotSettings} />
            </SnapshotStat>
          </EuiFlexItem>
        </EuiFlexGroup>

        <SnapshotRetentionTime
          snapshotSettings={snapshotSettings}
          fetchSnapshotSettingsRequest={fetchSnapshotSettingsRequest}
          deployment={deployment}
          isUserConsole={isUserConsole}
          canEditSettings={canEditSettings}
        />
      </EuiPanel>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default SnapshotStatus
