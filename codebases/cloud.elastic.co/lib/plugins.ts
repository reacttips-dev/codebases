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

import {
  cloneDeep,
  difference,
  differenceBy,
  find,
  flatMap,
  get,
  intersection,
  isEmpty,
  isEqual,
  minBy,
  pullAll,
  union,
  uniqWith,
} from 'lodash'

import { planPaths } from '../config/clusterPaths'
import { isEnabledConfiguration } from './deployments/conversion'
import { getFirstEsResourceFromTemplate } from './stackDeployments/selectors'

import { gte, satisfies } from './semver'
import { replaceIn } from './immutability-helpers'

import { InstanceTemplateConfig } from '../types'

import {
  DeploymentTemplateInfoV2,
  Extension,
  ElasticsearchClusterPlan,
  ElasticsearchClusterTopologyElement,
  ElasticsearchUserPlugin,
  ElasticsearchUserBundle,
  StackVersionConfig,
} from './api/v1/types'

type PlanUserExtension = ElasticsearchUserPlugin | ElasticsearchUserBundle
type ExtensionType = 'plugin' | 'bundle'

const minSizeForDefaultIngestPlugins = 4096
const extraDefaultIngestPlugins = [`ingest-geoip`, `ingest-user-agent`]

export function getAllowedPluginsForVersions({
  plan,
  versions,
}: {
  plan: ElasticsearchClusterPlan
  versions: StackVersionConfig[]
}): string[] {
  const planVersion = get(plan, planPaths.version)
  const version = find(versions, (stackVersion) => stackVersion.version === planVersion)
  return getAllowedPluginsForVersion({ version })
}

export function getAllowedPluginsForVersion({
  version,
}: {
  version?: StackVersionConfig
}): string[] {
  if (version == null || version.elasticsearch == null) {
    return []
  }

  /* 1. `default_plugins`: the system demands that clusters always have these enabled,
   *    or else the system itself will not be able to work with the cluster correctly.
   *    We _never_ want to offer users a choice about plugins in the `default_plugins` list.
   *
   * 2. `extraDefaultIngestPlugins` are unrelated. These are *user-controlled* plugins,
   *    and we want to have the UI select them by default for certain usability reasons.
   *    Users might indeed choose to remove or add these plugins.
   */
  const allowedPlugins = difference(
    version.elasticsearch.plugins,
    version.elasticsearch.default_plugins,
  )

  return allowedPlugins
}

export function getPluginsConsideringIngest({
  plan,
  versions,
}: {
  plan: ElasticsearchClusterPlan
  versions: StackVersionConfig[]
}): string[] {
  const planPlugins = get(plan, planPaths.plugins, [])
  const planCapacity = get(plan, planPaths.instanceCapacity)
  const planVersion = get(plan, planPaths.version)
  const allowedPlugins = getAllowedPluginsForVersions({ plan, versions })

  const ingestPlugins = intersection(allowedPlugins, extraDefaultIngestPlugins)
  const withoutIngestPlugins = difference(planPlugins, ingestPlugins)
  const withIngestPlugins = union(planPlugins, ingestPlugins)

  if (planCapacity < minSizeForDefaultIngestPlugins) {
    return withoutIngestPlugins
  }

  if (gte(planVersion, `5.3.0`)) {
    return withIngestPlugins
  }

  return withoutIngestPlugins
}

export function getVersionAgnosticPluginsConsideringIngest(
  plugins: string[],
  dataConfigurations: InstanceTemplateConfig[],
): string[] {
  const nonZeroSizes = dataConfigurations.filter((configuration) =>
    isEnabledConfiguration({
      ...configuration,
      size: { resource: configuration.resource, value: configuration.size },
    }),
  )

  if (nonZeroSizes.length === 0) {
    return difference(plugins, extraDefaultIngestPlugins)
  }

  const memorySizes = nonZeroSizes.map((dataConfiguration) => dataConfiguration.size)

  const minimumSize = minBy(memorySizes)! as number

  if (minimumSize < minSizeForDefaultIngestPlugins) {
    return difference(plugins, extraDefaultIngestPlugins)
  }

  return union(plugins, extraDefaultIngestPlugins)
}

export function getDisabledPlugins(
  availablePlugins: string[],
  deploymentTemplate: DeploymentTemplateInfoV2,
): string[] {
  const esResource = getFirstEsResourceFromTemplate({
    deploymentTemplate: deploymentTemplate.deployment_template,
  })
  const deploymentTemplatePlugins = esResource?.plan.elasticsearch.enabled_built_in_plugins

  if (!deploymentTemplatePlugins) {
    return []
  }

  return pullAll(deploymentTemplatePlugins, availablePlugins)
}

export function getCustomPluginsFromPlan(
  plan: { cluster_topology?: ElasticsearchClusterTopologyElement[] },
  kind?: ExtensionType,
): PlanUserExtension[] {
  const nodeConfigurations: ElasticsearchClusterTopologyElement[] = get(
    plan,
    [`cluster_topology`],
    [],
  )

  const everyCurrentPlugin = flatMap(nodeConfigurations, (nodeConfiguration) =>
    getTopologyElementExtensions(nodeConfiguration, kind),
  )

  const currentPlugins = uniqWith(everyCurrentPlugin, isEqual)
  return currentPlugins
}

function getTopologyElementExtensions(
  nodeConfiguration: ElasticsearchClusterTopologyElement,
  kind?: ExtensionType,
): PlanUserExtension[] {
  if (!nodeConfiguration.elasticsearch) {
    return []
  }

  const bundles = nodeConfiguration.elasticsearch.user_bundles || []
  const plugins = nodeConfiguration.elasticsearch.user_plugins || []

  if (kind === `bundle`) {
    return bundles
  }

  if (kind === `plugin`) {
    return plugins
  }

  return [...bundles, ...plugins]
}

export function getIncompatibleCustomPlugins(
  oldVersion: string | null | undefined,
  newVersion: string | null | undefined,
  plan: ElasticsearchClusterPlan,
): PlanUserExtension[] {
  if (!newVersion || newVersion === oldVersion) {
    return []
  }

  const userExtensions = getCustomPluginsFromPlan(plan)

  if (isEmpty(userExtensions)) {
    return []
  }

  const unsafeUserExtensions = userExtensions.filter(isUnsafeExtension)
  return unsafeUserExtensions

  function isUnsafeExtension(extension: PlanUserExtension): boolean {
    return !satisfies(newVersion!, extension.elasticsearch_version)
  }
}

export function getPlanWithUpdatedCustomPlugins(
  selectedPluginUrls: string[],
  removedPlugins: PlanUserExtension[],
  extensions: Extension[],
  plan: ElasticsearchClusterPlan,
): ElasticsearchClusterPlan {
  let updatedPlan = cloneDeep(plan)

  const selectedUserBundles: PlanUserExtension[] = []
  const selectedUserPlugins: PlanUserExtension[] = []

  for (const pluginUrl of selectedPluginUrls) {
    const extension = find(extensions, { url: pluginUrl })

    if (!extension) {
      continue
    }

    const planExtension = convertExtensionToPlanFormat(plan, extension)

    if (extension.extension_type === `bundle`) {
      selectedUserBundles.push(planExtension)
    } else {
      selectedUserPlugins.push(planExtension)
    }
  }

  const newUserBundles = differenceBy(
    getCustomPluginsFromPlan(updatedPlan, `bundle`).concat(selectedUserBundles),
    removedPlugins,
    `url`,
  )

  const newUserPlugins = differenceBy(
    getCustomPluginsFromPlan(updatedPlan, `plugin`).concat(selectedUserPlugins),
    removedPlugins,
    `url`,
  )

  for (const nodeConfiguration of updatedPlan.cluster_topology) {
    const topologyElementIndex = updatedPlan.cluster_topology.indexOf(nodeConfiguration)

    const bundleUpdatePath = [
      `cluster_topology`,
      topologyElementIndex,
      `elasticsearch`,
      `user_bundles`,
    ] as string[]

    const pluginUpdatePath = [
      `cluster_topology`,
      topologyElementIndex,
      `elasticsearch`,
      `user_plugins`,
    ] as string[]

    updatedPlan = replaceIn(updatedPlan, bundleUpdatePath, newUserBundles)
    updatedPlan = replaceIn(updatedPlan, pluginUpdatePath, newUserPlugins)
  }

  return updatedPlan
}

export function convertExtensionToPlanFormat(
  plan: ElasticsearchClusterPlan,
  extension: Extension,
): PlanUserExtension {
  const { name, url, version } = extension
  const planVersion = get(plan, [`elasticsearch`, `version`])
  const elasticsearch_version = version || planVersion!

  return {
    name,
    url,
    elasticsearch_version,
  }
}
