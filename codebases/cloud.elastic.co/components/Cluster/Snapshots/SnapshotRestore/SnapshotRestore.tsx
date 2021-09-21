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
import { set } from 'lodash'

import { EuiButton, EuiToolTip } from '@elastic/eui'

import {
  createUpdateRequestFromGetResponse,
  getFirstEsCluster,
  sanitizeUpdateRequestBeforeSend,
} from '../../../../lib/stackDeployments'
import { planOverridePaths } from '../../../../config/clusterPaths'
import SnapshotRestoreModal from './SnapshotRestoreModal'

import {
  RestoreSnapshotConfiguration,
  RestoreSnapshotApiConfiguration,
  ElasticsearchClusterPlan,
} from '../../../../lib/api/v1/types'
import { ConsumerProps as SelectSnapshotSourceProps } from '../../../StackDeploymentEditor/CreateStackDeploymentEditor/SelectTemplate/SetupDeployment/SetupSnapshots/SelectSnapshotSource'

import { AllProps, State } from './types'

class SnapshotRestore extends Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props)

    this.state = {
      isModalOpen: false,
      plan: this.makePlan(),
    }
  }

  render(): JSX.Element | null {
    if (!this.state.plan) {
      return null
    }

    return (
      <Fragment>
        <EuiToolTip
          content={
            <FormattedMessage
              id='snapshot-restore.show-modal-button-description'
              defaultMessage='Choose an snapshot in another deployment to restore on this deployment'
            />
          }
        >
          <EuiButton
            onClick={this.openModal}
            iconType='refresh'
            data-test-id='es-snapshot-restore-from-another'
          >
            <FormattedMessage
              id='snapshot-restore.show-modal-button'
              defaultMessage='Restore from another deployment'
            />
          </EuiButton>
        </EuiToolTip>

        {this.state.isModalOpen && (
          <SnapshotRestoreModal
            plan={this.state.plan}
            deploymentUnderEdit={this.props.deployment}
            updateDeploymentRequest={this.props.updateDeploymentRequest}
            onChangeSnapshotSource={this.onChangeSnapshotSource}
            onSelectSnapshot={this.onSelectSnapshot}
            onUpdateIndexRestore={this.onUpdateIndexRestore}
            onRestoreSnapshot={this.onRestoreSnapshot}
            onClose={this.closeModal}
          />
        )}
      </Fragment>
    )
  }

  openModal = (): void => {
    this.setState({ isModalOpen: true })
  }

  closeModal = (): void => {
    this.setState({ isModalOpen: false, plan: this.makePlan() })
  }

  onChangeSnapshotSource: SelectSnapshotSourceProps['onChange'] = (cluster) => {
    // reset state if the source cluster changes
    if (!cluster) {
      this.setState({ plan: this.makePlan() })
      return
    }

    const restoreFrom: RestoreSnapshotConfiguration = {
      snapshot_name: `__latest_success__`,
      source_cluster_id: cluster?.id,
      strategy: `partial`,
    }
    const plan = set(this.makePlan()!, planOverridePaths.restoreFromRemoteSnapshot, restoreFrom)

    this.setState({ plan })
  }

  onSelectSnapshot: Exclude<SelectSnapshotSourceProps['onSelectSnapshot'], undefined> = (
    snapshotDetails,
    id: string,
  ) => {
    if (!snapshotDetails) {
      return // sanity
    }

    const restoreFrom: RestoreSnapshotConfiguration = {
      snapshot_name: snapshotDetails.snapshot,
      source_cluster_id: id,
      strategy: `partial`,
    }

    this.setState({
      plan: set(this.state.plan!, planOverridePaths.restoreFromRemoteSnapshot, restoreFrom),
    })
  }

  onUpdateIndexRestore: Exclude<SelectSnapshotSourceProps['onUpdateIndexRestore'], undefined> = (
    payload,
  ) => {
    if (!payload.indices && !(payload.rename_pattern && payload.rename_replacement)) {
      return
    }

    const restorePayload: RestoreSnapshotApiConfiguration = {}

    if (payload.indices) {
      restorePayload.indices = [payload.indices]
    }

    if (payload.rename_pattern && payload.rename_replacement) {
      restorePayload.raw_settings = {
        rename_pattern: payload.rename_pattern,
        rename_replacement: payload.rename_replacement,
      }
    }

    this.setState({
      plan: set(this.state.plan!, planOverridePaths.restorePayload, restorePayload),
    })
  }

  onRestoreSnapshot: Exclude<SelectSnapshotSourceProps['onRestoreSnapshot'], undefined> = () => {
    const { updateDeployment } = this.props
    const { plan } = this.state

    const deployment = createUpdateRequestFromGetResponse({ deployment: this.props.deployment })
    const cluster = getFirstEsCluster({ deployment })

    if (!cluster || !plan) {
      return // sanity
    }

    cluster.plan = plan

    updateDeployment(sanitizeUpdateRequestBeforeSend({ deployment }))
  }

  makePlan = (): ElasticsearchClusterPlan | undefined => {
    const deploymentUpdateRequest = createUpdateRequestFromGetResponse({
      deployment: this.props.deployment,
    })
    return getFirstEsCluster({ deployment: deploymentUpdateRequest })?.plan
  }
}

export default SnapshotRestore
