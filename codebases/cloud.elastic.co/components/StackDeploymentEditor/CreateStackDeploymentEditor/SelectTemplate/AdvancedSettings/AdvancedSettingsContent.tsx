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

import React, { Fragment, Component } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingContent,
  EuiSpacer,
  EuiButtonEmpty,
} from '@elastic/eui'
import { get, isEmpty } from 'lodash'

import SelectCloudPlatform from '../SelectCloudPlatform'
import SelectHardwareProfile from '../SelectHardwareProfile'
import NameDeployment from '../NameDeployment'
import SelectRegion from '../SelectRegion'
import SelectVersion from '../SetupDeployment/SelectVersion'
import SnapshotRepository from '../../../../DeploymentConfigure/SnapshotRepository'

import { PlatformId } from '../../../../../lib/platform'
import { getDeploymentSettings } from '../../../../../lib/stackDeployments'

import { VersionNumber, StackDeploymentCreateRequest, RegionId } from '../../../../../types'
import {
  Region as AvailableRegion,
  ElasticsearchClusterSettings,
  GlobalDeploymentTemplateInfo,
  DeploymentTemplateInfoV2,
} from '../../../../../lib/api/v1/types'
import { DeepPartial } from '../../../../../lib/ts-essentials'

export interface Props {
  regionId: RegionId
  version: string | null
  availablePlatforms: PlatformId[]
  restoreFromSnapshot: boolean
  trialMaxedOut?: boolean
  onChangePlatform: (platform: string) => void
  showRegion: boolean
  onChangeRegion: (regionId: string) => void
  availableRegions: AvailableRegion[] | null
  availableVersions: string[]
  whitelistedVersions: string[]
  setVersion: (version: VersionNumber) => void
  editorState: StackDeploymentCreateRequest
  setEsSettings: (settings: DeepPartial<ElasticsearchClusterSettings> | null) => void
  showPayingCustomerSections: boolean
  globalDeploymentTemplates: GlobalDeploymentTemplateInfo[]
  onChangeTemplate: (template: DeploymentTemplateInfoV2) => void
  platform: PlatformId
  name?: string
  setDeploymentName: (name: string) => void
  onRestoreFromSnapshot: () => void
  hasDefaultSnapshotRepository: boolean
  showRestoreFromSnapshotDetails: boolean
  isAdminconsole: boolean
  disabledControls?: boolean
}

class AdvancedSettings extends Component<Props> {
  render() {
    const {
      regionId,
      version,
      availablePlatforms,
      restoreFromSnapshot,
      trialMaxedOut,
      onChangePlatform,
      showRegion,
      onChangeRegion,
      availableRegions,
      availableVersions,
      whitelistedVersions,
      setVersion,
      editorState,
      showPayingCustomerSections,
      globalDeploymentTemplates,
      onChangeTemplate,
      platform,
      name,
      setDeploymentName,
      isAdminconsole,
      onRestoreFromSnapshot,
      hasDefaultSnapshotRepository,
      showRestoreFromSnapshotDetails,
      disabledControls,
    } = this.props

    if (!version || !regionId) {
      return <EuiLoadingContent />
    }

    const { deploymentTemplate } = editorState

    return (
      <Fragment>
        <EuiSpacer size='m' />
        <EuiFlexGroup data-test-id='advanced-settings-content' gutterSize='m' direction='column'>
          {isAdminconsole && (
            <NameDeployment
              isAdminconsole={isAdminconsole}
              name={name}
              onChange={setDeploymentName}
              disabled={trialMaxedOut || disabledControls}
            />
          )}
          {showRegion && (
            <Fragment>
              <EuiFlexItem>
                <SelectCloudPlatform
                  restoreFromSnapshot={restoreFromSnapshot}
                  platform={platform}
                  availablePlatforms={availablePlatforms}
                  onChange={onChangePlatform}
                  disabled={trialMaxedOut || disabledControls}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <SelectRegion
                  regionId={regionId}
                  restoreFromSnapshot={restoreFromSnapshot}
                  availableRegions={availableRegions}
                  onChange={onChangeRegion}
                  disabled={trialMaxedOut || disabledControls}
                />
              </EuiFlexItem>
            </Fragment>
          )}

          <SelectHardwareProfile
            onChange={onChangeTemplate}
            version={version}
            currentTemplate={deploymentTemplate}
            stackTemplates={globalDeploymentTemplates}
            disabled={disabledControls}
          />

          <EuiFlexItem>
            <SelectVersion
              version={version}
              availableVersions={availableVersions}
              whitelistedVersions={whitelistedVersions}
              setVersion={setVersion}
              disabled={trialMaxedOut || disabledControls}
              regionId={regionId}
              editorState={editorState}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            {!hasDefaultSnapshotRepository && (
              <SnapshotRepository
                regionId={regionId}
                snapshotRepositoryId={this.getSnapshotRepositoryId()}
                setSnapshotRepositoryId={this.setSnapshotRepositoryId}
                deploymentTemplate={deploymentTemplate}
              />
            )}
          </EuiFlexItem>
        </EuiFlexGroup>

        {showPayingCustomerSections && !showRestoreFromSnapshotDetails && (
          <EuiButtonEmpty
            disabled={disabledControls}
            flush='left'
            data-test-id='restore-from-snapshot'
            onClick={() => onRestoreFromSnapshot()}
          >
            <FormattedMessage defaultMessage='Restore snapshot data' id='restore-from-snapshot' />
          </EuiButtonEmpty>
        )}
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

export default AdvancedSettings
