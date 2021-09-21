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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiOverlayMask,
} from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import LogicSudoGate from '../../../LogicSudoGate'

import SelectSnapshotSource, {
  ConsumerProps as SelectSnapshotSourceProps,
} from '../../../StackDeploymentEditor/CreateStackDeploymentEditor/SelectTemplate/SetupDeployment/SetupSnapshots/SelectSnapshotSource'

import { getRegionId } from '../../../../lib/stackDeployments'

import lightTheme from '../../../../lib/theme/light'

import { ElasticsearchClusterPlan } from '../../../../lib/api/v1/types'
import { AsyncRequestState, StackDeployment } from '../../../../types'

interface Props {
  plan: ElasticsearchClusterPlan
  deploymentUnderEdit: StackDeployment
  onChangeSnapshotSource: SelectSnapshotSourceProps['onChange']
  onSelectSnapshot: SelectSnapshotSourceProps['onSelectSnapshot']
  onUpdateIndexRestore: SelectSnapshotSourceProps['onUpdateIndexRestore']
  onRestoreSnapshot: SelectSnapshotSourceProps['onRestoreSnapshot']
  updateDeploymentRequest: AsyncRequestState
  onClose: () => void
}

class SnapshotRestoreModal extends Component<Props> {
  render(): JSX.Element {
    const { onClose } = this.props

    return (
      <LogicSudoGate onCancel={() => onClose()}>
        <EuiOverlayMask>
          <EuiModal onClose={() => onClose()} style={{ width: lightTheme.euiBreakpoints.m }}>
            {this.renderHeader()}
            {this.renderBody()}
            {this.renderFooter()}
          </EuiModal>
        </EuiOverlayMask>
      </LogicSudoGate>
    )
  }

  renderHeader(): JSX.Element {
    return (
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <FormattedMessage id='snapshot-restore.title' defaultMessage='Restore snapshot' />
        </EuiModalHeaderTitle>
      </EuiModalHeader>
    )
  }

  renderBody(): JSX.Element | null {
    const { plan, deploymentUnderEdit, updateDeploymentRequest } = this.props

    const version = plan.elasticsearch.version

    if (!version) {
      return null
    }

    const restoreSnapshotConfiguration = plan?.transient?.restore_snapshot
    const snapshotRestoreSettings = restoreSnapshotConfiguration
      ? {
          snapshot_name: restoreSnapshotConfiguration.snapshot_name!,
          source_cluster_id: restoreSnapshotConfiguration.source_cluster_id!,
        }
      : undefined

    const regionId = getRegionId({ deployment: deploymentUnderEdit })

    return (
      <EuiModalBody>
        <SelectSnapshotSource
          regionId={regionId}
          version={version}
          onChange={this.props.onChangeSnapshotSource}
          onSelectSnapshot={this.props.onSelectSnapshot}
          onRestoreSnapshot={this.props.onRestoreSnapshot}
          onUpdateIndexRestore={this.props.onUpdateIndexRestore}
          restoreSnapshotRequest={updateDeploymentRequest}
          forceLastSnapshot={false}
          showRegion={false}
          snapshotRestoreSettings={snapshotRestoreSettings}
        />

        {updateDeploymentRequest.error && (
          <CuiAlert type='error'>
            <FormattedMessage
              id='cluster-snapshots.latest-snapshot-error'
              defaultMessage='Something went wrong with trying to take a snapshot.'
            />
          </CuiAlert>
        )}
      </EuiModalBody>
    )
  }

  renderFooter(): JSX.Element {
    const { onClose } = this.props

    return (
      <EuiModalFooter>
        <EuiButtonEmpty onClick={() => onClose()}>
          <FormattedMessage id='snapshot-restore.close' defaultMessage='Close' />
        </EuiButtonEmpty>
      </EuiModalFooter>
    )
  }
}

export default SnapshotRestoreModal
