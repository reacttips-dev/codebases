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

import React, { Component, Fragment, ReactNode } from 'react'
import { find, isEmpty, size } from 'lodash'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiRadio,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import IndexCurationSettings from '../../Topology/IndexCuration/IndexCurationSettings'
import IndexCurationErrors from '../../Topology/DeploymentTemplates/components/Editor/IndexCurationErrors'
import IlmSummary from '../../Topology/DeploymentTemplates/DeploymentTemplateView/components/IlmSummary'

import DocLink from '../../DocLink'

import { getInstancesWithoutNodeAttributes } from '../../../lib/ilm'
import { satisfies } from '../../../lib/semver'

import { markShallow, replaceIn } from '../../../lib/immutability-helpers'

import {
  hasNodeType,
  getEsSettingsFromTemplate,
  getFirstEsResourceFromTemplate,
} from '../../../lib/stackDeployments/selectors'
import { getTopologiesFromTemplate } from '../../../lib/deploymentTemplates/getTopologiesFromTemplate'

import { getCurationFields as getCurationFieldsFromTemplate } from '../../../lib/curation'

import {
  changeEsAt,
  getCurationFields,
  getDeploymentSettings,
  getEsNodeConfigurations,
  getEsPlan,
  getFirstEsCluster,
  getUpsertVersion,
  isData,
  setEsSettings,
  validateIndexCuration,
} from '../../../lib/stackDeployments'

import { StackDeploymentUpsertRequest, NodeAttributes, AsyncRequestState } from '../../../types'
import { DeepPartial } from '../../../lib/ts-essentials'

import {
  ElasticsearchClusterTopologyElement,
  ElasticsearchClusterSettings,
  ClusterCurationSpec,
  InstanceConfiguration,
} from '../../../lib/api/v1/types'

import './configureIndexManagement.scss'
import { isEnabledConfiguration } from '../../../lib/deployments/conversion'

export type Props = {
  editorState: StackDeploymentUpsertRequest
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
  curationConfigurationOptions: Array<{ id: string; name: string }>
  readOnlyIndexCurationTargets: boolean
  bottomNavigationButtons: ReactNode
  createDeploymentRequest: AsyncRequestState
  canBeSkipped: boolean
  skippedCuration: boolean
  onSkip: () => void
  onSkipCancel: () => void
  ilmFeature: boolean
  ucIlmBetaBadge: boolean
  instanceConfigurations: InstanceConfiguration[]
}

type SkippedIlmAttributes = {
  id: string
  nodeAttributes: NodeAttributes
}

type State = {
  skipIndexCuration: boolean
  skippedIndexCurationSettings: null | {
    hotInstanceConfigurationId: string
    warmInstanceConfigurationId: string
    indexPatterns: ClusterCurationSpec[]
  }
  ilmChecked: boolean
  indexCurationChecked: boolean
  skipIlm: boolean
  skippedIlmSettings: null | SkippedIlmAttributes[]
}

class ConfigureIndexManagement extends Component<WrappedComponentProps & Props, State> {
  state: State = {
    skipIndexCuration: false,
    skippedIndexCurationSettings: null,
    ilmChecked: false,
    indexCurationChecked: true,
    skipIlm: true,
    skippedIlmSettings: null,
  }

  componentDidMount() {
    const { ilmFeature, editorState } = this.props
    const { deploymentTemplate } = editorState

    const dataNodes = this.getDataNodes()
    const nodeAttributesExist = this.doNodeAttributesExist(dataNodes)
    const version = getUpsertVersion(editorState)
    const versionIlmCompatible = satisfies(version!, `>=6.7`)
    const showIlm = ilmFeature && nodeAttributesExist && versionIlmCompatible

    // Remove index curation settings and set ILM since ILM is default selection
    if (showIlm) {
      this.selectIlm()
    } else {
      const { onChange } = this.props
      const nodeConfigurations = getInstancesWithoutNodeAttributes(deploymentTemplate)

      // only update necessary instances
      changeEsAt({
        onChange,
        path: [`plan`, `cluster_topology`],
        value: nodeConfigurations,
      })
    }
  }

  render() {
    const {
      editorState,
      curationConfigurationOptions,
      readOnlyIndexCurationTargets,
      createDeploymentRequest,
      canBeSkipped,
      skippedCuration,
      ilmFeature,
      instanceConfigurations,
      bottomNavigationButtons,
    } = this.props
    const { skippedIndexCurationSettings } = this.state
    const { deployment, deploymentTemplate } = editorState

    const fields = getCurationFields({ deployment })!
    const settings = getEsSettingsFromTemplate({
      deploymentTemplate: deploymentTemplate?.deployment_template,
    })
    const { indexPatterns: templateIndexPatterns } = getCurationFieldsFromTemplate({
      deploymentTemplate: deploymentTemplate!,
      settings: settings!,
    })

    const { hotInstanceConfigurationId, warmInstanceConfigurationId, indexPatterns } = fields
    const errors = validateIndexCuration(fields)

    const dataNodes = this.getDataNodes()
    const nodeAttributesExist = this.doNodeAttributesExist(dataNodes)

    const version = getUpsertVersion(editorState)
    const versionIlmCompatible = satisfies(version!, `>=6.7`)
    const showIlm = ilmFeature && nodeAttributesExist && versionIlmCompatible
    const showCuration =
      (skippedIndexCurationSettings && size(skippedIndexCurationSettings.indexPatterns) > 0) ||
      size(templateIndexPatterns) > 0 ||
      !showIlm

    const ilmTitle = (
      <FormattedMessage
        id='deployment-create-ilm.title'
        defaultMessage='Index Lifecycle Management (ILM)'
      />
    )

    return (
      <div>
        <EuiTitle>
          <h4 data-test-id='index-management-title'>
            <FormattedMessage
              id='deployment-create-index-management.title'
              defaultMessage='Index Management'
            />
          </h4>
        </EuiTitle>
        {showIlm && showCuration ? (
          <EuiText>
            <p>
              <FormattedMessage
                id='deployment-create-index-management.description-two-methods'
                defaultMessage='Automate how indices get managed over time by configuring one of the supported index management methods. {learnMore}'
                values={{
                  learnMore: (
                    <DocLink link='indexManagementDocLink'>
                      <FormattedMessage
                        id='deployment-create-index-management.learn-more'
                        defaultMessage='Learn more'
                      />
                    </DocLink>
                  ),
                }}
              />
            </p>
          </EuiText>
        ) : (
          <EuiText>
            <p>
              <FormattedMessage
                id='deployment-create-index-management.description-one-method'
                defaultMessage='Automate how indices get managed over time.'
              />
            </p>
          </EuiText>
        )}

        <EuiSpacer size='xl' />

        {showIlm && (
          <Fragment>
            <EuiFlexGroup>
              <EuiFlexItem grow={false}>
                <EuiRadio
                  id='selectIlm'
                  checked={this.state.ilmChecked}
                  onChange={() => this.selectIlm()}
                  className='configureIndexManagement-radio'
                />
              </EuiFlexItem>
              <EuiFlexItem data-test-id='configure-index-management-ilm'>
                <IlmSummary
                  instanceConfigurations={instanceConfigurations}
                  title={ilmTitle}
                  data={dataNodes}
                  ilmEnabled={this.state.ilmChecked}
                  showPreCreationHelp={true}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule />
          </Fragment>
        )}

        <EuiFlexGroup>
          {showIlm && showCuration && (
            <EuiFlexItem grow={false}>
              <EuiRadio
                id='selectCuration'
                checked={this.state.indexCurationChecked}
                onChange={() => this.selectIndexCuration()}
                className='configureIndexManagement-radio'
              />
            </EuiFlexItem>
          )}
          {showCuration && (
            <EuiFlexItem>
              <IndexCurationSettings
                indexPatterns={indexPatterns}
                setIndexPatterns={this.setIndexPatterns}
                curationConfigurationOptions={curationConfigurationOptions}
                hotInstanceConfigurationId={hotInstanceConfigurationId}
                warmInstanceConfigurationId={warmInstanceConfigurationId}
                setHotInstanceConfiguration={this.setHotInstanceConfiguration}
                setWarmInstanceConfiguration={this.setWarmInstanceConfiguration}
                readOnlyIndexCurationTargets={readOnlyIndexCurationTargets}
                canBeSkipped={canBeSkipped}
                skipIndexCuration={this.state.skipIndexCuration}
                indexCurationEnabled={this.state.indexCurationChecked}
                onSkip={this.removeIndexCurationSettings}
                titleSize='xs'
                templateMode={false}
              />

              {!skippedCuration && (
                <Fragment>
                  <IndexCurationErrors errors={errors} />
                </Fragment>
              )}
            </EuiFlexItem>
          )}
        </EuiFlexGroup>

        {createDeploymentRequest && createDeploymentRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{createDeploymentRequest.error}</CuiAlert>
          </Fragment>
        )}

        <EuiSpacer size='m' />

        {bottomNavigationButtons}
      </div>
    )
  }

  setDefaultIndexPatternsIfNoneExist = () => {
    const { editorState } = this.props
    const { deployment, deploymentTemplate } = editorState

    const deploymentSettings = getDeploymentSettings({ deployment }) || {}
    const noIndexPatterns = !deploymentSettings.curation?.specs.length

    if (noIndexPatterns) {
      const settings = getEsSettingsFromTemplate({
        deploymentTemplate: deploymentTemplate?.deployment_template,
      })
      const { indexPatterns } = getCurationFieldsFromTemplate({
        deploymentTemplate: deploymentTemplate!,
        settings: settings!,
      })

      this.setEsSettings(replaceIn(deploymentSettings || {}, [`curation`, `specs`], indexPatterns))
    }
  }

  setIndexPatterns = (newIndexPatterns: ClusterCurationSpec[]) => {
    const { editorState } = this.props
    const { deployment } = editorState
    const deploymentSettings = getDeploymentSettings({ deployment }) || {}

    this.setEsSettings(
      replaceIn(deploymentSettings, [`curation`, `specs`], markShallow(newIndexPatterns)),
    )
  }

  setEsSettings = (changes: DeepPartial<ElasticsearchClusterSettings>) => {
    const { onChange } = this.props
    setEsSettings({ onChange, settings: changes })
  }

  setHotInstanceConfiguration = (hotId: string) => {
    const { onChange } = this.props

    changeEsAt({
      onChange,
      path: [`plan`, `elasticsearch`, `curation`, `from_instance_configuration_id`],
      value: hotId,
    })
  }

  setWarmInstanceConfiguration = (warmId: string) => {
    const { onChange } = this.props

    changeEsAt({
      onChange,
      path: [`plan`, `elasticsearch`, `curation`, `to_instance_configuration_id`],
      value: warmId,
    })
  }

  // Removes the Index curation settings from the pending deployment and saves them
  // in state
  removeIndexCurationSettings = () => {
    const { onSkip, onChange, editorState } = this.props
    const { skipIndexCuration } = this.state
    const { deployment } = editorState

    // User may have already skipped index curation. If so, we don't need to
    // remove the index curation settings. Doing so unnecessarily would
    // overwrite the already skipped settings to be undefined
    if (skipIndexCuration) {
      return
    }

    const fields = getCurationFields({ deployment })!
    const { hotInstanceConfigurationId, warmInstanceConfigurationId, indexPatterns } = fields

    this.setState({
      skipIndexCuration: true,
      skippedIndexCurationSettings: {
        hotInstanceConfigurationId,
        warmInstanceConfigurationId,
        indexPatterns,
      },
    })

    changeEsAt({
      onChange,
      path: [`plan`, `elasticsearch`, `curation`],
      value: {
        from_instance_configuration_id: undefined,
        to_instance_configuration_id: undefined,
      },
    })

    this.setIndexPatterns([])

    onSkip()
  }

  // Gets the Index Curation settings that were "skipped" because
  // ILM was selected. The "skipped" settings are saved in state
  setIndexCurationSettings = () => {
    const { onSkipCancel, onChange } = this.props
    const { skippedIndexCurationSettings } = this.state

    this.setDefaultIndexPatternsIfNoneExist()

    if (skippedIndexCurationSettings == null) {
      return Promise.resolve()
    }

    const { hotInstanceConfigurationId, warmInstanceConfigurationId, indexPatterns } =
      skippedIndexCurationSettings

    onSkipCancel()

    changeEsAt({
      onChange,
      path: [`plan`, `elasticsearch`, `curation`],
      value: {
        from_instance_configuration_id: hotInstanceConfigurationId,
        to_instance_configuration_id: warmInstanceConfigurationId,
      },
    })

    this.setIndexPatterns(indexPatterns)

    this.setState({
      skipIndexCuration: false,
      skippedIndexCurationSettings: null,
    })
    return Promise.resolve()
  }

  // Once ILM is selected, the ILM settings need to be retrieved from state
  // and any index curation settings must be removed from the pending deployment
  selectIlm() {
    this.setState({ ilmChecked: true, indexCurationChecked: false })
    return this.setIlmSettings().then(() => this.removeIndexCurationSettings())
  }

  // Once index curation is selected, the index curation settings need to be retrieved from state
  // and any ILM settings must be removed from the pending deployment
  selectIndexCuration() {
    this.setState({ indexCurationChecked: true, ilmChecked: false })
    return this.setIndexCurationSettings().then(() => this.removeIlmSettings())
  }

  // Gets the ILM settings that were removed from deployment
  setIlmSettings() {
    const { onChange, editorState } = this.props
    const { skippedIlmSettings } = this.state
    const { deployment, deploymentTemplate } = editorState

    const esPlan = getEsPlan({ deployment })!
    const nodeConfigurations = esPlan.cluster_topology

    const baseNodeConfigurations = deploymentTemplate
      ? getTopologiesFromTemplate({
          deploymentTemplate: deploymentTemplate?.deployment_template,
          sliderInstanceType: `elasticsearch`,
        })
      : []

    // If no skippedIlmSettings exist in state, we need to get them
    // from the template
    if (skippedIlmSettings == null) {
      const nextNodeConfigurations = nodeConfigurations.map((nodeConfiguration) => {
        if (!hasNodeType(nodeConfiguration, `data`)) {
          return nodeConfiguration
        }

        const { instance_configuration_id } = nodeConfiguration

        const baseNodeConfiguration = find(baseNodeConfigurations, { instance_configuration_id })

        if (baseNodeConfiguration && baseNodeConfiguration.elasticsearch) {
          if (!nodeConfiguration.elasticsearch) {
            nodeConfiguration.elasticsearch = {}
          }

          nodeConfiguration.elasticsearch.node_attributes =
            baseNodeConfiguration.elasticsearch.node_attributes
        }

        return nodeConfiguration
      })

      changeEsAt({
        onChange,
        path: [`plan`, `cluster_topology`],
        value: nextNodeConfigurations,
      })

      this.setState({
        skipIlm: false,
        skippedIlmSettings: null,
      })
      return Promise.resolve()
    }

    // Get the node_attributes that were "skipped" from state
    const instancesWithNodeAttributes = nodeConfigurations.map((nodeConfiguration) => {
      const { instance_configuration_id } = nodeConfiguration

      if (!hasNodeType(nodeConfiguration, `data`)) {
        return nodeConfiguration
      }

      const skippedSettings = find(skippedIlmSettings, { id: instance_configuration_id })

      if (skippedSettings) {
        if (!nodeConfiguration.elasticsearch) {
          nodeConfiguration.elasticsearch = {}
        }

        nodeConfiguration.elasticsearch.node_attributes = skippedSettings.nodeAttributes
      }

      return nodeConfiguration
    })

    changeEsAt({
      onChange,
      path: [`plan`, `cluster_topology`],
      value: instancesWithNodeAttributes,
    })

    this.setState({
      skipIlm: false,
      skippedIlmSettings: null,
    })

    return Promise.resolve()
  }

  // Removes the ILM settings from the pending deployment and saves them
  // in state
  removeIlmSettings() {
    const { onChange, editorState } = this.props
    const { deployment } = editorState

    const nodeConfigurations = getEsNodeConfigurations({
      deployment,
      onlySized: false,
    })

    const dataNodeConfigurations = nodeConfigurations.filter((instance) =>
      hasNodeType(instance, `data`),
    )

    const skippedIlmSettings: SkippedIlmAttributes[] = dataNodeConfigurations
      .filter((data) => data.elasticsearch && !isEmpty(data.elasticsearch.node_attributes))
      .map((data) => ({
        id: data.instance_configuration_id!,
        nodeAttributes: data.elasticsearch!.node_attributes as NodeAttributes,
      }))

    this.setState({
      skipIlm: true,
      skippedIlmSettings,
    })

    const updatedNodeConfigurations = nodeConfigurations.map((nodeConfiguration) => {
      if (nodeConfiguration.elasticsearch && hasNodeType(nodeConfiguration, `data`)) {
        return replaceIn(nodeConfiguration, [`elasticsearch`, `node_attributes`], {})
      }

      return nodeConfiguration
    })

    changeEsAt({
      onChange,
      path: [`plan`, `cluster_topology`],
      value: markShallow(updatedNodeConfigurations),
    })
  }

  getDataNodes(): ElasticsearchClusterTopologyElement[] {
    const { deployment, deploymentTemplate } = this.props.editorState

    if (deployment == null || deploymentTemplate == null) {
      return []
    }

    const esResource = getFirstEsCluster({
      deployment,
    })
    const topologyElements = esResource?.plan.cluster_topology || []

    const templateEsResource = getFirstEsResourceFromTemplate({
      deploymentTemplate: deploymentTemplate.deployment_template,
    })

    const templateTopologyElements = templateEsResource?.plan.cluster_topology || []

    // return the template's data topology elements, but filtered to only those
    // enabled on the deployment
    return templateTopologyElements
      .filter((templateTopologyElement) => isData({ topologyElement: templateTopologyElement }))
      .filter(({ id: templateTopologyElementId }) => {
        const matchingTopologyElement = topologyElements.find(
          ({ id }) => id && id === templateTopologyElementId,
        )

        if (matchingTopologyElement) {
          return isEnabledConfiguration(matchingTopologyElement)
        }

        return true // err on the side of inclusion if there are no id matches
      })
  }

  doNodeAttributesExist(data: ElasticsearchClusterTopologyElement[]) {
    const { skippedIlmSettings } = this.state

    if (skippedIlmSettings !== null) {
      return true
    }

    return data.some((node) => {
      if (!node.elasticsearch) {
        return
      }

      return (
        node.elasticsearch.node_attributes !== undefined &&
        !isEmpty(node.elasticsearch.node_attributes)
      )
    })
  }
}

export default injectIntl(ConfigureIndexManagement)
