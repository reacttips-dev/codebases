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

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiText,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiIcon,
} from '@elastic/eui'

import { CuiAlert } from '../../../../cui'
import TakeSnapshotButton from '../../../Cluster/Snapshots/TakeSnapshotButton'

import { getFirstEsClusterFromGet, hasEnabledSnapshots } from '../../../../lib/stackDeployments'

import { StackDeployment, AsyncRequestState, ClusterSnapshotStatus } from '../../../../types'

type Props = {
  deployment: StackDeployment
  takeSnapshotRequest: AsyncRequestState
  onSnapshotTaken: (args: { snapshotName: string }) => void
  snapshotStatus?: ClusterSnapshotStatus
  disabled?: boolean
}

const TakeSnapshot: React.FunctionComponent<Props> = ({
  deployment,
  takeSnapshotRequest,
  onSnapshotTaken,
  snapshotStatus,
  disabled,
}) => {
  const { error } = takeSnapshotRequest

  return (
    <div>
      <EuiText>
        <p>
          <FormattedMessage
            id='appSearchToEnterpriseSearchMigration.snapshotIntro'
            defaultMessage='Store your current App Search data as a snapshot.'
          />
        </p>
      </EuiText>
      <EuiSpacer />
      <TakeSnapshotButton
        deployment={deployment}
        onSnapshotTaken={onSnapshotTaken}
        disabled={disabled || areSnapshotsDisabled() || isSnapshotInProgress()}
        fill={false}
      />
      {error && (
        <Fragment>
          <EuiSpacer size='m' />
          <CuiAlert type='error'>{error}</CuiAlert>
        </Fragment>
      )}
      {areSnapshotsDisabled() && (
        <Fragment>
          <EuiSpacer size='m' />
          <CuiAlert type='error'>
            <FormattedMessage
              id='appSearchToEnterpriseSearchMigration.snapshotsNotEnabled'
              defaultMessage='Snapshots are not enabled for this deployment, and are required before continuing.'
            />
          </CuiAlert>
        </Fragment>
      )}
      {isSnapshotInProgress() && (
        <Fragment>
          <EuiSpacer size='m' />
          <EuiFlexGroup justifyContent='flexStart' alignItems='center' gutterSize='s'>
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner />
            </EuiFlexItem>
            <EuiFlexItem>
              <FormattedMessage
                id='appSearchToEnterpriseSearchMigration.snapshotInProgress'
                defaultMessage='Snapshot in progress'
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )}
      {isSnapshotFailed() && (
        <Fragment>
          <EuiSpacer size='m' />
          <CuiAlert type='error'>
            <FormattedMessage
              id='appSearchToEnterpriseSearchMigration.snapshotFailed'
              defaultMessage='Snapshot failed, try again.'
            />
          </CuiAlert>
        </Fragment>
      )}
      {isSnapshotSuccessful() && (
        <Fragment>
          <EuiSpacer size='m' />
          <EuiFlexGroup justifyContent='flexStart' alignItems='center' gutterSize='s'>
            <EuiFlexItem grow={false}>
              <EuiIcon type='checkInCircleFilled' />
            </EuiFlexItem>
            <EuiFlexItem>
              <FormattedMessage
                id='appSearchToEnterpriseSearchMigration.snapshotComplete'
                defaultMessage='Snapshot complete'
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )}
    </div>
  )

  function areSnapshotsDisabled(): boolean {
    const esResource = getFirstEsClusterFromGet({ deployment })!
    return !hasEnabledSnapshots({ resource: esResource })
  }

  function isSnapshotInProgress(): boolean {
    // in progress if:
    //   - the request is in progress
    //   - the request is finished but we're waiting on the snapshot status
    //   - the request is finished and we have the snapshot status and it's IN_PROGRESS
    return (
      (takeSnapshotRequest.inProgress || takeSnapshotRequest.isDone) &&
      !takeSnapshotRequest.error &&
      (!snapshotStatus?.state || [`STARTED`, `IN_PROGRESS`].includes(snapshotStatus.state))
    )
  }

  function isSnapshotSuccessful(): boolean {
    // successful only if:
    //   - we have the snapshot status and it's SUCCESS
    return snapshotStatus?.state === `SUCCESS`
  }

  function isSnapshotFailed(): boolean {
    // failed if:
    //   - we have the snapshot status and it's anything other than IN_PROGRESS or outright SUCCESS
    return Boolean(
      snapshotStatus?.state &&
        ![`STARTED`, `IN_PROGRESS`, `SUCCESS`].includes(snapshotStatus.state),
    )
  }
}

export default TakeSnapshot
