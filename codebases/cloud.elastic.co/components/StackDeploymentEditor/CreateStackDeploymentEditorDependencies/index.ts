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

import { ReactNode } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import CreateStackDeploymentEditorDependencies from './CreateStackDeploymentEditorDependencies'

import { clearVersions, fetchVersions } from '../../../actions/elasticStack'
import { createDeployment, searchDeployments } from '../../../actions/stackDeployments'
import { fetchCluster } from '../../../actions/clusters'
import {
  fetchDeploymentTemplatesIfNeeded,
  fetchGlobalDeploymentTemplates,
  fetchDeploymentTemplate,
} from '../../../actions/topology/deploymentTemplates'
import { fetchNodeConfigurations } from '../../../actions/nodeConfigurations'
import { fetchRegionIfNeeded } from '../../../actions/regions'
import { fetchRegionListForDeploymentCreatePageIfNeeded } from '../../../actions/regionEqualizer'
import { fetchSnapshotRepositories } from '../../../actions/snapshotRepositories'

import {
  fetchDeploymentTemplatesRequest,
  fetchNodeConfigurationsRequest,
  fetchRegionListRequest,
  fetchSnapshotRepositoriesRequest,
  fetchVersionsRequest,
  getDeploymentTemplate,
  getDefaultRegionId,
  getDeploymentTemplates,
  getGlobalDeploymentTemplates,
  getProviders,
  getRegion,
  getRegionIds,
  getStackDeploymentsFromSearch,
  getVersionStacks,
  searchStackDeploymentsRequest,
} from '../../../reducers'

import { getProfile } from '../../../apps/userconsole/reducers'

import pluginDescriptions from '../../../config/plugins.json'

import { getConfigForKey } from '../../../selectors'

import { getSupportedDeploymentTemplates } from '../../../lib/stackDeployments/selectors'
import { getSupportedGlobalDeploymentTemplates } from '../../../lib/globalDeploymentTemplates'

import {
  AsyncRequestState,
  PluginDescription,
  ProfileState,
  ReduxState,
  Region,
  RegionId,
  StackDeploymentCreateRequest,
  VersionNumber,
} from '../../../types'

import {
  StackVersionConfig,
  DeploymentCreateRequest,
  DeploymentsSearchResponse,
  GlobalDeploymentTemplateInfo,
  DeploymentTemplateInfoV2,
} from '../../../lib/api/v1/types'

import { CreateEditorComponentConsumerProps } from '../types'
import { State as ProvidersState } from '../../../reducers/providers'

type StateProps = {
  defaultRegionId: RegionId
  fetchRegionListRequest: AsyncRequestState
  inTrial: boolean
  pluginDescriptions: PluginDescription[]
  profile?: ProfileState | null
  providers: ProvidersState
  regionIds?: RegionId[] | null
  searchTrialResults: DeploymentsSearchResponse | null
  searchTrialResultsRequest: AsyncRequestState
  showRegion: boolean
  areVersionsWhitelisted: boolean

  getDeploymentTemplates: (
    regionId: string,
    version: string,
  ) => DeploymentTemplateInfoV2[] | undefined
  getRegion: (editorState: StackDeploymentCreateRequest) => Region
  getVersionStacks: (editorState: StackDeploymentCreateRequest) => StackVersionConfig[] | null
  getVersionsRequest: (editorState: StackDeploymentCreateRequest) => AsyncRequestState
  getFetchNodeConfigurationsRequest: (
    editorState: StackDeploymentCreateRequest,
  ) => AsyncRequestState
  getFetchSnapshotRepositoriesRequest: (
    editorState: StackDeploymentCreateRequest,
  ) => AsyncRequestState
  getFetchDeploymentTemplatesRequest: (regionId: string, version: string) => AsyncRequestState
  getGlobalDeploymentTemplates: () => GlobalDeploymentTemplateInfo[] | null
  getDeploymentTemplate: (
    regionId: RegionId,
    templateId: string,
    stackVersion: VersionNumber | null,
  ) => DeploymentTemplateInfoV2 | undefined
}

type DispatchProps = {
  clearVersions: () => void
  createDeployment: (settings: { regionId: RegionId; deployment: DeploymentCreateRequest }) => void
  fetchDeploymentTemplates: (settings: {
    regionId: RegionId
    stackVersion?: VersionNumber | null
  }) => void
  fetchDeploymentTemplate: (
    regionId: RegionId,
    templateId: string,
    stackVersion: VersionNumber | null,
  ) => void
  fetchGlobalDeploymentTemplates: () => void
  fetchCluster: (regionId: RegionId, clusterId: string) => void
  fetchNodeConfigurations: (regionId: RegionId) => void
  fetchRegionListIfNeeded: () => void
  fetchRegion: (regionId: RegionId) => void
  fetchSnapshotRepositories: (regionId: RegionId) => void
  fetchVersions: (region: { id: string }, settings: { showUnusable?: boolean }) => void
  searchTrialDeployments: () => void
}

type ConsumerProps = {
  children: (props: CreateEditorComponentConsumerProps) => ReactNode
  showRegion?: boolean
}

const trialQueryId = `trial:deployments`

const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    regionIds: getRegionIds(state),
    fetchRegionListRequest: fetchRegionListRequest(state),
    profile: getProfile(state),
    providers: getProviders(state),
    showRegion: getConfigForKey(state, `APP_PLATFORM`) === `saas`,
    areVersionsWhitelisted: getConfigForKey(state, `APP_PLATFORM`) === `saas`,
    defaultRegionId: getDefaultRegionId(state),
    searchTrialResults: getStackDeploymentsFromSearch(state, trialQueryId),
    searchTrialResultsRequest: searchStackDeploymentsRequest(state, trialQueryId),
    inTrial: get(state, [`profile`, `inTrial`]),
    pluginDescriptions,

    getDeploymentTemplates: getDeploymentTemplatesFromParams,
    getGlobalDeploymentTemplates: getSupportedGlobalTemplates,
    getRegion: getRegionWithEditorState,
    getVersionStacks: getVersionStacksWithEditorState,
    getVersionsRequest: getVersionsRequestWithEditorState,
    getFetchNodeConfigurationsRequest: getFetchNodeConfigurationsRequestWithEditorState,
    getFetchSnapshotRepositoriesRequest: getFetchSnapshotRepositoriesRequestWithEditorState,
    getFetchDeploymentTemplatesRequest: (regionId: string, version: string) =>
      fetchDeploymentTemplatesRequest(state, regionId, version),
    getDeploymentTemplate: (
      regionId: RegionId,
      templateId: string,
      stackVersion: VersionNumber | null,
    ) => getDeploymentTemplate(state, regionId, templateId, stackVersion),
  }

  function getDeploymentTemplatesFromParams(regionId: string, version: string) {
    const deploymentTemplates = getDeploymentTemplates(state, regionId, version)
    const supportedDeploymentTemplates = getSupportedDeploymentTemplates(deploymentTemplates)

    return supportedDeploymentTemplates
  }

  function getSupportedGlobalTemplates() {
    const globalDeploymentTemplates = getGlobalDeploymentTemplates(state)
    const supportedGlobalTemplates =
      getSupportedGlobalDeploymentTemplates(globalDeploymentTemplates)

    return supportedGlobalTemplates
  }

  function getRegionWithEditorState(editorState: StackDeploymentCreateRequest) {
    const regionId = editorState.regionId!
    return getRegion(state, regionId)!
  }

  function getVersionStacksWithEditorState(editorState: StackDeploymentCreateRequest) {
    const regionId = editorState.regionId!
    return getVersionStacks(state, regionId)
  }

  function getVersionsRequestWithEditorState(editorState: StackDeploymentCreateRequest) {
    const regionId = editorState.regionId!
    return fetchVersionsRequest(state, regionId)
  }

  function getFetchNodeConfigurationsRequestWithEditorState(
    editorState: StackDeploymentCreateRequest,
  ) {
    const regionId = editorState.regionId!
    return fetchNodeConfigurationsRequest(state, regionId)
  }

  function getFetchSnapshotRepositoriesRequestWithEditorState(
    editorState: StackDeploymentCreateRequest,
  ) {
    const regionId = editorState.regionId!
    return fetchSnapshotRepositoriesRequest(state, regionId)
  }
}

const mapDispatchToProps: DispatchProps = {
  createDeployment,
  fetchDeploymentTemplates: fetchDeploymentTemplatesIfNeeded,
  fetchGlobalDeploymentTemplates,
  fetchDeploymentTemplate,
  fetchCluster,
  fetchNodeConfigurations,
  fetchRegion: fetchRegionIfNeeded,
  fetchRegionListIfNeeded: fetchRegionListForDeploymentCreatePageIfNeeded,
  fetchSnapshotRepositories,
  fetchVersions,
  clearVersions,
  searchTrialDeployments: () =>
    searchDeployments({
      queryId: trialQueryId,
      query: {
        query: {
          match_all: {},
        },
      },
    }),
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateStackDeploymentEditorDependencies)
