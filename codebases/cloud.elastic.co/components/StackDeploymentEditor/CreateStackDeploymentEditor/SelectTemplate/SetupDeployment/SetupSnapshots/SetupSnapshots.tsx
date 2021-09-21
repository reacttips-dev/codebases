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

import { EuiSpacer } from '@elastic/eui'
import { get, isEmpty } from 'lodash'

import SelectSnapshotSource from './SelectSnapshotSource'

import { withErrorBoundary } from '../../../../../../cui'

import { getDeploymentSettings, getEsPlan } from '../../../../../../lib/stackDeployments'
import { DeepPartial } from '../../../../../../lib/ts-essentials'

import { ElasticsearchClusterSettings } from '../../../../../../lib/api/v1/types'

import {
  RegionId,
  StackDeploymentCreateRequest,
  ElasticsearchCluster,
  ClusterSnapshot,
  VersionNumber,
} from '../../../../../../types'

type Props = {
  editorState: StackDeploymentCreateRequest
  onChangeSnapshotSource: (value?: ElasticsearchCluster | null) => void
  onChangeSnapshot: (value?: ClusterSnapshot | null) => void
  setEsSettings: (settings: DeepPartial<ElasticsearchClusterSettings> | null) => void
  regionId: RegionId
  showRegion: boolean
  version: VersionNumber
  hasDefaultSnapshotRepository: boolean
  disabled?: boolean
  cancelRestoreFromSnapshot: () => void
}

type State = {
  pickingSnapshot: boolean
}

class SetupSnapshots extends Component<Props, State> {
  state: State = {
    pickingSnapshot: false,
  }

  static getDerivedStateFromProps(nextProps: Props): Partial<State> | null {
    const { editorState } = nextProps
    const { deployment } = editorState
    const esPlan = getEsPlan({ deployment })
    const snapshotRestoreSettings = get(esPlan, [`transient`, `restore_snapshot`])

    if (snapshotRestoreSettings) {
      return { pickingSnapshot: true }
    }

    return null
  }

  render() {
    const { version, showRegion, onChangeSnapshotSource, onChangeSnapshot, regionId, editorState } =
      this.props

    const { deployment } = editorState
    const esPlan = getEsPlan({ deployment })
    const snapshotRestoreSettings = get(esPlan, [`transient`, `restore_snapshot`])

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <SelectSnapshotSource
          version={version}
          regionId={regionId}
          showRegion={showRegion}
          forceLastSnapshot={false}
          asRestoreForm={false}
          snapshotRestoreSettings={snapshotRestoreSettings}
          onChange={onChangeSnapshotSource}
          onSelectSnapshot={onChangeSnapshot}
        />
      </Fragment>
    )
  }

  getSnapshotRepositoryId = () => {
    const { editorState } = this.props
    const { deployment } = editorState
    const deploymentSettings = getDeploymentSettings({ deployment })
    return get(deploymentSettings, [`snapshot`, `repository`, `reference`, `repository_name`])
  }

  setSnapshotRepositoryId = (snapshotRepositoryId) => {
    const { setEsSettings } = this.props

    if (isEmpty(snapshotRepositoryId)) {
      setEsSettings({
        snapshot: {
          enabled: false,
        },
      })
      return
    }

    setEsSettings({
      snapshot: {
        enabled: true,
        repository: {
          reference: {
            repository_name: snapshotRepositoryId,
          },
        },
      },
    })
  }
}

export default withErrorBoundary(SetupSnapshots)
