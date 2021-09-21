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

import { get, set } from 'lodash'
import React, { Component, ComponentType } from 'react'

import { withErrorBoundary } from '../../../cui'

import EditDeploymentFromTemplate from './EditDeploymentFromTemplate'

import EditClusterForm, { Props as EditClusterFormProps } from './EditClusterForm'

import { findDefaultPlanForVersion } from '../../../lib/deployments/plan'

import {
  ensureDedicatedCoordinatingAwareTopology,
  ensureDedicatedMasterAwareTopology,
  getEsPlan,
  getEsPlanFromGet,
  getFirstEsCluster,
  getFirstSliderCluster,
  getSliderPlan,
  getVersion,
} from '../../../lib/stackDeployments'

import { getSupportedSliderInstanceTypes } from '../../../lib/sliders'

import { replaceIn } from '../../../lib/immutability-helpers'

import { getConfigForKey } from '../../../store'

import { EditEditorComponentConsumerProps } from '../types'
import { SliderInstanceType, AnyTopologyElement } from '../../../types'
import {
  ElasticsearchClusterPlan,
  ElasticsearchClusterSettings,
  InstanceConfiguration,
} from '../../../lib/api/v1/types'

export type Props = EditClusterFormProps &
  EditEditorComponentConsumerProps & {
    canSafelyUseNewEditor: boolean
    hideConfigChangeStrategy: boolean
    regionId: string
    architectureSummary?: ComponentType<any>
    instanceConfigurations: InstanceConfiguration[]
  }

class ClusterEditor extends Component<Props> {
  render() {
    const { canSafelyUseNewEditor, ...props } = this.props
    const isUserconsole = getConfigForKey(`APP_NAME`) === `userconsole`

    const updateHelpers = {
      onStateChange: this.props.onChange,
      onChange: this.onChange,
      onEsPlanChange: this.onEsPlanChange,
      onScriptingChange: this.onScriptingChange,
      onStrategyChange: this.onStrategyChange,
      onWidePlanChange: this.onWidePlanChange,
      replaceEsPlan: this.replaceEsPlan,
      invalidateDerivedSettings: this.invalidateDerivedSettingsAndCommit,
    }

    const userconsoleProps = isUserconsole
      ? {
          showInstanceCount: false,
          showMasterOnlyNodes: false,
        }
      : {}

    if (canSafelyUseNewEditor) {
      return <EditDeploymentFromTemplate {...props} {...userconsoleProps} {...updateHelpers} />
    }

    return <EditClusterForm {...props} {...userconsoleProps} {...updateHelpers} />
  }

  getPlan = (props: Props = this.props) => {
    const { editorState } = props
    const { deployment } = editorState
    const esPlan = getEsPlan({ deployment })
    return esPlan
  }

  getVersion = (): string => {
    const { editorState } = this.props
    const { deploymentUnderEdit } = editorState
    const version = getVersion({ deployment: deploymentUnderEdit })!
    return version
  }

  onScriptingChange = (
    scriptingType: 'inline' | 'stored' | 'file',
    value: boolean | 'on' | 'off' | 'sandbox',
  ) => {
    const scriptingPath = [`elasticsearch`, `system_settings`, `scripting`]
    const plan = this.getPlan()!
    const version = this.getVersion()

    for (const nodeConfiguration of plan.cluster_topology) {
      if (get(nodeConfiguration, scriptingPath) == null) {
        const defaultPlanForVersion = findDefaultPlanForVersion(version)

        this.onChange(nodeConfiguration, scriptingPath, get(defaultPlanForVersion, scriptingPath))
      }

      const scriptingValue =
        typeof value === `boolean`
          ? { enabled: value }
          : { enabled: value !== `off`, sandbox_mode: value === `sandbox` }

      this.onChange(nodeConfiguration, scriptingPath.concat(scriptingType), scriptingValue)
    }
  }

  replaceEsPlan = (changes: {
    plan: ElasticsearchClusterPlan
    settings: ElasticsearchClusterSettings
  }) => {
    const { editorState, onChange } = this.props
    const { deployment } = editorState
    const cluster = getFirstEsCluster({ deployment })!

    const { plan, settings } = changes

    set(cluster, [`plan`], plan)
    set(cluster, [`settings`], settings)

    this.invalidateDerivedSettings()

    onChange(
      {
        deployment: {
          ...deployment,
          resources: {
            ...deployment.resources,
            elasticsearch: [cluster],
          },
        },
      },
      {
        shallow: true,
      },
    )
  }

  onSliderChange = (
    sliderInstanceType: SliderInstanceType,
    path: Array<string | number>,
    value: any,
    settings?: { shallow?: boolean },
  ) => {
    const { editorState, onChange } = this.props
    const { deployment } = editorState
    const cluster = getFirstSliderCluster({ deployment, sliderInstanceType })

    set(cluster, path, value)

    this.invalidateDerivedSettings()

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

  onEsPlanChange = (path: string[], value: any, settings?: { shallow?: boolean }) =>
    this.onSliderChange(`elasticsearch`, [`plan`, ...path], value, settings)

  onWideChange = (path: string[], value: any) => {
    const { editorState, onChange } = this.props
    const { deployment } = editorState
    const { resources } = deployment

    getSupportedSliderInstanceTypes()
      .filter((sliderInstanceType) => resources![sliderInstanceType])
      .forEach((sliderInstanceType) => {
        for (const cluster of resources![sliderInstanceType]) {
          set(cluster, path, value)
        }
      })

    onChange({ deployment })
  }

  onWidePlanChange = (path: string[], value: any) => this.onWideChange([`plan`, ...path], value)

  onStrategyChange = (nextStrategy) => {
    this.onWidePlanChange([`transient`, `strategy`], nextStrategy)
  }

  onChange = (nodeConfiguration: AnyTopologyElement, path: string[], value: any) => {
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
          this.onSliderChange(
            sliderInstanceType,
            [`plan`, `cluster_topology`, index, ...path],
            value,
          )
        }
      }
    })
  }

  invalidateDerivedSettings = () => {
    const { region, instanceConfigurations, editorState } = this.props
    const { deployment, deploymentTemplate, deploymentUnderEdit } = editorState
    const { resources } = deployment

    const clusterPlanUnderEdit = getEsPlanFromGet({ deployment: deploymentUnderEdit })

    if (!resources || !resources.elasticsearch) {
      return
    }

    resources.elasticsearch = resources.elasticsearch.map((esCluster) =>
      replaceIn(
        esCluster,
        [`plan`, `cluster_topology`],
        ensureDedicatedCoordinatingAwareTopology({
          esCluster,
          deploymentTemplate: deploymentTemplate!,
        }),
      ),
    )

    resources.elasticsearch = resources.elasticsearch.map((esCluster) =>
      replaceIn(
        esCluster,
        [`plan`, `cluster_topology`],
        ensureDedicatedMasterAwareTopology({
          region,
          deploymentTemplate,
          cluster: esCluster,
          clusterPlanUnderEdit,
          instanceConfigurations,
          onlySized: false,
        }),
      ),
    )
  }

  invalidateDerivedSettingsAndCommit = () => {
    const { editorState, onChange } = this.props
    const { deployment } = editorState

    this.invalidateDerivedSettings()

    onChange({ deployment })
  }
}

export default withErrorBoundary(ClusterEditor)
