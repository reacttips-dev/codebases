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

import { get, isObject, mapValues, omit } from 'lodash'

import { transformAliases, transformFilterEsQuery } from '../../cui'

import { getSchema } from './searchClustersQuerySchema'

const aliases = {
  id: { aliasOf: `cluster_id` },
  name: { aliasOf: `cluster_name` },
  enabled_snapshots: { aliasOf: `settings.snapshot.enabled`, booleanCast: true },
  healthy: { booleanCast: true },
  healthy_masters: { aliasOf: `elasticsearch.master_info.healthy`, booleanCast: true },
  healthy_configuration: { aliasOf: `plan_info.healthy`, booleanCast: true },
  healthy_shards: { aliasOf: `elasticsearch.shard_info.healthy`, booleanCast: true },
  healthy_snapshot: { aliasOf: `snapshots.healthy`, booleanCast: true },
  healthy_snapshot_latest: { aliasOf: `snapshots.latest_successful`, booleanCast: true },
  hidden: { aliasOf: `settings.metadata.hidden`, booleanCast: true },
  locked: { booleanCast: true },
  template: { aliasOf: `plan_info.current.plan.deployment_template.id` },
  maintenance: { aliasOf: `topology.instances.maintenance_mode`, booleanCast: true },
  allocator: { aliasOf: `topology.instances.allocator_id` },
  organization: { aliasOf: `settings.metadata.organization_id` },
  subscription: { aliasOf: `settings.metadata.subscription_level` },
  system: { aliasOf: `settings.metadata.system_owned`, booleanCast: true },
}

export function getFilterQuery(esQuery) {
  const { defaultFields } = getSchema()

  // maps user-friendly filter context schema to backing ES query
  const getRawEsQuery = transformFilterEsQuery({
    transform,
    transformObject,
    defaultFields,
  })

  return getRawEsQuery(esQuery)
}

function transform(path, value) {
  return transformAliases(aliases, path, value)
}

function transformObject(value) {
  const region = get(value, [`match`, `region`, `query`])

  if (typeof region === `string`) {
    return transformRegionQuery(region)
  }

  const pending = get(value, [`match`, `pending`, `query`])

  if (typeof pending === `string`) {
    return transformPendingQuery(pending)
  }

  const stopped = get(value, [`match`, `stopped`, `query`])

  if (typeof stopped === `string`) {
    return transformStoppedQuery(stopped)
  }

  const has = get(value, [`match`, `has`, `query`])

  if (typeof has === `string`) {
    return transformHasQuery(has)
  }

  const configuration = get(value, [`match`, `configuration`, `query`])

  if (typeof configuration === `string`) {
    return transformConfigurationQuery(configuration)
  }

  const version = get(value, [`match`, `version`, `query`])

  if (typeof version === `string`) {
    return transformVersionQuery(version)
  }

  const rangeZones = get(value, [`range`, `zones`])
  const matchZones = get(value, [`match`, `zones`])
  const zones = rangeZones || matchZones

  if (isObject(zones)) {
    const queryType = rangeZones ? `range` : `term`
    return transformZonesQuery({ zones, queryType })
  }

  const rangeSize = get(value, [`range`, `size`])
  const matchSize = get(value, [`match`, `size`])
  const size = rangeSize || matchSize

  if (isObject(size)) {
    const queryType = rangeSize ? `range` : `term`
    return transformSizeQuery({ size, queryType })
  }
}

function transformRegionQuery(value) {
  return {
    bool: {
      should: value.split(/\s+/).map((region) => ({
        prefix: {
          'region.keyword': {
            value: region,
          },
        },
      })),
    },
  }
}

function transformPendingQuery(value) {
  if (value === `y`) {
    return {
      exists: {
        field: `plan_info.pending`,
      },
    }
  }

  if (value === `n`) {
    return {
      bool: {
        must_not: [
          {
            exists: {
              field: `plan_info.pending`,
            },
          },
        ],
      },
    }
  }
}

function transformStoppedQuery(value) {
  if (value === `y`) {
    return {
      bool: {
        must_not: [
          {
            exists: {
              field: `topology.instances`,
            },
          },
        ],
      },
    }
  }

  if (value === `n`) {
    return {
      exists: {
        field: `topology.instances`,
      },
    }
  }
}

function transformVersionQuery(value) {
  const versions = String(value).split(/\s+/)

  const queries = versions.map((version) => ({
    match: {
      'plan_info.current.plan.elasticsearch.version': { query: version },
    },
  }))

  return {
    bool: {
      should: queries,
    },
  }
}

function transformConfigurationQuery(value) {
  const ids = String(value).split(/\s+/)

  const queries = ids.map((id) => ({
    match: {
      'topology.instances.instance_configuration.id': { query: id },
    },
  }))

  return {
    bool: {
      should: queries,
    },
  }
}

function transformHasQuery(value) {
  const queries = String(value).split(/\s+/).map(getProductQuery).filter(Boolean)

  return {
    bool: {
      must: queries,
    },
  }

  function getProductQuery(product) {
    if (product === `ml`) {
      const nodeConfiguration = `plan_info.current.plan.cluster_topology`
      const mlNodeType = `${nodeConfiguration}.node_type.ml`

      return {
        nested: {
          path: nodeConfiguration,
          query: {
            match: {
              [mlNodeType]: { query: `true` },
            },
          },
        },
      }
    }

    const fields = {
      kibana: `associated_kibana_clusters.enabled`,
      apm: `associated_apm_clusters.enabled`,
      appsearch: `associated_app_search_clusters.enabled`,
    }

    if (!(product in fields)) {
      return null
    }

    return {
      match: {
        [fields[product]]: { query: `true` },
      },
    }
  }
}

function transformZonesQuery({ zones, queryType }) {
  const plan = `plan_info.current.plan`
  const globalZoneCount = `${plan}.zone_count`
  const nodeConfiguration = `${plan}.cluster_topology`
  const nodeConfigurationZoneCount = `${nodeConfiguration}.zone_count`

  const clause = omit(zones, `operator`)

  /* we take the `mapValues` approach because
   * the query could be in `query`, `gt`, `lt`, etc.
   */
  const matcher =
    queryType === `range`
      ? mapValues(clause, (value) => parseInt(value, 10))
      : {
          value: parseInt(clause.query, 10),
        }

  return {
    bool: {
      should: [
        {
          nested: {
            path: nodeConfiguration,
            query: {
              [queryType]: { [nodeConfigurationZoneCount]: matcher },
            },
          },
        },
        {
          [queryType]: { [globalZoneCount]: matcher },
        },
      ],
    },
  }
}

function transformSizeQuery({ size, queryType }) {
  const nodeConfiguration = `plan_info.current.plan.cluster_topology`
  const flexSize = `${nodeConfiguration}.size.value`
  const exactSize = `${nodeConfiguration}.memory_per_node`

  const clause = omit(size, `operator`)

  /* we take the `mapValues` approach because
   * the query could be in `query`, `gt`, `lt`, etc.
   */
  const matcher =
    queryType === `range`
      ? mapValues(clause, (value) => timesKilo(value))
      : {
          value: timesKilo(clause.query),
        }

  return {
    nested: {
      path: nodeConfiguration,
      query: {
        bool: {
          should: [
            { [queryType]: { [flexSize]: matcher } },
            { [queryType]: { [exactSize]: matcher } },
          ],
        },
      },
    },
  }
}

function timesKilo(value) {
  return parseFloat(value) * 1024
}
