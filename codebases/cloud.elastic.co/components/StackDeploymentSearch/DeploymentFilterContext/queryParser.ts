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

import { transformFilterEsQuery } from '../../../cui'

import { getSchema, getProductFieldName } from './schema'

import {
  getSupportedSliderInstanceTypes,
  getSupportedProductSliderTypes,
} from '../../../lib/sliders'

import { SliderInstanceType } from '../../../types'

type TransformFn = (params: { sliderInstanceTypes?: SliderInstanceType[]; node: any }) => any

type QueryAliases = {
  [key: string]: {
    aliasOf?: string
    booleanCast?: boolean
    nested?: boolean
    supportedTypes?: SliderInstanceType[]
  }
}

const aliases: QueryAliases = {
  enabled_snapshots: {
    aliasOf: `info.settings.snapshot.enabled`,
    booleanCast: true,
    supportedTypes: [`elasticsearch`],
  },
  healthy: { booleanCast: true, nested: false },
  healthy_masters: {
    aliasOf: `info.elasticsearch.master_info.healthy`,
    booleanCast: true,
    supportedTypes: [`elasticsearch`],
  },
  healthy_configuration: { aliasOf: `info.plan_info.healthy`, booleanCast: true },
  healthy_shards: {
    aliasOf: `info.elasticsearch.shard_info.healthy`,
    booleanCast: true,
    supportedTypes: [`elasticsearch`],
  },
  healthy_snapshot: {
    aliasOf: `info.snapshots.healthy`,
    booleanCast: true,
    supportedTypes: [`elasticsearch`],
  },
  healthy_snapshot_latest: {
    aliasOf: `info.snapshots.latest_successful`,
    booleanCast: true,
    supportedTypes: [`elasticsearch`],
  },
  hidden: { aliasOf: `info.settings.metadata.hidden`, booleanCast: true },
  locked: { aliasOf: `info.locked`, booleanCast: true },
  template: { aliasOf: `info.plan_info.current.plan.deployment_template.id` },
  maintenance: { aliasOf: `info.topology.instances.maintenance_mode`, booleanCast: true },
  allocator: { aliasOf: `info.topology.instances.allocator_id` },
  organization: { aliasOf: `info.settings.metadata.organization_id` },
  subscription: { aliasOf: `info.settings.metadata.subscription_level` },
  system: { aliasOf: `info.settings.metadata.system_owned`, booleanCast: true },
}

export function makeFilterQueryTransformer(extendedTransformObject: TransformFn | null = null) {
  // users can provide a guidance of `sliderInstanceTypes`, indicating what plan types they're actually interested in filtering on, so that we don't return results about whether, say, the last APM plan succeded when what they care about is Elasticsearch plans.
  return function getFilterQuery(esQuery, sliderInstanceTypes?: SliderInstanceType[]) {
    const { defaultFields } = getSchema()

    // maps user-friendly filter context schema to backing ES query
    const getRawEsQuery = transformFilterEsQuery({
      transformObject: transformFilterObject,
      defaultFields,
    })

    return getRawEsQuery(esQuery)

    function transformFilterObject(node) {
      if (extendedTransformObject) {
        const extendedTransformation = extendedTransformObject({ sliderInstanceTypes, node })

        if (extendedTransformation !== undefined) {
          return extendedTransformation
        }
      }

      return baseTransformObject({ sliderInstanceTypes, node })
    }
  }
}

export const getFilterQuery = makeFilterQueryTransformer()

function baseTransformObject({ sliderInstanceTypes, node }) {
  for (const alias of Object.keys(aliases)) {
    const value = get(node, [`match`, alias, `query`])

    if (typeof value === `string`) {
      return transformAliasValue({ sliderInstanceTypes, alias, value })
    }
  }

  const es = get(node, [`match_phrase`, `es`]) || get(node, [`match`, `es`, `query`])

  if (typeof es === `string`) {
    return transformLuceneQuery(es)
  }

  const id = get(node, [`match`, `id`, `query`])

  if (typeof id === `string`) {
    return transformIdQuery(id)
  }

  const region = get(node, [`match`, `region`, `query`])

  if (typeof region === `string`) {
    return transformRegionQuery(region)
  }

  const pending = get(node, [`match`, `pending`, `query`])

  if (typeof pending === `string`) {
    return transformPendingQuery({ sliderInstanceTypes, pending })
  }

  const stopped = get(node, [`match`, `stopped`, `query`])

  if (typeof stopped === `string`) {
    return transformStoppedQuery({ sliderInstanceTypes, stopped })
  }

  const has = get(node, [`match`, `has`, `query`])

  if (typeof has === `string`) {
    return transformHasQuery(has)
  }

  const configuration = get(node, [`match`, `configuration`, `query`])

  if (typeof configuration === `string`) {
    return transformConfigurationQuery({ sliderInstanceTypes, configuration })
  }

  const version = get(node, [`match`, `version`, `query`])

  if (typeof version === `string`) {
    return transformVersionQuery(version)
  }

  const rangeZones = get(node, [`range`, `zones`])
  const matchZones = get(node, [`match`, `zones`])
  const zones = rangeZones || matchZones

  if (isObject(zones)) {
    const queryType = rangeZones ? `range` : `term`
    return transformZonesQuery({ sliderInstanceTypes, zones, queryType })
  }

  const rangeSize = get(node, [`range`, `size`])
  const matchSize = get(node, [`match`, `size`])
  const size = rangeSize || matchSize

  if (isObject(size)) {
    const queryType = rangeSize ? `range` : `term`
    return transformSizeQuery({ sliderInstanceTypes, size, queryType })
  }
}

export function transformResourceQuery({
  sliderInstanceTypes = getSupportedSliderInstanceTypes(),
  clause = `should`,
  path,
  queryType,
  query,
  transform,
}: {
  sliderInstanceTypes?: SliderInstanceType[]
  clause?: 'should' | 'should_not' | 'must' | 'must_not'
  path?: string
  queryType?: string
  query?: any
  transform?: (params: { nestedPath: string }) => any
}) {
  return {
    bool: {
      [clause]: sliderInstanceTypes.map((sliderInstanceType) => {
        const nestedPath = `resources.${sliderInstanceType}`

        const nestedQuery = transform
          ? transform({ nestedPath })
          : {
              [queryType!]: {
                [`${nestedPath}.${path}`]: query,
              },
            }

        return {
          nested: {
            path: nestedPath,
            query: nestedQuery,
          },
        }
      }),
    },
  }
}

function transformAliasValue({
  sliderInstanceTypes,
  alias,
  value,
}: {
  sliderInstanceTypes?: SliderInstanceType[]
  alias: string
  value
}) {
  const {
    aliasOf,
    booleanCast,
    nested = true,

    // some aliases only make sense for `supportedTypes`, and for the rest we can honor the user's preference
    supportedTypes = sliderInstanceTypes,
  } = aliases[alias]

  const path = aliasOf || alias
  const booleanValue = value === `y` ? `true` : `false`
  const queryValue = booleanCast ? booleanValue : value

  if (!nested) {
    return {
      match: {
        [path]: {
          query: queryValue,
        },
      },
    }
  }

  return transformResourceQuery({
    sliderInstanceTypes: supportedTypes,
    path,
    queryType: `match`,
    query: { query: queryValue },
  })
}

export function transformLuceneQuery(value) {
  return {
    query_string: {
      query: value,
    },
  }
}

export function transformIdQuery(value) {
  const matchDeploymentId = { prefix: { id: { value } } }

  const matchAnyResourceClusterId = transformResourceQuery({
    path: `id`,
    queryType: `prefix`,
    query: { value },
  })

  return {
    bool: {
      should: [matchDeploymentId, matchAnyResourceClusterId],
    },
  }
}

function transformRegionQuery(value) {
  return transformResourceQuery({
    transform: ({ nestedPath }) => ({
      bool: {
        should: value.split(/\s+/).map((region) => ({
          prefix: {
            [`${nestedPath}.region`]: {
              value: region,
            },
          },
        })),
      },
    }),
  })
}

function transformPendingQuery({ sliderInstanceTypes = [`elasticsearch`], pending }) {
  if (pending === `y`) {
    return transformResourceQuery({
      sliderInstanceTypes,
      transform: ({ nestedPath }) => ({
        exists: {
          field: `${nestedPath}.info.plan_info.pending`,
        },
      }),
    })
  }

  if (pending === `n`) {
    return transformResourceQuery({
      sliderInstanceTypes,
      clause: `must`,
      transform: ({ nestedPath }) => ({
        bool: {
          must_not: [
            {
              exists: {
                field: `${nestedPath}.info.plan_info.pending`,
              },
            },
          ],
        },
      }),
    })
  }
}

function transformStoppedQuery({ sliderInstanceTypes = [`elasticsearch`], stopped }) {
  if (stopped === `y`) {
    return transformResourceQuery({
      sliderInstanceTypes,
      transform: ({ nestedPath }) => ({
        bool: {
          must_not: [
            {
              exists: {
                field: `${nestedPath}.info.topology.instances`,
              },
            },
          ],
        },
      }),
    })
  }

  if (stopped === `n`) {
    return transformResourceQuery({
      sliderInstanceTypes,
      clause: `must`,
      transform: ({ nestedPath }) => ({
        exists: {
          field: `${nestedPath}.info.topology.instances`,
        },
      }),
    })
  }
}

function transformVersionQuery(value) {
  const versions = String(value).split(/\s+/)

  return transformResourceQuery({
    sliderInstanceTypes: [`elasticsearch`],
    transform: ({ nestedPath }) => {
      const queries = versions.map((version) => ({
        prefix: {
          [`${nestedPath}.info.plan_info.current.plan.elasticsearch.version`]: { value: version },
        },
      }))

      return {
        bool: {
          should: queries,
        },
      }
    },
  })
}

function transformConfigurationQuery({ sliderInstanceTypes, configuration }) {
  const ids = String(configuration).split(/\s+/)

  return transformResourceQuery({
    sliderInstanceTypes,
    transform: ({ nestedPath }) => {
      const queries = ids.map((id) => ({
        match: {
          [`${nestedPath}.info.topology.instances.instance_configuration.id`]: { query: id },
        },
      }))

      return {
        bool: {
          should: queries,
        },
      }
    },
  })
}

function transformHasQuery(value) {
  return transformResourceQuery({
    sliderInstanceTypes: [`elasticsearch`],
    transform: ({ nestedPath }) => {
      const queries = String(value).split(/\s+/).map(getProductQuery).filter(Boolean)

      return {
        bool: {
          must: queries,
        },
      }

      function getProductQuery(product) {
        if (product === `ml`) {
          const nodeConfiguration = `${nestedPath}.info.plan_info.current.plan.cluster_topology`
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

        // don't add fields for ES (since it's always present) or ML (since it's handed above)
        const fieldProductSliderTypes = getSupportedProductSliderTypes().filter(
          ({ sliderInstanceType }) => sliderInstanceType !== `elasticsearch`,
        )

        const fields = {}

        for (const fieldProductSliderType of fieldProductSliderTypes) {
          const fieldName = getProductFieldName(fieldProductSliderType)
          const { sliderInstanceType } = fieldProductSliderType
          fields[fieldName] = `${nestedPath}.info.associated_${sliderInstanceType}_clusters.enabled`
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
    },
  })
}

function transformZonesQuery({ sliderInstanceTypes = [`elasticsearch`], zones, queryType }) {
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

  return transformResourceQuery({
    sliderInstanceTypes,
    transform: ({ nestedPath }) => {
      const plan = `${nestedPath}.info.plan_info.current.plan`
      const globalZoneCount = `${plan}.zone_count`
      const nodeConfiguration = `${plan}.cluster_topology`
      const nodeConfigurationZoneCount = `${nodeConfiguration}.zone_count`

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
    },
  })
}

function transformSizeQuery({ sliderInstanceTypes = [`elasticsearch`], size, queryType }) {
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

  return transformResourceQuery({
    sliderInstanceTypes,
    transform: ({ nestedPath }) => {
      const nodeConfiguration = `${nestedPath}.info.plan_info.current.plan.cluster_topology`
      const flexSize = `${nodeConfiguration}.size.value`
      const exactSize = `${nodeConfiguration}.memory_per_node`

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
    },
  })
}

function timesKilo(value) {
  return parseFloat(value) * 1024
}
