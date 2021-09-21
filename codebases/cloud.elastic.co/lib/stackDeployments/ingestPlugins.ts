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

import { filterIngestPluginsOnMemory, getMinimumMemoryFromPlan } from '../deployments/plan'

import { getAllowedPluginsForVersions } from '../plugins'

import { ElasticsearchPayload, InstanceConfiguration, StackVersionConfig } from '../api/v1/types'

// Ingest plugin versioning awareness
export function ensureIngestPluginAwareTopology({
  cluster,
  instanceConfigurations,
  stackVersions,
}: {
  cluster: ElasticsearchPayload
  instanceConfigurations: InstanceConfiguration[]
  stackVersions: StackVersionConfig[]
}) {
  const esPlan = cluster.plan

  const version = esPlan.elasticsearch.version
  const nodeConfigurations = esPlan.cluster_topology

  const pluginsPath = [`elasticsearch`, `enabled_built_in_plugins`]

  const minimumMemory = getMinimumMemoryFromPlan(esPlan, instanceConfigurations)
  const allowedPlugins = getAllowedPluginsForVersions({ plan: esPlan, versions: stackVersions })

  nodeConfigurations.forEach((nodeConfiguration) => {
    const plugins = get(nodeConfiguration, pluginsPath, [])
    const nextPlugins = filterIngestPluginsOnMemory({
      plugins,
      allowedPlugins,
      minimumMemory,
      esVersion: version!,
    })
    set(nodeConfiguration, pluginsPath, nextPlugins)
  })
}
