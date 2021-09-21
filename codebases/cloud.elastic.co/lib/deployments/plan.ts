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

import { cloneDeep, difference, find, get, intersection, minBy, union } from 'lodash'

import { planPaths } from '../../config/clusterPaths'
import defaultPlans from '../../config/defaultPlans'

import { getConfigForKey } from '../../store'

import { mapToString } from '../../components/DeploymentConfigure/Scripts/utility'

import { gte, satisfies } from '../semver'

import { getSize } from './conversion'

import {
  ElasticsearchClusterPlan,
  ElasticsearchScriptingUserSettings,
  InstanceConfiguration,
} from '../api/v1/types'

import { Scripting, VersionNumber, PlainHashMap } from '../../types'

export const findDefaultPlanForVersion = (version: VersionNumber) =>
  tweakDefaultPlanNodeConfigurations(
    find(defaultPlans, (_, defaultPlanVersion: VersionNumber) =>
      satisfies(version, defaultPlanVersion),
    ),
  )

// DNT-FIXME:
// SaaS needs a different node_configuration than ECE for pre-dnt clusters. This is a temp change that will be gone once we merge DNT. However, we need this today to allow UCv2 to be shipped without DNT.
// TODO: Do we still actually need this?
function tweakDefaultPlanNodeConfigurations(plan) {
  if (getConfigForKey(`APP_NAME`) !== `userconsole`) {
    return plan
  }

  if (plan == null) {
    return plan
  }

  const copiedPlan = cloneDeep(plan)

  copiedPlan.cluster_topology.forEach((nodeConfiguration) => {
    nodeConfiguration.node_configuration = `highio.legacy`
  })

  return copiedPlan
}

export const getValueFromPlan = (
  plan: ElasticsearchClusterPlan,
  path: string | string[],
  defaultValue: any,
): any => {
  for (const topology of plan.cluster_topology) {
    const value = get(topology, path)

    if (value != null) {
      return value
    }
  }

  return defaultValue
}

export const getMinimumMemoryFromPlan = (
  plan: ElasticsearchClusterPlan,
  instanceConfigurations: InstanceConfiguration[],
): number => {
  const memorySizes = plan.cluster_topology.map((nodeConfiguration) => {
    const { size, instance_configuration_id } = nodeConfiguration

    if (!size || !size.value) {
      return 0
    }

    const { resource, value } = size

    const instanceConfiguration = instanceConfigurations.find(
      (instanceConfig) => instanceConfig.id === instance_configuration_id,
    )

    if (!instanceConfiguration) {
      return 0
    }

    return getSize({
      resource,
      size: { value },
      instanceConfiguration,
    })
  })

  const nonZeroSizes = memorySizes.filter((size) => size > 0)

  if (nonZeroSizes.length === 0) {
    return 0
  }

  return minBy(nonZeroSizes)!
}

export const getNullScripting = (): Scripting => ({
  inline: null,
  stored: null,
  file: null,
})

export const getScriptingFromPlan = (plan: ElasticsearchClusterPlan): Scripting => {
  // We assume scripting is always identical across instance configurations.
  const scripting: ElasticsearchScriptingUserSettings | null = getScripting()

  if (scripting === null) {
    return getNullScripting()
  }

  const inline = mapToString(scripting.inline)
  const stored = mapToString(scripting.stored)
  const file = mapToString(scripting.file)

  return { inline, stored, file }

  function getScripting() {
    for (const topology of plan.cluster_topology) {
      const nodeConfigurationScripting = get(topology, planPaths.scripting, null)

      if (nodeConfigurationScripting !== null) {
        return nodeConfigurationScripting
      }
    }

    const { version } = plan.elasticsearch

    if (!version) {
      return null
    }

    const defaultPlan = findDefaultPlanForVersion(version)

    return get(defaultPlan, planPaths.scripting, null)
  }
}

const ingestPlugins = [`ingest-geoip`, `ingest-user-agent`]

export const filterIngestPluginsOnMemory = ({
  plugins,
  allowedPlugins,
  minimumMemory,
  esVersion,
}: {
  plugins: string[]
  allowedPlugins: string[]
  minimumMemory: number
  esVersion?: VersionNumber
}) => {
  const minimumMemoryForIngestPlugins = 4096

  const shouldHaveIngestPlugins =
    esVersion && gte(esVersion, `5.3.0`) && minimumMemory >= minimumMemoryForIngestPlugins

  const newPlugins = shouldHaveIngestPlugins
    ? union(plugins, ingestPlugins)
    : difference(plugins, ingestPlugins)

  return intersection(newPlugins, allowedPlugins)
}

export function isIngestPlugin(plugin: string) {
  return ingestPlugins.includes(plugin)
}

export const createPluginToDiffMap = (
  allPlugins: string[],
  plugins: string[] = [],
  prevPlugins: string[] = [],
): PlainHashMap<'added' | 'removed'> => {
  const pluginIdToDiffMap: PlainHashMap<'added' | 'removed'> = {}

  allPlugins.forEach((pluginId) => {
    const wasIncludedOriginally = prevPlugins.includes(pluginId)
    const isIncludedNow = plugins.includes(pluginId)

    if (!wasIncludedOriginally && isIncludedNow) {
      pluginIdToDiffMap[pluginId] = 'added'
      return
    }

    if (wasIncludedOriginally && !isIncludedNow) {
      pluginIdToDiffMap[pluginId] = 'removed'
    }
  })

  return pluginIdToDiffMap
}
