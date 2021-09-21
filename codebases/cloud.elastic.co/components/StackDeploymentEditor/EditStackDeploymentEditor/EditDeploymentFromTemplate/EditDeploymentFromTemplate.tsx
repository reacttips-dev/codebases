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

import React, { Component, ComponentType, Fragment } from 'react'
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { find, flatMap, get, has, isEmpty, uniq } from 'lodash'

import {
  EuiBetaBadge,
  EuiCallOut,
  EuiErrorBoundary,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingContent,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert, CuiRouterLinkButtonEmpty } from '../../../../cui'

import DangerButton from '../../../DangerButton'
import ExternalLink from '../../../ExternalLink'
import ApiRequestExample from '../../../ApiRequestExample'

import EditIndexCuration from './EditIndexCuration'
import EditIlm from './EditIlm'

import FailoverOptions from '../FailoverOptions'
import NodeRolesWarning from './NodeRolesWarning'

import Strategies from '../../../DeploymentConfigure/Strategies'
import { StackConfigurationChangeExplain } from '../../../StackDeploymentConfigurationChange'
import StackDeploymentUpdateDryRunWarnings from '../../../StackDeploymentUpdateDryRunWarnings'
import StackDeploymentUpdateDryRunWarningCheck from '../../../StackDeploymentUpdateDryRunWarningCheck'

import { ArchitectureSummary } from '../../../Topology/DeploymentTemplates/components/ArchitectureViz'
import AutoscalingToggle from '../../../Autoscaling/AutoscalingToggle'

import { deploymentUrl } from '../../../../lib/urlBuilder'
import { getSupportedSliderInstanceTypes } from '../../../../lib/sliders'

import { getAllowedPluginsForVersion } from '../../../../lib/plugins'

import { getTopologiesFromTemplate } from '../../../../lib/deploymentTemplates/getTopologiesFromTemplate'

import {
  canEnableAutoscaling,
  defaultStrategy,
  getDeploymentNodeConfigurations,
  getEsPlan,
  getSliderPlan,
  getSliderPlanFromGet,
  getVersion,
  isData,
  sanitizeUpdateRequestBeforeSend,
  validateUpdateRequest,
} from '../../../../lib/stackDeployments'

import { isEnabledConfiguration } from '../../../../lib/deployments/conversion'

import { planPaths } from '../../../../config/clusterPaths'
import { messages } from '../../../../constants/ilmBadgeMessage'
import { signUp } from '../../../../apps/userconsole/urls'

import { updateDeploymentUrl } from '../../../../lib/api/v1/urls'

import { DeepPartial } from '../../../../lib/ts-essentials'

import {
  AsyncRequestState,
  ElasticsearchCluster,
  Region,
  RegionId,
  StackDeploymentUpdateRequest,
} from '../../../../types'

import {
  ApmTopologyElement,
  ClusterCurationSpec,
  DeploymentUpdateRequest,
  ElasticsearchClusterPlan,
  ElasticsearchClusterSettings,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  KibanaClusterTopologyElement,
  PlanStrategy,
  StackVersionConfig,
} from '../../../../lib/api/v1/types'
import { exceededTrialNodes } from '../../../../lib/stackDeployments/trials'
import CreditCardModalButton from '../../../../apps/userconsole/components/Billing/CreditCardModalButton'
import { getPropsToExplainChangeFromPreviousDeployment } from '../../../StackDeploymentConfigurationChange/StackConfigurationChangeExplain/explainChangeFromPreviousDeployment'
import DeploymentInfrastructure from '../../../Topology/DeploymentTemplates/components/DeploymentInfrastructure'

type AnyTopologyElement =
  | ElasticsearchClusterTopologyElement
  | KibanaClusterTopologyElement
  | ApmTopologyElement

export type Props = {
  intl: IntlShape
  editorState: StackDeploymentUpdateRequest
  esCluster: ElasticsearchCluster
  architectureSummary?: ComponentType<any>
  basedOnAttempt: boolean
  esVersions: StackVersionConfig[] | null
  fetchRegionIfNeeded: (regionId: RegionId) => void
  fetchInstanceConfigurationIfNeeded: (regionId: RegionId, id: string) => Promise<any>
  fetchInstanceConfigurationsIfNeeded: (regionId: RegionId) => Promise<any>
  hideConfigChangeStrategy: boolean
  hideExtraFailoverOptions: boolean
  instanceConfigurations: InstanceConfiguration[]
  inTrial: boolean
  isHeroku: boolean
  readOnlyIndexCurationTargets: boolean
  region?: Region
  ucIlmBetaBadge: boolean
  updateDeployment: (settings: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
  updateStackDeploymentRequest: AsyncRequestState
  updateIndexPatterns: (settings: {
    regionId: string
    deploymentId: string
    indexPatterns: ClusterCurationSpec[]
  }) => void
  onScriptingChange: (
    scriptingType: 'inline' | 'stored' | 'file',
    value: boolean | 'on' | 'off' | 'sandbox',
  ) => void
  onEsPlanChange: (path: string[], value: any) => void
  onWidePlanChange: (path: string[], value: any) => void
  onStrategyChange: (strategy: PlanStrategy) => void
  onChange: (nodeConfiguration: AnyTopologyElement, path: string[], value: any) => void
  onStateChange: (
    changes: DeepPartial<StackDeploymentUpdateRequest>,
    settings?: { shallow?: boolean },
  ) => void
  invalidateDerivedSettings: () => void
  replaceEsPlan: (changes: {
    plan: ElasticsearchClusterPlan
    settings: ElasticsearchClusterSettings
  }) => void
}

class EditDeploymentFromTemplate extends Component<Props> {
  static defaultProps = {
    architectureSummary: ArchitectureSummary,
  }

  componentDidMount() {
    const {
      editorState: { regionId },
      fetchRegionIfNeeded,
      fetchInstanceConfigurationsIfNeeded,
      invalidateDerivedSettings,
    } = this.props

    Promise.all([
      fetchRegionIfNeeded(regionId),
      fetchInstanceConfigurationsIfNeeded(regionId),
    ]).then(invalidateDerivedSettings)
  }

  render() {
    const {
      architectureSummary,
      basedOnAttempt,
      editorState,
      esCluster,
      hideConfigChangeStrategy,
      hideExtraFailoverOptions,
      instanceConfigurations,
      intl: { formatMessage },
      isHeroku,
      onEsPlanChange,
      onWidePlanChange,
      readOnlyIndexCurationTargets,
      ucIlmBetaBadge,
      updateStackDeploymentRequest,
      inTrial,
    } = this.props

    const ArchitectureSummaryComponent = architectureSummary!

    const { deployment, deploymentUnderEdit, deploymentTemplate } = editorState

    const displayName = deployment.name

    const version = this.getVersion()
    const strategy = this.getStrategy()
    const pendingPlan = this.getPlan()!
    const configurationIds = this.getConfigurationIds()

    const didLoadEveryInstanceConfiguration: boolean =
      configurationIds.length === 0 ||
      Boolean(
        instanceConfigurations &&
          configurationIds.every((id) =>
            instanceConfigurations.some((instanceConfiguration) => instanceConfiguration.id === id),
          ),
      )

    if (!didLoadEveryInstanceConfiguration || pendingPlan.cluster_topology == null) {
      return <EuiLoadingContent lines={6} />
    }

    const nodeAttributesExist = pendingPlan.cluster_topology
      .filter((instance) => isData({ topologyElement: instance }))
      .some((node) => {
        if (!node.elasticsearch) {
          return false
        }

        return (
          node.elasticsearch.node_attributes !== undefined &&
          !isEmpty(node.elasticsearch.node_attributes)
        )
      })

    const badgeText = ucIlmBetaBadge
      ? formatMessage(messages.ucIlmBadge)
      : formatMessage(messages.acIlmBadge)

    const showIndexCuration = has(esCluster, [`curation`, `plan`, `from_instance_configuration_id`])
    const exceededNodes = exceededTrialNodes({ deployment, inTrial, instanceConfigurations })

    const displayAutoscalingToggle = canEnableAutoscaling({ deploymentTemplate, version, inTrial })

    return (
      <EuiErrorBoundary>
        {isHeroku && (
          <Fragment>
            <EuiCallOut
              color='warning'
              title={
                <FormattedMessage
                  id='edit-deployment-from-template.heroku-frozen-topology-title'
                  defaultMessage='Some features are not available to Heroku users'
                />
              }
            >
              <FormattedMessage
                id='edit-deployment-from-template.heroku-frozen-topology-description'
                defaultMessage="You can edit user settings, change plugins, and upgrade versions. However, you can't edit the size per zone or number of availability zones. Want to take advantage of these features and more? {signupToElasticCloud} today."
                values={{
                  signupToElasticCloud: (
                    <ExternalLink href={signUp()}>
                      <FormattedMessage
                        id='edit-deployment-from-template.sign-up'
                        defaultMessage='Sign up to Elastic Cloud'
                      />
                    </ExternalLink>
                  ),
                }}
              />
            </EuiCallOut>

            <EuiSpacer size='m' />
          </Fragment>
        )}

        <EuiFlexGroup gutterSize='xl'>
          <EuiFlexItem grow={false}>
            {displayAutoscalingToggle && (
              <AutoscalingToggle
                onChangeAutoscaling={this.onChangeAutoscaling}
                deployment={deployment}
                deploymentTemplate={deploymentTemplate}
              />
            )}

            {this.renderNodeConfigurations()}

            {nodeAttributesExist && (
              <Fragment>
                <EuiTitle size='s'>
                  <EuiFlexGroup
                    className='editDeployment-ilm'
                    gutterSize='s'
                    alignItems='center'
                    responsive={false}
                    wrap={true}
                  >
                    <EuiFlexItem grow={false}>
                      <EuiIcon type='indexManagementApp' size='l' />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <div>
                        <FormattedMessage
                          id='edit-deployment-from-template.ilm'
                          defaultMessage='Index Lifecycle Management'
                        />
                      </div>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiBetaBadge className='ilmSettings-badge' label={badgeText} />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiTitle>
                <EditIlm instanceConfigurations={instanceConfigurations} plan={pendingPlan} />
                <EuiSpacer size='s' />
              </Fragment>
            )}

            {!nodeAttributesExist && showIndexCuration && (
              <EditIndexCuration
                editorState={editorState}
                onChange={onEsPlanChange}
                instanceConfigurations={instanceConfigurations}
                readOnlyIndexCurationTargets={readOnlyIndexCurationTargets}
              />
            )}

            <EuiTitle size='s'>
              <div>
                <FormattedMessage
                  id='edit-deployment-from-template.settings'
                  defaultMessage='Settings'
                />
              </div>
            </EuiTitle>

            <EuiSpacer size='m' />

            {hideConfigChangeStrategy || (
              <Fragment>
                <Strategies strategy={strategy} onUpdate={this.setStrategy} />
                <EuiSpacer size='m' />
              </Fragment>
            )}

            <FailoverOptions
              deployment={deploymentUnderEdit}
              plan={pendingPlan}
              onChange={onWidePlanChange}
              hideExtraFailoverOptions={hideExtraFailoverOptions}
              basedOnAttempt={basedOnAttempt}
            />

            <EuiSpacer size='xl' />

            <EuiFlexGroup responsive={false}>
              <EuiFlexItem grow={false}>{this.renderSaveButton()}</EuiFlexItem>
              <EuiFlexItem grow={false}>
                <CuiRouterLinkButtonEmpty
                  to={this.getDeploymentUrl()}
                  className='editCluster-cancel'
                >
                  <FormattedMessage
                    id='edit-deployment-from-template.cancel'
                    defaultMessage='Cancel'
                  />
                </CuiRouterLinkButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>

            {updateStackDeploymentRequest.error && (
              <Fragment>
                <EuiSpacer size='m' />
                <CuiAlert type='error'>{updateStackDeploymentRequest.error}</CuiAlert>
              </Fragment>
            )}
          </EuiFlexItem>

          <EuiErrorBoundary>
            <ArchitectureSummaryComponent
              sticky={true}
              regionId={editorState.regionId}
              instanceConfigurations={instanceConfigurations}
              nodeConfigurations={this.getNodeConfigurations()}
              deploymentName={displayName}
              deploymentVersion={version}
              isTrialConverting={exceededNodes.length > 0}
              exceededTrialInstances={exceededNodes}
              resetNodeToTrial={this.resetNodeToTrial}
              shouldFetchPriceInTrial={inTrial}
              render={(className, content) => (
                <EuiFlexItem grow={false} className={className}>
                  {content}
                </EuiFlexItem>
              )}
            />
          </EuiErrorBoundary>
        </EuiFlexGroup>
      </EuiErrorBoundary>
    )
  }

  renderNodeConfigurations() {
    const { editorState, esCluster, onScriptingChange, onChange, instanceConfigurations, inTrial } =
      this.props

    const { deployment, deploymentUnderEdit, deploymentTemplate } = editorState
    const plan = getEsPlan({ deployment })

    if (plan === null) {
      throw new Error(`Plan cannot be null`) // sanity
    }

    const versionConfig = this.getVersionConfig()

    const lastSuccessfulPlan = this.getLastSuccessfulPlan()
    const hasInitialPlan = Boolean(lastSuccessfulPlan)

    const templateInfo = deploymentTemplate || {
      instance_configurations: instanceConfigurations,
      deployment_template: undefined,
    }

    return (
      <Fragment>
        {hasInitialPlan && esCluster.isStopped && !esCluster.plan.isPending && (
          <CuiAlert type='warning'>
            <FormattedMessage
              id='deployment-stopped-status.deployment-restart'
              defaultMessage='To restore this deployment with its previous configuration, use {link}'
              values={{
                link: (
                  <Link to={this.getDeploymentUrl()}>
                    <FormattedMessage
                      id='deployment-stopped-status.manage-deployment'
                      defaultMessage='Manage deployment'
                    />
                  </Link>
                ),
              }}
            />
          </CuiAlert>
        )}
        <DeploymentInfrastructure
          showUserSettings={true}
          deployment={deployment}
          deploymentUnderEdit={deploymentUnderEdit}
          templateInfo={templateInfo}
          versionConfig={versionConfig}
          onChange={(nodeConfiguration) => (path, value) =>
            onChange(nodeConfiguration, path, value)}
          onPluginsChange={this.onPluginsChange}
          onScriptingChange={onScriptingChange}
          showTrialThreshold={inTrial}
        />
      </Fragment>
    )
  }

  renderApplyPlanModal = () => {
    const { editorState, esCluster } = this.props
    const { regionId, deployment, deploymentUnderEdit } = editorState
    const deploymentId = deploymentUnderEdit.id

    const explainChangeProps = getPropsToExplainChangeFromPreviousDeployment({
      newDeployment: deployment,
      oldDeployment: deploymentUnderEdit,
    })

    const deploymentUpdateRequest = this.getUpdatePayload()

    return (
      <Fragment>
        <StackDeploymentUpdateDryRunWarnings
          deploymentId={deploymentId}
          deployment={deploymentUpdateRequest}
          spacerAfter={true}
        />

        <NodeRolesWarning deployment={deployment} deploymentUnderEdit={deploymentUnderEdit} />

        <StackConfigurationChangeExplain
          regionId={regionId}
          elasticsearchClusterId={esCluster.id}
          pruneOrphans={deploymentUpdateRequest.prune_orphans}
          isPastHistory={false}
          {...explainChangeProps}
        />
      </Fragment>
    )
  }

  renderSaveButton = () => {
    const { editorState, updateStackDeploymentRequest, inTrial, instanceConfigurations } =
      this.props

    const { deployment, deploymentUnderEdit } = editorState
    const deploymentId = deploymentUnderEdit.id

    const validationErrors = validateUpdateRequest({ deploymentUnderEdit, deployment })

    if (inTrial) {
      const exceededNodes = exceededTrialNodes({ deployment, inTrial, instanceConfigurations })

      if (exceededNodes.length > 0) {
        return (
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <CreditCardModalButton
                fill={true}
                type='full'
                onSendBillingDetailsSuccess={() => this.saveChanges()}
              >
                <FormattedMessage
                  id='deployment-create.add-billing-info'
                  defaultMessage='Save and add billing information'
                />
              </CreditCardModalButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        )
      }
    }

    return (
      <StackDeploymentUpdateDryRunWarningCheck deploymentId={deploymentId}>
        {({ dryRunCheckPassed }) => (
          <Fragment>
            <DangerButton
              data-test-id='editDeployment-submitBtn'
              color='primary'
              disabled={!isEmpty(validationErrors)}
              isBusy={updateStackDeploymentRequest.inProgress}
              fill={true}
              requiresSudo={true}
              onConfirm={() => this.saveChanges()}
              modal={{
                title: (
                  <FormattedMessage
                    id='edit-deployment.modal.title'
                    defaultMessage='Save configuration settings?'
                  />
                ),
                body: this.renderApplyPlanModal,
                confirmButtonDisabled: !dryRunCheckPassed,
                className: `editDeployment-modal`,
              }}
            >
              <FormattedMessage id='edit-deployment-from-template.save' defaultMessage='Save' />
            </DangerButton>

            <ApiRequestExample
              method='PUT'
              endpoint={updateDeploymentUrl({ deploymentId })}
              body={this.getUpdatePayload()}
            />
          </Fragment>
        )}
      </StackDeploymentUpdateDryRunWarningCheck>
    )
  }

  getPlugins = (props: Props = this.props): string[] => {
    const plan = this.getPlan(props)
    return this.getPluginsFromPlan(plan)
  }

  getPluginsFromPlan = (plan): string[] => {
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

  getAllowedPlugins = (): string[] => {
    const { esVersions } = this.props

    if (!esVersions) {
      return []
    }

    const version = this.getVersion()
    const esStackVersion = esVersions.find((stackVersion) => stackVersion.version === version)

    return getAllowedPluginsForVersion({ version: esStackVersion })
  }

  getPlan = (props: Props = this.props): ElasticsearchClusterPlan => {
    const { editorState } = props
    const { deployment } = editorState
    const esPlan = getSliderPlan({ sliderInstanceType: `elasticsearch`, deployment })
    return esPlan
  }

  getOriginalPlan = (
    { fallbackToCurrentPlan }: { fallbackToCurrentPlan: boolean } = { fallbackToCurrentPlan: true },
  ) => {
    const { editorState } = this.props
    const { deploymentUnderEdit } = editorState
    const esPlan = getSliderPlanFromGet<ElasticsearchClusterPlan>({
      sliderInstanceType: `elasticsearch`,
      deployment: deploymentUnderEdit,
    })

    if (!esPlan && fallbackToCurrentPlan) {
      return this.getPlan()
    }

    return esPlan
  }

  getLastSuccessfulPlan = () => {
    const { editorState } = this.props
    const { deploymentUnderEdit } = editorState
    const esPlan = getSliderPlanFromGet<ElasticsearchClusterPlan>({
      sliderInstanceType: `elasticsearch`,
      deployment: deploymentUnderEdit,
      state: `last_success`,
    })

    return esPlan
  }

  getConfigurationIds(): string[] {
    const { editorState } = this.props
    const { deployment, deploymentTemplate } = editorState

    // if we have a template, source instance configurations from that
    if (deploymentTemplate) {
      const nodeConfigurations = this.getNodeConfigurationsFromTemplate()
      return getNodeConfigurationIds(nodeConfigurations)
    }

    const nodeConfigurations = getDeploymentNodeConfigurations({ deployment })

    return getNodeConfigurationIds(nodeConfigurations)

    function getNodeConfigurationIds(nodeConfigurations): string[] {
      const allConfigurationIds = nodeConfigurations
        .filter((nodeConfiguration) => nodeConfiguration.instance_configuration_id)
        .map((nodeConfiguration) => nodeConfiguration.instance_configuration_id!)

      return uniq(allConfigurationIds)
    }
  }

  getNodeConfigurations() {
    const { editorState } = this.props
    const { deployment } = editorState

    const plans = getSupportedSliderInstanceTypes().map((sliderInstanceType) =>
      getSliderPlan({ sliderInstanceType, deployment }),
    )

    const nodeConfigurations = flatMap(plans, (plan) => get(plan, [`cluster_topology`], []))

    return nodeConfigurations.filter(Boolean)
  }

  getNodeConfigurationsFromTemplate() {
    const { editorState } = this.props
    const { deploymentTemplate } = editorState

    if (!deploymentTemplate) {
      return []
    }

    return getTopologiesFromTemplate({ deploymentTemplate: deploymentTemplate.deployment_template })
  }

  resetNodeToTrial = ({ nodeConfiguration, topologyElementProp }) => {
    const { editorState, onChange } = this.props
    const { deploymentTemplate } = editorState

    if (!deploymentTemplate) {
      return
    }

    const instanceConfiguration = find(
      deploymentTemplate.instance_configurations,
      ({ id }) => id === nodeConfiguration.instance_configuration_id,
    )

    const plan = getSliderPlan({
      sliderInstanceType: instanceConfiguration!.instance_type,
      deployment: editorState.deployment,
    })

    const configs = (plan && plan.cluster_topology) || []

    const config = find<AnyTopologyElement>(
      configs,
      ({ instance_configuration_id }) =>
        instance_configuration_id === nodeConfiguration.instance_configuration_id,
    )

    const defaultConfig = this.getOriginalInstanceConfiguration({
      nodeConfiguration,
      instanceType: instanceConfiguration?.instance_type,
    })

    if (config === undefined) {
      return
    }

    if (topologyElementProp === `zone_count`) {
      const defaultZoneCountInNodeConfiguration = get(defaultConfig, [`zone_count`], 0)
      const value = Math.max(defaultZoneCountInNodeConfiguration, 1)
      onChange(config, [topologyElementProp], value)
    }

    if (topologyElementProp === `size`) {
      const sizeValuePath = [`size`, `value`]
      onChange(config, sizeValuePath, get(defaultConfig, sizeValuePath))
    }
  }

  getOriginalInstanceConfiguration({ nodeConfiguration, instanceType }) {
    const { editorState } = this.props
    const { deploymentUnderEdit } = editorState
    const originalPlan = getSliderPlanFromGet<ElasticsearchClusterPlan>({
      sliderInstanceType: instanceType,
      deployment: deploymentUnderEdit,
    })

    const defaultConfig = find(
      originalPlan!.cluster_topology,
      ({ instance_configuration_id }) =>
        instance_configuration_id === nodeConfiguration.instance_configuration_id,
    )
    return defaultConfig
  }

  onPluginsChange = ({ plugins, path = [`elasticsearch`, `enabled_built_in_plugins`] }) => {
    const { onChange } = this.props
    const plan = this.getPlan()

    if (!plan) {
      return
    }

    for (const nodeConfiguration of plan.cluster_topology) {
      onChange(nodeConfiguration, path, plugins)
    }
  }

  onChangeAutoscaling = (deployment) => {
    const { replaceEsPlan } = this.props

    replaceEsPlan({
      plan: deployment.resources.elasticsearch[0].plan,
      settings: deployment.resources.elasticsearch[0].settings,
    })
  }

  getVersion = (): string => {
    const { editorState } = this.props
    const { deploymentUnderEdit } = editorState
    const version = getVersion({ deployment: deploymentUnderEdit })!
    return version
  }

  getVersionConfig = () => {
    const {
      editorState: { deployment },
      esVersions,
    } = this.props

    const plan = getEsPlan({ deployment })
    const version = this.getVersion()

    if (!plan || !esVersions || !version) {
      return undefined
    }

    const currentVersionConfig = esVersions.find(
      (versionConfig) => versionConfig.version === version,
    )

    return currentVersionConfig
  }

  getStrategy = (): PlanStrategy => {
    const plan = this.getPlan()

    if (!plan || !plan.transient) {
      return defaultStrategy
    }

    return plan.transient.strategy || defaultStrategy
  }

  setStrategy = (strategy: PlanStrategy) => {
    const { onStrategyChange } = this.props
    onStrategyChange(strategy)
  }

  isEditableConfiguration = (nodeConfiguration) => {
    const { isHeroku } = this.props
    return !isHeroku || isEnabledConfiguration(nodeConfiguration)
  }

  getDeploymentUrl = () => {
    const { editorState } = this.props
    const { id } = editorState
    return deploymentUrl(id)
  }

  getUpdatePayload = () => {
    const { editorState } = this.props
    const { deployment } = editorState
    return sanitizeUpdateRequestBeforeSend({ deployment })
  }

  saveChanges() {
    const { editorState, updateDeployment } = this.props
    const { regionId, id } = editorState
    const updatePayload = this.getUpdatePayload()

    updateDeployment({
      regionId,
      deploymentId: id,
      deployment: updatePayload,
    })
  }
}

export default injectIntl(EditDeploymentFromTemplate)
