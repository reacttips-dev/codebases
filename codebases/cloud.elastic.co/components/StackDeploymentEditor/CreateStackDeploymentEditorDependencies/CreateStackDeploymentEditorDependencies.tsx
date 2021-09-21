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

import { isEmpty, cloneDeep } from 'lodash'

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { CuiAlert } from '../../../cui'

import {
  createDeploymentFromTemplate,
  getUpsertVersion,
  getRegionIdForCreate,
  getDeploymentVersionSetter,
  selectTemplateWithSameCategory,
  invalidateDefaultVersion,
  CreateDeploymentFromTemplateProps,
} from '../../../lib/stackDeployments'

import { getWhitelistedVersions } from '../../../lib/stackDeployments/getWhitelistedVersions'

import { mergeDeep } from '../../../lib/immutability-helpers'

import {
  AsyncRequestState,
  PluginDescription,
  ProfileState,
  Region,
  RegionId,
  StackDeploymentCreateRequest,
  VersionNumber,
} from '../../../types'

import {
  DeploymentCreateRequest,
  DeploymentsSearchResponse,
  DeploymentTemplateInfoV2,
  GlobalDeploymentTemplateInfo,
  StackVersionConfig,
} from '../../../lib/api/v1/types'

import { DeepPartial } from '../../../lib/ts-essentials'

import { CreateEditorComponentConsumerProps } from '../types'
import { State as ProvidersState } from '../../../reducers/providers'
import {
  getEsSettingsFromTemplate,
  getVisibleTemplates,
} from '../../../lib/stackDeployments/selectors'

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
  fetchCluster: (regionId: RegionId, clusterId: string) => void
  fetchDeploymentTemplates: (settings: {
    regionId: RegionId
    stackVersion?: VersionNumber | null
  }) => void
  fetchGlobalDeploymentTemplates: () => void
  fetchDeploymentTemplate: (
    regionId: RegionId,
    templateId: string,
    stackVersion: VersionNumber | null,
  ) => Promise<any>
  fetchRegionListIfNeeded: () => void
  fetchRegion: (regionId: RegionId) => void
  fetchSnapshotRepositories: (regionId: RegionId) => void
  fetchVersions: (region: { id: string }, settings: { showUnusable?: boolean }) => void
  searchTrialDeployments: () => void
  initialEditorState: StackDeploymentCreateRequest
}

type ConsumerProps = {
  isSkuPicker?: boolean
  children: (props: CreateEditorComponentConsumerProps) => ReactNode
  createDeploymentFromTemplateProps?: Partial<CreateDeploymentFromTemplateProps>
}

type Props = StateProps & DispatchProps & ConsumerProps

type State = {
  editorState: StackDeploymentCreateRequest
}

class CreateStackDeploymentEditorDependencies extends Component<Props, State> {
  state: State = {
    editorState: cloneDeep(this.props.initialEditorState),
  }

  static defaultProps: Partial<Props> = {
    initialEditorState: {
      deployment: {
        resources: {},
      },
    },
  }

  componentDidMount() {
    const {
      fetchRegionListIfNeeded,
      inTrial,
      searchTrialDeployments,
      fetchGlobalDeploymentTemplates,
    } = this.props

    fetchRegionListIfNeeded()

    if (inTrial) {
      searchTrialDeployments()
    }

    fetchGlobalDeploymentTemplates()

    this.fetchDependencies()
  }

  componentDidUpdate() {
    this.fetchDependencies()
  }

  render() {
    const {
      getDeploymentTemplates,
      getGlobalDeploymentTemplates,
      getFetchNodeConfigurationsRequest,
      getFetchSnapshotRepositoriesRequest,
      fetchRegionListRequest,
      getRegion,
      regionIds,
      showRegion,
      getVersionStacks,
      getVersionsRequest,
      children: renderEditorComponent,
      inTrial,
      searchTrialResults,
      areVersionsWhitelisted,
    } = this.props

    const { editorState } = this.state
    const regionId = editorState.regionId!
    const version = getUpsertVersion(editorState)!
    const deploymentTemplates = getDeploymentTemplates(regionId, version)
    const globalDeploymentTemplates = getGlobalDeploymentTemplates()
    const fetchNodeConfigurationsRequest = getFetchNodeConfigurationsRequest(editorState)
    const fetchSnapshotRepositoriesRequest = getFetchSnapshotRepositoriesRequest(editorState)
    const region = getRegion(editorState)
    const versionsRequest = getVersionsRequest(editorState)

    if (fetchRegionListRequest.error) {
      return (
        <CuiAlert type='error' details={fetchRegionListRequest.error}>
          <FormattedMessage
            id='stack-deployment-editor-dependencies.fetching-regions-failed'
            defaultMessage='Fetching regions failed'
          />
        </CuiAlert>
      )
    }

    if (versionsRequest.error) {
      return (
        <CuiAlert type='error' details={versionsRequest.error}>
          <FormattedMessage
            id='stack-deployment-editor-dependencies.fetching-elasticsearch-versions-failed'
            defaultMessage='Fetching Elasticsearch versions failed'
          />
        </CuiAlert>
      )
    }

    if (fetchNodeConfigurationsRequest.error) {
      return (
        <CuiAlert type='error' details={fetchNodeConfigurationsRequest.error}>
          <FormattedMessage
            id='stack-deployment-editor-dependencies.fetching-node-configurations-failed'
            defaultMessage='Fetching instance configurations failed'
          />
        </CuiAlert>
      )
    }

    if (fetchSnapshotRepositoriesRequest.error) {
      return <CuiAlert type='error'>{fetchSnapshotRepositoriesRequest.error}</CuiAlert>
    }

    const versionStacks = getVersionStacks(editorState)
    const availableVersions = this.getAvailableVersions()
    const whitelistedVersions = getWhitelistedVersions(versionStacks, areVersionsWhitelisted)

    const trialMaxedOut = Boolean(
      inTrial &&
        searchTrialResults &&
        searchTrialResults.match_count &&
        searchTrialResults.match_count > 0,
    )

    return renderEditorComponent({
      deploymentTemplates,
      globalDeploymentTemplates,
      availableVersions,
      showRegion,
      regionIds,
      region,
      editorState,
      onChange: this.onChange,
      setRegion: this.setRegion,
      setDeploymentTemplate: this.setDeploymentTemplate,
      setGlobalTemplate: this.setGlobalTemplate,
      whitelistedVersions,
      trialMaxedOut,
      showTrialExperience: inTrial,
    })
  }

  getAvailableVersions = (): string[] => {
    const { getVersionStacks } = this.props
    const { editorState } = this.state
    const versionStacks = getVersionStacks(editorState)

    if (!versionStacks) {
      return []
    }

    const availableVersions = versionStacks
      .map((versionStack) => versionStack.version!)
      .filter(Boolean)
    return availableVersions
  }

  getTemplateId = (
    regionId: string,
    globalTemplate: GlobalDeploymentTemplateInfo,
  ): string | null => {
    const template = globalTemplate.regions.find((region) => region.region_id === regionId)

    // Sanity
    if (!template) {
      return null
    }

    return template.deployment_template_id
  }

  fetchDependencies(): void {
    const {
      defaultRegionId,
      fetchDeploymentTemplates,
      fetchRegion,
      getDeploymentTemplates,
      getFetchDeploymentTemplatesRequest,
      getVersionStacks,
      inTrial,
      providers,
      regionIds,
      searchTrialDeployments,
      searchTrialResults,
      searchTrialResultsRequest,
      showRegion,
    } = this.props

    const { editorState } = this.state
    const { regionId, deployment, deploymentTemplate, globalDeploymentTemplate } = editorState
    const versionStacks = getVersionStacks(editorState)
    const deploymentRegion = getRegionIdForCreate({ deployment })
    const deploymentVersion = getUpsertVersion({ deployment, _fromJolt: false })
    const version = getUpsertVersion(editorState)

    if (
      inTrial &&
      searchTrialResults == null &&
      !searchTrialResultsRequest.isDone &&
      !searchTrialResultsRequest.inProgress
    ) {
      searchTrialDeployments()
    }

    // showRegion is saas while !showRegion is ECE
    if ((showRegion && isEmpty(providers)) || (!showRegion && isEmpty(regionIds))) {
      // We need to wait for regions before we can fetch the other deps
      return
    }

    if (!regionId) {
      this.setRegion({
        regionId: defaultRegionId,
        stackVersion: undefined,
      })

      fetchRegion(defaultRegionId)
      return
    }

    if (deploymentRegion && deploymentRegion !== regionId) {
      fetchRegion(regionId)
    }

    // If we change region or version, we need to superimpose it on templates
    const fetchDeploymentTemplatesRequest = getFetchDeploymentTemplatesRequest(regionId, version!)

    if (
      !fetchDeploymentTemplatesRequest.inProgress &&
      regionId &&
      version &&
      (deploymentRegion !== regionId || deploymentVersion !== version)
    ) {
      fetchDeploymentTemplates({
        regionId,
        stackVersion: version,
      })
    }

    const setVersion = getDeploymentVersionSetter({ editorState, onChange: this.onChange })

    invalidateDefaultVersion({
      versionStacks,
      version,
      setVersion,
    })

    const deploymentTemplates = getDeploymentTemplates(regionId, version!)
    const sortedTemplates = getVisibleTemplates(deploymentTemplates)
    selectTemplateWithSameCategory({
      deploymentTemplates: sortedTemplates,
      deploymentTemplate,
      globalDeploymentTemplate,
      setDeploymentTemplate: this.setDeploymentTemplate,
      regionChanged: deploymentRegion !== regionId,
      versionChanged: deploymentVersion !== version,
    })
  }

  setRegion = ({ regionId, stackVersion }: { regionId: string; stackVersion?: string }): void => {
    const { fetchVersions, fetchSnapshotRepositories, fetchDeploymentTemplates } = this.props

    this.onChange({ regionId })

    fetchVersions({ id: regionId }, { showUnusable: false })
    fetchSnapshotRepositories(regionId)

    if (stackVersion) {
      fetchDeploymentTemplates({
        regionId,
        stackVersion,
      })
    }
  }

  setDeploymentTemplate = (nextDeploymentTemplate: DeploymentTemplateInfoV2): void => {
    const {
      getRegion,
      getVersionStacks,
      inTrial,
      fetchCluster,
      createDeploymentFromTemplateProps = {},
    } = this.props
    const { editorState } = this.state
    const { deployment, deploymentTemplate } = editorState

    const region = getRegion(editorState)
    const version = getUpsertVersion(editorState)
    const stackVersions = getVersionStacks(editorState)

    if (!region) {
      return
    }

    if (deploymentTemplate === nextDeploymentTemplate) {
      return // sanity
    }

    const settings = getEsSettingsFromTemplate({
      deploymentTemplate: nextDeploymentTemplate.deployment_template,
    })
    const monitoringClusterId = settings?.monitoring?.target_cluster_id

    if (region && monitoringClusterId) {
      fetchCluster(region.id, monitoringClusterId)
    }

    this.onChange(
      {
        deploymentTemplate: nextDeploymentTemplate,
        deployment: createDeploymentFromTemplate({
          prevState: deployment,
          deploymentTemplate: nextDeploymentTemplate,
          region: region!,
          stackVersions: stackVersions!,
          version: version!,
          inTrial,
          ...createDeploymentFromTemplateProps,
        }),
      },
      {
        shallow: true,
      },
    )
  }

  setGlobalTemplate = (globalTemplate: GlobalDeploymentTemplateInfo): void => {
    const { getRegion, fetchDeploymentTemplate } = this.props
    const { editorState } = this.state

    const region = getRegion(editorState)

    const templateId = this.getTemplateId(region.id, globalTemplate)

    this.onChange({
      globalDeploymentTemplate: globalTemplate,
    })

    if (templateId) {
      fetchDeploymentTemplate(region.id, templateId, null)
    }
  }

  onChange = (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    { shallow = false }: { shallow?: boolean } = {},
  ): void => {
    if (shallow) {
      // NOTE: when doing shallow changes, ensure you actually send us whole objects!
      return this.onChangeShallow(changes as Partial<StackDeploymentCreateRequest>)
    }

    return this.onChangeDeep(changes)
  }

  onChangeShallow = (changes: Partial<StackDeploymentCreateRequest>): void => {
    const { editorState } = this.state

    const nextState: StackDeploymentCreateRequest = {
      ...editorState,
      ...changes,
    }

    this.setState({ editorState: nextState })
  }

  onChangeDeep = (changes: DeepPartial<StackDeploymentCreateRequest>): void => {
    const { editorState } = this.state
    const nextState = mergeDeep(editorState, changes)

    this.setState({ editorState: nextState })
  }
}

export default CreateStackDeploymentEditorDependencies
