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

import { EuiHorizontalRule, EuiLoadingContent, EuiSpacer, EuiTitle } from '@elastic/eui'

import { withErrorBoundary } from '../../../../cui'

import NameDeployment from './NameDeployment'
import TrialLimitMessage from './TrialLimitMessage'
import AdvancedSettings from './AdvancedSettings'

import CcsSetupRemoteDeployments from '../CcsSetupRemoteDeployments'

import { getUpsertVersion } from '../../../../lib/stackDeployments'
import { isCrossClusterSearch } from '../../../../lib/deployments/ccs'
import { getVisibleTemplates } from '../../../../lib/stackDeployments/selectors'
import { getPlatform, PlatformId } from '../../../../lib/platform'
import { inTrial } from '../../../../lib/trial'

import { DeepPartial } from '../../../../lib/ts-essentials'
import {
  DeploymentTemplateInfoV2,
  ElasticsearchClusterSettings,
  GlobalDeploymentTemplateInfo,
} from '../../../../lib/api/v1/types'

import {
  BillingSubscriptionLevel,
  ClusterSnapshot,
  ElasticsearchCluster,
  Region,
  RegionId,
  StackDeploymentCreateRequest,
  VersionNumber,
  ProfileState,
} from '../../../../types'

import { RegionState } from '../../../../reducers/providers'

import '../../../Topology/DeploymentTemplates/DeploymentTemplateWizard/deploymentTemplateWizard.scss'
import '../../../Topology/DeploymentTemplates/components/ConfigureInstance/configureInstanceTemplate.scss'

import './selectTemplate.scss'

type Props = {
  availableVersions: VersionNumber[]
  editorState: StackDeploymentCreateRequest
  fetchBasePrices: ({ regionId, level }) => void
  getRegionIdsByProvider: (provider: PlatformId) => string[]
  getRegionsByProvider: (provider: string) => RegionState[] | null
  globalDeploymentTemplates?: GlobalDeploymentTemplateInfo[] | null
  onChange: (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    settings?: { shallow?: boolean },
  ) => void
  onChangeSnapshot?: (value?: ClusterSnapshot | null) => void
  onChangeSnapshotSource?: (value?: ElasticsearchCluster | null) => void
  profile: ProfileState
  providerIds: PlatformId[]
  region?: Region
  restoreFromSnapshot: boolean
  setDeploymentName: (name: string) => void
  setEsSettings?: (settings: DeepPartial<ElasticsearchClusterSettings> | null) => void
  setDeploymentTemplate: (template: DeploymentTemplateInfoV2) => void
  setGlobalTemplate: (globalTemplate: any) => void
  setRegion: (args: { regionId: RegionId; stackVersion: VersionNumber }) => void
  setVersion: (version: VersionNumber) => void
  showPrice: boolean
  showRegion: boolean
  isSkuPicker: boolean
  subscription?: BillingSubscriptionLevel
  trialMaxedOut?: boolean
  whitelistedVersions: VersionNumber[]
  isUserconsole: boolean
  hasDefaultSnapshotRepository: boolean
  disabled?: boolean
}

class SelectTemplate extends Component<Props> {
  render(): JSX.Element {
    const {
      availableVersions,
      editorState,
      getRegionsByProvider,
      onChange,
      onChangeSnapshot,
      onChangeSnapshotSource,
      providerIds,
      region,
      restoreFromSnapshot,
      setDeploymentName,
      setEsSettings,
      setVersion,
      showRegion,
      trialMaxedOut,
      whitelistedVersions,
      profile,
      globalDeploymentTemplates,
      setGlobalTemplate,
      isUserconsole,
      hasDefaultSnapshotRepository,
      disabled,
    } = this.props

    const { deployment, deploymentTemplate, regionId: userSelectedRegionId } = editorState
    const { name } = deployment

    const version = getUpsertVersion(editorState)

    const platform = getPlatform(userSelectedRegionId)
    const availableRegions = getRegionsByProvider(platform)

    const showPayingCustomerSections = !inTrial({ profile })

    const isTemplateCrossClusterSearch = isCrossClusterSearch({
      deploymentTemplate,
      deploymentTemplateId: deploymentTemplate?.id,
      systemOwned: false,
    })
    const templatesFilteredByRegion = this.filterTemplatesByRegion(globalDeploymentTemplates)
    // Once the API returns the correct templates, this won't be necessary #82357
    const visibleTemplates = isUserconsole
      ? getVisibleTemplates(this.filterSolutionTemplates(templatesFilteredByRegion))
      : getVisibleTemplates(globalDeploymentTemplates)

    return (
      <div>
        {trialMaxedOut ? <TrialLimitMessage /> : null}

        {isUserconsole && (
          <Fragment>
            <NameDeployment
              name={name}
              onChange={setDeploymentName}
              disabled={trialMaxedOut || disabled}
            />
            <EuiSpacer size='l' />
          </Fragment>
        )}

        {deploymentTemplate ? (
          <Fragment>
            <AdvancedSettings
              disabled={disabled}
              restoreFromSnapshot={restoreFromSnapshot}
              isUserconsole={isUserconsole}
              name={deployment.name}
              setDeploymentName={setDeploymentName}
              version={version}
              region={region!}
              getRegionsByProvider={getRegionsByProvider}
              availablePlatforms={providerIds}
              trialMaxedOut={trialMaxedOut}
              onChangePlatform={this.onChangePlatform}
              showRegion={showRegion}
              onChangeRegion={(regionId: string) =>
                this.onChangeRegion({ regionId, stackVersion: version! })
              }
              availableRegions={availableRegions}
              availableVersions={availableVersions}
              whitelistedVersions={whitelistedVersions}
              setVersion={setVersion}
              editorState={editorState}
              onChangeSnapshot={onChangeSnapshot!}
              onChangeSnapshotSource={onChangeSnapshotSource!}
              setEsSettings={setEsSettings!}
              showPayingCustomerSections={showPayingCustomerSections}
              globalDeploymentTemplates={visibleTemplates}
              deploymentTemplate={deploymentTemplate}
              onChangeTemplate={setGlobalTemplate}
              hasDefaultSnapshotRepository={hasDefaultSnapshotRepository}
            />
            {isTemplateCrossClusterSearch && (
              <Fragment>
                <EuiHorizontalRule />
                <EuiTitle size='s'>
                  <h2>
                    <FormattedMessage
                      id='create-ccs-deployment.remote-deployments-title'
                      defaultMessage='Remote deployments'
                    />
                  </h2>
                </EuiTitle>

                <CcsSetupRemoteDeployments editorState={editorState} onChange={onChange} />

                <EuiSpacer />
              </Fragment>
            )}
          </Fragment>
        ) : (
          <EuiLoadingContent />
        )}
      </div>
    )
  }

  onChangePlatform = (platform: PlatformId): void => {
    const { getRegionIdsByProvider, editorState } = this.props
    const version = getUpsertVersion(editorState)

    const availableRegions = getRegionIdsByProvider(platform)

    return this.onChangeRegion({ regionId: availableRegions[0], stackVersion: version! })
  }

  onChangeRegion = ({
    regionId,
    stackVersion,
  }: {
    regionId: string
    stackVersion: string
  }): void => {
    const { fetchBasePrices, setRegion, subscription } = this.props

    setRegion({ regionId, stackVersion })

    fetchBasePrices({ regionId, level: subscription })
  }

  filterTemplatesByRegion = (
    templates?: GlobalDeploymentTemplateInfo[] | null,
  ): GlobalDeploymentTemplateInfo[] => {
    if (!templates) {
      return []
    }

    const { editorState } = this.props
    const { regionId } = editorState

    return templates.filter((template) =>
      template.regions?.find((item) => item.region_id === regionId),
    )
  }

  // This function won't be necessary once the API returns the correct templates
  filterSolutionTemplates = (
    templates?: GlobalDeploymentTemplateInfo[] | null,
  ): GlobalDeploymentTemplateInfo[] => {
    if (!templates) {
      return []
    }

    return templates.filter((template) =>
      template.metadata?.find((item) => item.key === `parent_solution`),
    )
  }
}

export default withErrorBoundary(SelectTemplate)
