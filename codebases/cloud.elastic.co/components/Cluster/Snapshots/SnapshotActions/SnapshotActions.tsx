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

import { EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import ClusterLockingGate from '../../../ClusterLockingGate'

import TakeSnapshotButton from '../TakeSnapshotButton'
import SnapshotRestore from '../SnapshotRestore'

import { AsyncRequestState, RegionId, StackDeployment } from '../../../../types'

type SnapshotActionsProps = {
  stackDeployment: StackDeployment
  regionId: RegionId
  deploymentId: string
  takeSnapshotRequest: AsyncRequestState
  showTakeSnapshotButton: boolean
  showRestoreSnapshotButton: boolean
  resetTakeSnapshotRequest: () => void
}

const SnapshotActions: React.FunctionComponent<SnapshotActionsProps> = ({
  takeSnapshotRequest,
  showTakeSnapshotButton,
  showRestoreSnapshotButton,
  stackDeployment,
}: SnapshotActionsProps) => {
  const actionsIsEmpty = !showTakeSnapshotButton && !showRestoreSnapshotButton

  if (actionsIsEmpty) {
    return null
  }

  const showingAction = showTakeSnapshotButton || showRestoreSnapshotButton

  return (
    <Fragment>
      {showingAction && <EuiSpacer size='l' />}

      <EuiFlexGroup gutterSize='m'>
        {showTakeSnapshotButton && (
          <EuiFlexItem grow={false}>
            <ClusterLockingGate>
              <TakeSnapshotButton deployment={stackDeployment} />
            </ClusterLockingGate>
          </EuiFlexItem>
        )}

        {showRestoreSnapshotButton && (
          <EuiFlexItem grow={false}>
            <ClusterLockingGate>
              <SnapshotRestore deployment={stackDeployment} />
            </ClusterLockingGate>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>

      {showingAction && <EuiSpacer size='m' />}

      {takeSnapshotRequest.error && <CuiAlert type='error'>{takeSnapshotRequest.error}</CuiAlert>}

      {takeSnapshotRequest.isDone && !takeSnapshotRequest.error && (
        <EuiCallOut
          title={
            <FormattedMessage
              id='take-snapshot-request-success'
              defaultMessage='Snapshot in progress. Refresh the page to view status.'
            />
          }
        />
      )}
    </Fragment>
  )
}

export default SnapshotActions
