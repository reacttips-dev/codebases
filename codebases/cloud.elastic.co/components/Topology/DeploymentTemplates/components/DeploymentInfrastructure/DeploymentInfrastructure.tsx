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
import { cloneDeep, remove, sortBy } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiTitle, EuiSpacer, EuiLink } from '@elastic/eui'

import { CuiSliderLogo } from '../../../../../cui'
import {
  getSupportedSliderInstanceTypes,
  getSliderPrettyName,
  getSliderWeight,
} from '../../../../../lib/sliders'

import { getInstanceConfigurationById } from '../../../../../lib/instanceConfigurations/instanceConfiguration'
import {
  getPlugins,
  getEsPlan,
  getSliderNodeTypeForTopologyElement,
  supportsFrozenTier,
  supportsNodeRoles,
  isCold,
  isFrozen,
  getDedicatedMasterThresholdFromTemplate,
  isAutoscalingEnabled,
  isSliderSupportedForDeployment,
  isSliderSupportedForNewDeployment,
} from '../../../../../lib/stackDeployments'
import { getTopologiesFromTemplate } from '../../../../../lib/deploymentTemplates/getTopologiesFromTemplate'
import { getCustomPluginsFromPlan } from '../../../../../lib/plugins'
import { isEnabledConfiguration } from '../../../../../lib/deployments/conversion'
import { getConfigForKey } from '../../../../../store'
import { lt } from '../../../../../lib/semver'

import TopologyElement from './TopologyElement'
import ElasticsearchFlyout from './ElasticsearchFlyout'
import Plugins from './Plugins'
import Extensions from './Extensions'
import Settings from './Settings'

import { AnyTopologyElement, SliderInstanceType } from '../../../../../types'
import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  StackVersionConfig,
  ElasticsearchUserPlugin,
  ElasticsearchUserBundle,
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
  DeploymentGetResponse,
} from '../../../../../lib/api/v1/types'

import './deploymentInfrastructure.scss'

export interface Props {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  deploymentUnderEdit?: DeploymentGetResponse
  // The ECE security cluster carries a reference to a deployment template that
  // is not accessible to the client. Regardless, we still need the instance
  // configurations, so the consumer can alternatively supply only the
  // instance_configurations (sourced via some other avenue than the deployment
  // template) as a subset of the DeploymentTemplateInfoV2 shape.
  templateInfo:
    | DeploymentTemplateInfoV2
    | (Pick<DeploymentTemplateInfoV2, 'instance_configurations'> & {
        deployment_template: undefined
      })
  versionConfig: StackVersionConfig | undefined
  onChange: (topologyElement: AnyTopologyElement) => (path: string[], value: any) => void
  onPluginsChange: (options: {
    plugins: string[] | Array<ElasticsearchUserPlugin | ElasticsearchUserBundle>
    path?: string[]
    userInitiated?: boolean
  }) => void
  onScriptingChange: (
    scriptingType: 'inline' | 'stored' | 'file',
    value: boolean | 'on' | 'off' | 'sandbox',
  ) => void
  onlyShowPricingFactors?: boolean
  showTrialThreshold?: boolean
  isHeroku: boolean
  showUserSettings: boolean
}

interface State {
  showFlyout: null | 'elasticsearch' | 'slider'
}

export default class DeploymentInfrastructure extends Component<Props, State> {
  state = {
    showFlyout: null,
  }

  render(): JSX.Element {
    return (
      <Fragment>
        {this.renderResources()}
        {this.renderElasticsearchFlyout()}
      </Fragment>
    )
  }

  renderResources(): JSX.Element {
    const { versionConfig, onlyShowPricingFactors } = this.props

    const sliderInstanceTypes = getSupportedSliderInstanceTypes().filter(
      (sliderInstanceType) => this.getSliderNodeConfigurations(sliderInstanceType)?.length,
    )

    return (
      <Fragment>
        {sliderInstanceTypes.map((sliderInstanceType) => (
          <div
            key={sliderInstanceType}
            data-test-id={`type-${sliderInstanceType === `elasticsearch` ? `es` : `slider`}`}
            data-id={sliderInstanceType}
          >
            <EuiFlexGroup gutterSize='m' alignItems='center' wrap={true} responsive={false}>
              <EuiFlexItem grow={false}>
                <CuiSliderLogo
                  sliderInstanceType={sliderInstanceType}
                  version={versionConfig?.version}
                  size='l'
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiTitle size='s'>
                  <div>
                    <FormattedMessage
                      {...getSliderPrettyName({
                        sliderInstanceType,
                        version: versionConfig?.version,
                      })}
                    />
                  </div>
                </EuiTitle>
              </EuiFlexItem>
              {!onlyShowPricingFactors && (
                <Fragment>
                  <EuiFlexItem grow={true} />
                  <EuiFlexItem grow={false}>
                    {this.renderFlyoutButton({ sliderInstanceType })}
                  </EuiFlexItem>
                </Fragment>
              )}
            </EuiFlexGroup>
            <EuiSpacer size='m' />
            {this.renderTopologyElements(sliderInstanceType)}
          </div>
        ))}
      </Fragment>
    )
  }

  renderFlyoutButton({
    sliderInstanceType,
  }: {
    sliderInstanceType: SliderInstanceType
  }): JSX.Element | null {
    if (sliderInstanceType === `elasticsearch`) {
      const { deployment } = this.props
      const plan = getEsPlan({ deployment })

      const pluginCount = getPlugins({ deployment }).length
      const extensionCount = plan ? getCustomPluginsFromPlan(plan).length : 0
      const totalCount = pluginCount + extensionCount

      return (
        <EuiLink
          data-test-subj='deploymentInfrastructure-elasticsearchFlyoutButton'
          onClick={() => this.setState({ showFlyout: `elasticsearch` })}
        >
          <FormattedMessage
            id='deploymentInfrastructure-elasticsearchFlyoutButton'
            defaultMessage='Edit user settings and plugins ({totalCount})'
            values={{ totalCount }}
          />
        </EuiLink>
      )
    }

    return null
  }

  renderTopologyElements(sliderInstanceType: SliderInstanceType): JSX.Element[] {
    const {
      deployment,
      deploymentUnderEdit,
      templateInfo,
      onChange,
      onlyShowPricingFactors,
      showTrialThreshold,
      showUserSettings,
    } = this.props

    const dedicatedMasterThreshold =
      templateInfo.deployment_template &&
      getDedicatedMasterThresholdFromTemplate({
        deploymentTemplate: templateInfo.deployment_template,
      })

    const topologyElements = this.getSliderNodeConfigurations(sliderInstanceType)

    return topologyElements.map(({ topologyElement, templateTopologyElement }, i) => {
      const key = `${sliderInstanceType}-${i}`

      const instanceConfiguration = getInstanceConfigurationById(
        templateInfo.instance_configurations,
        topologyElement.instance_configuration_id!,
      )!

      return (
        <TopologyElement
          key={key}
          id={key}
          showUserSettings={showUserSettings}
          deployment={deployment}
          deploymentUnderEdit={deploymentUnderEdit}
          sliderInstanceType={sliderInstanceType}
          topologyElement={topologyElement}
          templateTopologyElement={templateTopologyElement}
          instanceConfiguration={instanceConfiguration}
          onChange={(path, value) => onChange(topologyElement)(path, value)}
          onlyShowPricingFactors={Boolean(onlyShowPricingFactors)}
          showTrialThreshold={Boolean(showTrialThreshold)}
          isAutoscalingEnabled={isAutoscalingEnabled({ deployment })}
          dedicatedMasterThreshold={dedicatedMasterThreshold}
        />
      )
    })
  }

  renderElasticsearchFlyout(): JSX.Element | null {
    if (this.props.onlyShowPricingFactors) {
      return null
    }

    if (this.state.showFlyout !== `elasticsearch`) {
      return null
    }

    const { deployment, versionConfig, onChange, onPluginsChange, onScriptingChange } = this.props

    if (!versionConfig) {
      return null
    }

    const title = (
      <FormattedMessage
        id='deploymentInfrastructure-pluginsSettingsLink'
        defaultMessage='Elasticsearch plugins and settings'
      />
    )

    const tabs = [
      {
        id: `plugins`,
        name: (
          <FormattedMessage id='deploymentInfrastructure-plugins-title' defaultMessage='Plugins' />
        ),
      },
    ]

    const plan = getEsPlan({ deployment })!
    const { version } = plan.elasticsearch

    // v6+ scripting is not configurable via the UI
    if (version != null && lt(version, `6.0.0`)) {
      tabs.push({
        id: `settings`,
        name: (
          <FormattedMessage
            id='deploymentInfrastructure-settings-title'
            defaultMessage='Settings'
          />
        ),
      })
    }

    return (
      <ElasticsearchFlyout
        title={title}
        tabs={tabs}
        onClose={() => this.setState({ showFlyout: null })}
      >
        {(activeTabId) => {
          switch (activeTabId) {
            case `plugins`:
              return (
                <Fragment>
                  {getConfigForKey(`APP_NAME`) === `userconsole` && (
                    <Extensions deployment={deployment} onPluginsChange={onPluginsChange} />
                  )}
                  <Plugins
                    deployment={deployment}
                    versionConfig={versionConfig}
                    onPluginsChange={onPluginsChange}
                  />
                </Fragment>
              )
            case `settings`:
              return (
                <Settings
                  deployment={deployment}
                  onScriptingChange={onScriptingChange}
                  onChange={(topologyElement: AnyTopologyElement, path: string[], value: any) =>
                    onChange(topologyElement)(path, value)
                  }
                />
              )
            default:
              return null
          }
        }}
      </ElasticsearchFlyout>
    )
  }

  getSliderNodeConfigurations = (
    sliderInstanceType: SliderInstanceType,
  ): Array<{
    topologyElement: AnyTopologyElement
    templateTopologyElement?: AnyTopologyElement
  }> => {
    const { deployment, deploymentUnderEdit, templateInfo, versionConfig, isHeroku } = this.props

    // filter out unsupported sliderInstanceTypes
    if (!isSupported()) {
      return []
    }

    const templateTopologyElements = templateInfo.deployment_template
      ? getTopologiesFromTemplate({
          deploymentTemplate: templateInfo.deployment_template,
          sliderInstanceType,
        })
      : []

    // pair the deployment's topologies with the template's
    const topologyElements = getTopologiesFromTemplate({
      deploymentTemplate: deployment,
      sliderInstanceType,
    }).map((topologyElement) => {
      const templateTopologyElement = cloneDeep(
        templateTopologyElements.find(({ id }) => id && id === topologyElement.id),
      )

      // remove unsupported data_roles property from pre-node_roles versions
      if (
        templateTopologyElement &&
        sliderInstanceType === `elasticsearch` &&
        !supportsNodeRoles({ version: versionConfig?.version })
      ) {
        delete (templateTopologyElement as ElasticsearchClusterTopologyElement).node_roles
      }

      return { topologyElement, templateTopologyElement }
    })

    // remove non-applicable stuff from heroku
    if (isHeroku) {
      remove(topologyElements, ({ topologyElement }) => {
        // show anything that's already on (in practice, the hot/content tier,
        // and dedicated masters if the threshold is met)
        if (isEnabledConfiguration(topologyElement)) {
          return false
        }

        // and show kibana so they can *turn* it on
        if (sliderInstanceType === `kibana`) {
          return false
        }

        // but that's it
        return true
      })
    }

    // remove unsupported properties from pre-node_roles versions...
    if (
      sliderInstanceType === `elasticsearch` &&
      !supportsNodeRoles({ version: versionConfig?.version })
    ) {
      // cold and frozen tiers
      remove(topologyElements, ({ topologyElement }) => isCold({ topologyElement }))
      remove(topologyElements, ({ topologyElement }) => isFrozen({ topologyElement }))

      // the node_roles property
      topologyElements.forEach(({ templateTopologyElement }) => {
        if (templateTopologyElement) {
          delete (templateTopologyElement as ElasticsearchClusterTopologyElement).node_roles
        }
      })
    }

    // remove frozen tier from < 7.12
    if (!supportsFrozenTier({ version: versionConfig?.version })) {
      remove(topologyElements, ({ topologyElement }) => isFrozen({ topologyElement }))
    }

    return sortBy(topologyElements, ({ topologyElement }) => {
      const sliderNodeType = getSliderNodeTypeForTopologyElement({
        topologyElement,
      })

      return getSliderWeight(sliderInstanceType, sliderNodeType)
    })

    function isSupported() {
      if (deploymentUnderEdit) {
        return isSliderSupportedForDeployment({
          deployment: deploymentUnderEdit,
          deploymentTemplate: templateInfo.deployment_template,
          sliderInstanceType,
        })
      }

      if (!versionConfig?.version) {
        return false
      }

      return isSliderSupportedForNewDeployment({
        version: versionConfig.version,
        deploymentTemplate: templateInfo.deployment_template,
        sliderInstanceType,
      })
    }
  }
}
