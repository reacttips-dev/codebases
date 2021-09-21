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

import { EuiFormHelpText, EuiSpacer, EuiToolTip } from '@elastic/eui'

import SnapshotSettings from '../SnapshotSettings'

import { parseWeirdApiTimeAsMs } from '../../../../lib/weirdTime'
import { prettyDuration } from '../../../../lib/prettyTime'

import { AsyncRequestState, DeploymentSnapshotState, ElasticsearchCluster } from '../../../../types'

type Props = {
  canEditSettings: boolean
  deployment: ElasticsearchCluster
  fetchSnapshotSettingsRequest: AsyncRequestState
  isUserConsole: boolean
  snapshotSettings: DeploymentSnapshotState | null
}

const SnapshotRetentionTime: FunctionComponent<Props> = ({
  deployment,
  isUserConsole,
  snapshotSettings,
  fetchSnapshotSettingsRequest,
  canEditSettings,
}) => {
  if (fetchSnapshotSettingsRequest.error) {
    return null
  }

  if (fetchSnapshotSettingsRequest.inProgress) {
    return null
  }

  if (!snapshotSettings) {
    return null
  }

  const { retention } = snapshotSettings
  const { maxAge, snapshots } = retention

  const retentionMs = parseWeirdApiTimeAsMs(maxAge)
  const retentionTime = prettyDuration({ milliseconds: retentionMs })

  const retentionMessage = (
    <FormattedMessage
      id='deployment-snapshot-status.retention-explained'
      defaultMessage='The current settings retain {snapshots} {snapshots, plural, one {snapshot} other {snapshots}} over a period of {retentionPeriod}.'
      values={{
        snapshots,
        retentionPeriod: (
          <EuiToolTip
            position='bottom'
            content={
              <FormattedMessage
                id='deployment-snapshot-status.retention-tooltip'
                defaultMessage='The snapshot retention period is an estimate based on the snapshot frequency interval and the expected number of saved snapshots.'
              />
            }
          >
            <span>{retentionTime}</span>
          </EuiToolTip>
        ),
      }}
    />
  )

  return (
    <Fragment>
      <EuiSpacer size='s' />

      <EuiFormHelpText>
        {retentionMessage}
        {canEditSettings && (
          <Fragment>
            {` `}
            <SnapshotSettings cluster={deployment} isUserConsole={isUserConsole} />
          </Fragment>
        )}
      </EuiFormHelpText>
    </Fragment>
  )
}

export default SnapshotRetentionTime
