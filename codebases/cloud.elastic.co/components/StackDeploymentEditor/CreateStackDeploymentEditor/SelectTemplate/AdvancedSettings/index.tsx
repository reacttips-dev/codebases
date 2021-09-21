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
  EuiLink,
  EuiTitle,
  EuiText,
} from '@elastic/eui'

import { CuiAccordion } from '../../../../../cui'

import AdvancedSettingsAccordionButton from './AdvancedSettingsAccordionButton'
import AdvancedSettingsContent from './AdvancedSettingsContent'

import SetupSnapshots from '../SetupDeployment/SetupSnapshots'

import DocLink from '../../../../DocLink'

import { getPlatform, PlatformId } from '../../../../../lib/platform'

import {
  Region,
  VersionNumber,
  StackDeploymentCreateRequest,
  ClusterSnapshot,
  ElasticsearchCluster,
} from '../../../../../types'
import {
  Region as AvailableRegion,
  ElasticsearchClusterSettings,
  GlobalDeploymentTemplateInfo,
  DeploymentTemplateInfoV2,
} from '../../../../../lib/api/v1/types'
import { DeepPartial } from '../../../../../lib/ts-essentials'
import { RegionState } from '../../../../../reducers/providers'
export interface Props {
  region: Region
  version: string | null
  getRegionsByProvider: (provider: string) => RegionState[] | null
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
  onChangeSnapshotSource: (value?: ElasticsearchCluster | null) => void
  onChangeSnapshot: (value?: ClusterSnapshot | null) => void
  setEsSettings: (settings: DeepPartial<ElasticsearchClusterSettings> | null) => void
  showPayingCustomerSections: boolean
  globalDeploymentTemplates: GlobalDeploymentTemplateInfo[]
  deploymentTemplate: DeploymentTemplateInfoV2
  onChangeTemplate: (template: DeploymentTemplateInfoV2) => void
  isUserconsole: boolean
  hasDefaultSnapshotRepository: boolean
  name?: string
  setDeploymentName: (name: string) => void
  disabled?: boolean
}

type State = {
  showRestoreFromSnapshotDetails: boolean
  showSelectSnapshotRepo: boolean
  isOpen: boolean
  initialIsOpen: boolean
}

class AdvancedSettings extends Component<Props, State> {
  state = {
    showRestoreFromSnapshotDetails: this.props.restoreFromSnapshot || false,
    showSelectSnapshotRepo: false,
    initialIsOpen: false,
    isOpen: false,
  }

  render() {
    const {
      region,
      version,
      getRegionsByProvider,
      availablePlatforms,
      editorState,
      isUserconsole,
    } = this.props
    const { showRestoreFromSnapshotDetails } = this.state

    if (!version || !region) {
      return <EuiLoadingContent />
    }

    const { deploymentTemplate } = editorState

    if (!isUserconsole) {
      return (
        <Fragment>
          {showRestoreFromSnapshotDetails
            ? this.renderRestoreFromSnapshot()
            : this.renderAdminconsoleAdvancedSettings()}
        </Fragment>
      )
    }

    return (
      <div data-test-id='advanced-settings-accordion'>
        <CuiAccordion
          title={<FormattedMessage id='deployment-settings.title' defaultMessage='Settings' />}
          id='advancedSettings'
          data-test-id='advancedSettings-accordion'
          className='advancedSettings-accordion'
          isOpen={this.state.isOpen}
          onToggle={() => this.setState({ isOpen: !this.state.isOpen })}
          initialIsOpen={this.state.initialIsOpen}
          buttonContent={
            <AdvancedSettingsAccordionButton
              deploymentTemplate={deploymentTemplate}
              region={region}
              version={version}
              getRegionsByProvider={getRegionsByProvider}
              availablePlatforms={availablePlatforms}
            />
          }
        >
          {this.renderAdvancedSettingsContent()}
          {showRestoreFromSnapshotDetails && this.renderRestoreFromSnapshot()}
        </CuiAccordion>
      </div>
    )
  }

  renderAdminconsoleAdvancedSettings = () => (
    <Fragment>
      <EuiTitle size='xs'>
        <h2>
          <FormattedMessage
            defaultMessage='Deployment settings'
            id='stack-deployment-configure.restore-from-snapshot.deployment-settings'
          />
        </h2>
      </EuiTitle>
      {this.renderAdvancedSettingsContent()}
    </Fragment>
  )

  renderRestoreFromSnapshot = () => {
    const {
      region,
      version,
      trialMaxedOut,
      showRegion,
      editorState,
      onChangeSnapshotSource,
      onChangeSnapshot,
      setEsSettings,
      isUserconsole,
    } = this.props

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='s' alignItems='center' data-test-id='restore-snapshot-section'>
          <EuiFlexItem grow={false}>
            <EuiTitle size='s'>
              <h2>
                <FormattedMessage
                  defaultMessage='Restore data from snapshot'
                  id='stack-deployment-configure.restore-from-snapshot'
                />
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiLink onClick={() => this.onCancelPickingSnapshot()}>
              <FormattedMessage
                defaultMessage='Cancel'
                id='stack-deployment-configure.restore-from-snapshot.cancel'
              />
            </EuiLink>
          </EuiFlexItem>
        </EuiFlexGroup>

        {isUserconsole && (
          <Fragment>
            <EuiSpacer size='s' />
            <EuiText size='s' color='subdued'>
              <FormattedMessage
                id='setup-deployment.region-platform.cannot-change'
                defaultMessage='This deployment must be in the same region of the same cloud provider as the deployment you want to restore data from, and it must have a compatible Elastic Stack version. {learnMore}'
                values={{
                  learnMore: (
                    <DocLink link='crossClusterRestoreDocLink'>
                      <FormattedMessage
                        id='setup-deployment.region-platform.cannot-change-learn-more'
                        defaultMessage='Learn more'
                      />
                    </DocLink>
                  ),
                }}
              />
            </EuiText>
          </Fragment>
        )}

        <SetupSnapshots
          cancelRestoreFromSnapshot={() => this.setState({ showRestoreFromSnapshotDetails: false })}
          editorState={editorState}
          version={version!}
          showRegion={showRegion}
          onChangeSnapshotSource={onChangeSnapshotSource}
          onChangeSnapshot={onChangeSnapshot}
          setEsSettings={setEsSettings}
          regionId={region.id}
          disabled={trialMaxedOut}
        />
        {!isUserconsole ? (
          <Fragment>
            <EuiSpacer size='s' />
            {this.renderAdminconsoleAdvancedSettings()}
          </Fragment>
        ) : null}
      </Fragment>
    )
  }

  renderAdvancedSettingsContent = () => {
    const {
      region,
      version,
      availablePlatforms,
      trialMaxedOut,
      onChangePlatform,
      showRegion,
      onChangeRegion,
      availableRegions,
      availableVersions,
      whitelistedVersions,
      setVersion,
      editorState,
      setEsSettings,
      showPayingCustomerSections,
      globalDeploymentTemplates,
      onChangeTemplate,
      name,
      setDeploymentName,
      hasDefaultSnapshotRepository,
      restoreFromSnapshot,
      isUserconsole,
      disabled,
    } = this.props
    const { showRestoreFromSnapshotDetails } = this.state
    const platform = getPlatform(region.id)

    return (
      <AdvancedSettingsContent
        disabledControls={disabled}
        showRegion={showRegion}
        regionId={region.id}
        version={version}
        availablePlatforms={availablePlatforms}
        restoreFromSnapshot={restoreFromSnapshot}
        trialMaxedOut={trialMaxedOut}
        onChangePlatform={onChangePlatform}
        onChangeRegion={onChangeRegion}
        availableRegions={availableRegions}
        availableVersions={availableVersions}
        whitelistedVersions={whitelistedVersions}
        setVersion={setVersion}
        editorState={editorState}
        setEsSettings={setEsSettings}
        showPayingCustomerSections={showPayingCustomerSections}
        globalDeploymentTemplates={globalDeploymentTemplates}
        onChangeTemplate={onChangeTemplate}
        platform={platform}
        name={name}
        setDeploymentName={setDeploymentName}
        onRestoreFromSnapshot={() => this.setState({ showRestoreFromSnapshotDetails: true })}
        hasDefaultSnapshotRepository={hasDefaultSnapshotRepository}
        showRestoreFromSnapshotDetails={showRestoreFromSnapshotDetails}
        isAdminconsole={!isUserconsole}
      />
    )
  }

  onCancelPickingSnapshot = () => {
    const { onChangeSnapshotSource } = this.props

    onChangeSnapshotSource(null)

    this.setState({ showRestoreFromSnapshotDetails: false, initialIsOpen: true, isOpen: true })
  }
}

export default AdvancedSettings
