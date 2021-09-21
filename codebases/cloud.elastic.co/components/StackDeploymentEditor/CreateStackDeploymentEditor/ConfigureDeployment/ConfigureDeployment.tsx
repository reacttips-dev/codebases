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

import { get, isEqual, set } from 'lodash'

import React, { Component, ComponentType, ReactNode } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiLoadingSpinner,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiHorizontalRule,
} from '@elastic/eui'

import { CuiAlert, withErrorBoundary } from '../../../../cui'

import { ArchitectureSummary } from '../../../Topology/DeploymentTemplates/components/ArchitectureViz'
import AutoscalingToggle from '../../../Autoscaling/AutoscalingToggle'

import { planPaths } from '../../../../config/clusterPaths'

import { getAllowedPluginsForVersions } from '../../../../lib/plugins'
import { getSupportedSliderInstanceTypes } from '../../../../lib/sliders'

import {
  filterIngestPluginsOnMemory,
  findDefaultPlanForVersion,
  getMinimumMemoryFromPlan,
  isIngestPlugin,
} from '../../../../lib/deployments/plan'

import {
  canEnableAutoscaling,
  ensureDedicatedCoordinatingAwareTopology,
  ensureDedicatedMasterAwareTopology,
  getDeploymentNodeConfigurations,
  getEsPlan,
  getFirstEsCluster,
  getFirstSliderCluster,
  getSliderPlan,
  getUpsertVersion,
  getVersionOnCreate,
  getFirstEsResourceFromTemplate,
  isAutoscalingEnabled as checkIsAutoscalingEnabled,
} from '../../../../lib/stackDeployments'
import DeploymentInfrastructure from '../../../Topology/DeploymentTemplates/components/DeploymentInfrastructure'

import { DeepPartial } from '../../../../lib/ts-essentials'

import {
  AnyTopologyElement,
  AsyncRequestState,
  Region,
  RegionId,
  SnapshotDetails,
  StackDeploymentCreateRequest,
  SliderInstanceType,
} from '../../../../types'

import {
  ElasticsearchClusterPlan,
  StackVersionConfig,
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
} from '../../../../lib/api/v1/types'

import './configureDeployment.scss'

export interface Props extends WrappedComponentProps {
  fetchDeploymentTemplatesRequest: AsyncRequestState
  editorState: StackDeploymentCreateRequest
  onChange: (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    settings?: { shallow?: boolean },
  ) => void
  architectureSummary?: ComponentType<any>
  availableNumberOfZones: number
  createDeploymentRequest: AsyncRequestState
  stackVersions: StackVersionConfig[] | null
  inTrial: boolean
  bottomNavigationButtons?: ReactNode
  onlyShowPricingFactors?: boolean
  region: Region
  regionId: RegionId
  snapshotDetails?: SnapshotDetails | null
  showPrice: boolean
}

// TypeScript has issues with default props - this is one workaround. See:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11640

interface DefaultProps {
  architectureSummary: ComponentType<any>
  onlyShowPricingFactors: boolean
}

type PropsWithDefaults = Props & DefaultProps

type State = {
  touchedIngestPlugins: boolean
}

class ConfigureDeployment extends Component<Props, State> {
  static defaultProps: DefaultProps = {
    architectureSummary: ArchitectureSummary,
    onlyShowPricingFactors: false,
  }

  state: State = {
    touchedIngestPlugins: false,
  }

  render() {
    const { fetchDeploymentTemplatesRequest, createDeploymentRequest } = this
      .props as PropsWithDefaults

    /* Without this check, we'd run into errors when deploymentTemplates were
     * loaded without showing instance configurations (e.g.: ECE)
     */
    if (fetchDeploymentTemplatesRequest.inProgress) {
      return <EuiLoadingSpinner />
    }

    return (
      <div test-data-subj='configureDeployment-container'>
        <EuiFlexGroup gutterSize='xl'>
          <EuiFlexItem>
            <EuiFlexGroup direction='column' justifyContent='flexEnd'>
              {this.renderAutoscalingToggle()}

              <EuiFlexItem grow={false}>{this.renderDeploymentInfrastructure()}</EuiFlexItem>

              <EuiHorizontalRule margin='s' />

              {this.renderSummarySidebar()}

              {createDeploymentRequest.error && (
                <EuiFlexItem className='configureDeployment-error'>
                  <EuiSpacer size='m' />
                  <CuiAlert type='error'>{createDeploymentRequest.error}</CuiAlert>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }

  renderDeploymentInfrastructure() {
    const { onlyShowPricingFactors, editorState } = this.props as PropsWithDefaults

    const { deployment, deploymentTemplate } = editorState
    const plan = this.getEsPlan()

    if (plan === null) {
      throw new Error(`Plan cannot be null`) // sanity
    }

    const versionConfig = this.getVersionConfig()

    return (
      <DeploymentInfrastructure
        showUserSettings={false}
        deployment={deployment}
        templateInfo={deploymentTemplate!}
        versionConfig={versionConfig}
        onChange={this.onConfigurationChange}
        onPluginsChange={this.onPluginsChange}
        onScriptingChange={this.onScriptingChange}
        onlyShowPricingFactors={onlyShowPricingFactors}
      />
    )
  }

  renderAutoscalingToggle() {
    const {
      editorState: { deployment, deploymentTemplate },
      inTrial,
      onlyShowPricingFactors,
    } = this.props

    if (onlyShowPricingFactors) {
      return null
    }

    const version = getVersionOnCreate({ deployment })

    if (!version) {
      return null
    }

    const displayAutoscalingToggle = canEnableAutoscaling({ deploymentTemplate, version, inTrial })

    if (!displayAutoscalingToggle) {
      return null
    }

    return (
      <EuiFlexItem>
        <AutoscalingToggle
          deployment={deployment}
          deploymentTemplate={deploymentTemplate}
          onChangeAutoscaling={this.onChangeAutoscaling}
        />
      </EuiFlexItem>
    )
  }

  renderSummarySidebar() {
    const {
      editorState,
      snapshotDetails,
      onlyShowPricingFactors,
      architectureSummary: ArchitectureSummaryComponent,
    } = this.props as PropsWithDefaults

    const { regionId, deployment, deploymentTemplate } = editorState
    const { name: deploymentName } = deployment
    const isAutoscalingEnabled = checkIsAutoscalingEnabled({ deployment })
    const instanceConfigurations = deploymentTemplate!.instance_configurations
    const deploymentVersion = getUpsertVersion(editorState)

    if (onlyShowPricingFactors) {
      return null
    }

    return (
      <ArchitectureSummaryComponent
        regionId={regionId}
        isAutoscalingEnabled={isAutoscalingEnabled}
        instanceConfigurations={instanceConfigurations}
        nodeConfigurations={this.getNodeConfigurations()}
        deploymentName={deploymentName}
        deploymentVersion={deploymentVersion}
        snapshotDetails={snapshotDetails}
        render={(className, content) => (
          <EuiFlexItem grow={false} className={className}>
            {content}
          </EuiFlexItem>
        )}
      />
    )
  }

  onPluginsChange = ({
    plugins,
    path = [`elasticsearch`, `enabled_built_in_plugins`],
    userInitiated = true,
  }) => {
    const plan = this.getEsPlan()

    if (!plan) {
      return
    }

    for (const nodeConfiguration of plan.cluster_topology) {
      const existingIngestPlugins = get(nodeConfiguration, path, []).filter(isIngestPlugin)
      const ingestPlugins = plugins.filter(isIngestPlugin)

      if (userInitiated && !isEqual(existingIngestPlugins, ingestPlugins)) {
        this.setState({ touchedIngestPlugins: true })
      }

      this.onChange(nodeConfiguration, path, plugins)
    }
  }

  onScriptingChange = (
    scriptingType: 'inline' | 'stored' | 'file',
    value: boolean | 'on' | 'off' | 'sandbox',
  ) => {
    const {
      editorState: { deployment },
    } = this.props

    const plan = this.getEsPlan()

    if (!plan) {
      return
    }

    const version = getVersionOnCreate({ deployment })

    if (!version) {
      return
    }

    for (const nodeConfiguration of plan.cluster_topology) {
      if (get(nodeConfiguration, planPaths.scripting) == null) {
        const defaultPlanForVersion = findDefaultPlanForVersion(version)
        this.onChange(
          nodeConfiguration,
          planPaths.scripting,
          get(defaultPlanForVersion, planPaths.scripting),
        )
      }

      const scriptingValue =
        typeof value === `boolean`
          ? { enabled: value }
          : { enabled: value !== `off`, sandbox_mode: value === `sandbox` }

      this.onChange(nodeConfiguration, planPaths.scripting.concat(scriptingType), scriptingValue)
    }
  }

  getEsPlan = (): ElasticsearchClusterPlan | null => {
    const { editorState } = this.props
    const { deployment } = editorState

    return getEsPlan({ deployment })
  }

  getKibPlan = (props: Props = this.props) => {
    const { editorState } = props
    const { deployment } = editorState
    const kibPlan = getSliderPlan({ sliderInstanceType: `kibana`, deployment })
    return kibPlan
  }

  getApmPlan = (props: Props = this.props) => {
    const { editorState } = props
    const { deployment } = editorState
    const apmPlan = getSliderPlan({ sliderInstanceType: `apm`, deployment })
    return apmPlan
  }

  getAppSearchPlan = (props: Props = this.props) => {
    const { editorState } = props
    const { deployment } = editorState
    const appsearchPlan = getSliderPlan({ sliderInstanceType: `appsearch`, deployment })
    return appsearchPlan
  }

  getEnterpriseSearchPlan = (props: Props = this.props) => {
    const { editorState } = props
    const { deployment } = editorState
    const enterpriseSearchPlan = getSliderPlan({
      sliderInstanceType: `enterprise_search`,
      deployment,
    })
    return enterpriseSearchPlan
  }

  getOriginalPlugins = (): string[] => {
    const { editorState } = this.props
    const { deploymentTemplate } = editorState

    const esResource = getFirstEsResourceFromTemplate({
      deploymentTemplate: deploymentTemplate?.deployment_template,
    })

    return esResource?.plan.elasticsearch.enabled_built_in_plugins || []
  }

  getVersionConfig = () => {
    const plan = this.getEsPlan()
    const {
      stackVersions,
      editorState: { deployment },
    } = this.props
    const version = getVersionOnCreate({ deployment })

    if (!plan || !stackVersions || !version) {
      return undefined
    }

    const currentVersionConfig = stackVersions.find(
      (versionConfig) => versionConfig.version === version,
    )

    return currentVersionConfig
  }

  getPlugins = (): string[] => {
    const plan = this.getEsPlan()

    if (!plan) {
      return []
    }

    // Assumption: plugins are always identical across instance configurations.
    for (const nodeConfiguration of plan.cluster_topology) {
      const plugins = get(nodeConfiguration, planPaths.plugins, [])

      if (plugins.length > 0) {
        return plugins
      }
    }

    return []
  }

  getAllPlugins = () => {
    const plan = this.getEsPlan()
    const {
      stackVersions,
      editorState: { deployment },
    } = this.props
    const version = getVersionOnCreate({ deployment })

    if (!plan || !stackVersions || !version) {
      return []
    }

    const currentVersionConfig = stackVersions.find(
      (versionConfig) => versionConfig.version === version,
    )

    const allPlugins = get(currentVersionConfig, [`elasticsearch`, `plugins`], [])

    return allPlugins
  }

  getNodeConfigurations(): AnyTopologyElement[] {
    const { editorState } = this.props
    const { deployment } = editorState

    if (deployment == null) {
      return []
    }

    return getDeploymentNodeConfigurations({ deployment })
  }

  onSliderChange = (
    sliderInstanceType: SliderInstanceType,
    path: string[],
    value: any,
    settings?: { shallow?: boolean },
  ) => {
    const { editorState, onChange } = this.props
    const { deployment } = editorState
    const cluster = getFirstSliderCluster({ deployment, sliderInstanceType })

    set(cluster, path, value)

    onChange(
      {
        deployment: {
          resources: {
            [sliderInstanceType]: [cluster],
          },
        },
      },
      settings,
    )
  }

  onConfigurationChange = (nodeConfiguration) => (path, value) => {
    const { editorState } = this.props
    const { deployment } = editorState

    getSupportedSliderInstanceTypes().forEach((sliderInstanceType) => {
      const plan = getSliderPlan({ deployment, sliderInstanceType })
      const configs = (plan && plan.cluster_topology) || []
      const index = configs.indexOf(nodeConfiguration)

      if (index !== -1) {
        // right now we're handling appsearch as if it doesn't have nodes for
        // the purposes of settings -- this will change to
        // doesSliderInstanceTypeHaveNodeTypes(sliderInstanceType) when we amend
        // the UI to handle nodes separately for appsearch
        const hasNodes = sliderInstanceType === `elasticsearch`
        const isSettingsChange = path[0] === sliderInstanceType

        if (isSettingsChange && !hasNodes) {
          // for sliders without node types, apply settings changes at the plan level
          this.onSliderChange(sliderInstanceType, [`plan`, ...path], value)
        } else {
          // otherwise, at the node level
          this.onChange(nodeConfiguration, path, value)
        }
      }
    })
  }

  onChange = (nodeConfiguration, path, value) => {
    const { editorState, onChange } = this.props
    const { deployment } = editorState

    set(nodeConfiguration, path, value)

    this.updateIngestPluginsAutomatically({ path })
    this.updateDedicatedCoordinating(deployment)
    this.updateDedicatedMasters(deployment)

    onChange({ deployment })
  }

  onChangeAutoscaling = (deployment) => {
    const { onChange } = this.props

    onChange({ deployment }, { shallow: true })
  }

  updateIngestPluginsAutomatically({ path }) {
    const { touchedIngestPlugins } = this.state
    const { editorState, stackVersions } = this.props
    const { deploymentTemplate, deployment } = editorState
    const instanceConfigurations = deploymentTemplate!.instance_configurations || []

    const isEditingSize = isEqual(path, [`size`])

    // Once the user manually touches ingest plugins, it's up to them
    if (touchedIngestPlugins) {
      return
    }

    // Changes to size could affect whether ingest plugins are allowed
    if (!isEditingSize) {
      return
    }

    const esPlan = this.getEsPlan()
    const esVersion = getVersionOnCreate({ deployment })

    if (!esPlan || !esVersion || !stackVersions) {
      return
    }

    const minimumMemory = getMinimumMemoryFromPlan(esPlan, instanceConfigurations)
    const allowedPlugins = getAllowedPluginsForVersions({ plan: esPlan, versions: stackVersions })

    const plugins = filterIngestPluginsOnMemory({
      plugins: this.getPlugins(),
      allowedPlugins,
      minimumMemory,
      esVersion,
    })

    this.onPluginsChange({
      plugins,
      userInitiated: false,
    })
  }

  // Following a plan change, possibly enable or disable dedicated ingest for this deployment
  updateDedicatedCoordinating(deployment: DeploymentCreateRequest | DeploymentUpdateRequest) {
    const { editorState, onChange } = this.props
    const { deploymentTemplate } = editorState

    const esCluster = getFirstEsCluster({ deployment })!
    const topologyPath = [`plan`, `cluster_topology`]

    const dedicatedIngestAwareTopology = ensureDedicatedCoordinatingAwareTopology({
      esCluster,
      deploymentTemplate: deploymentTemplate!,
    })

    set(esCluster, topologyPath, dedicatedIngestAwareTopology)

    onChange({
      deployment: {
        resources: {
          elasticsearch: [esCluster],
        },
      },
    })
  }

  // Following a plan change, possibly enable or disable dedicated masters for this deployment
  updateDedicatedMasters(deployment: DeploymentCreateRequest | DeploymentUpdateRequest) {
    const { region, editorState, onChange } = this.props
    const { deploymentTemplate } = editorState
    const { instance_configurations: instanceConfigurations = [] } = deploymentTemplate!

    const cluster = getFirstEsCluster({ deployment })!
    const topologyPath = [`plan`, `cluster_topology`]

    const dedicatedMasterAwareTopology = ensureDedicatedMasterAwareTopology({
      region,
      deploymentTemplate,
      cluster,
      instanceConfigurations,
      onlySized: false,
    })

    set(cluster, topologyPath, dedicatedMasterAwareTopology)

    onChange({
      deployment: {
        resources: {
          elasticsearch: [cluster],
        },
      },
    })
  }
}

export default withErrorBoundary(injectIntl(ConfigureDeployment))
