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

import { uniq } from 'lodash'

import { allocatorFilterToClauses } from '../allocatorFilters/allocatorFilterClauses'

import { AnyPlan, AnyTopologyElement } from '../../types'
import { InnerClause } from '../../types/instanceConfigurationTypes'
import { InstanceConfiguration, MetadataItem } from '../api/v1/types'

export function getInstanceConfigurationById(
  instanceConfigurations: InstanceConfiguration[],
  id: string,
): InstanceConfiguration | undefined {
  return instanceConfigurations.find((instanceConfiguration) => instanceConfiguration.id === id)
}

export function isDedicatedConfig(config: InstanceConfiguration): boolean {
  return (config.node_types || []).length === 1
}

export function isDeprecatedConfig(config: InstanceConfiguration): boolean {
  return config.metadata ? 'deprecated' in config.metadata : false
}

export function getInstanceConfigsByNodeType(
  instanceConfigurations: InstanceConfiguration[] = [],
  type: string,
  allowMulti: boolean = true,
  ...forceInclude: Array<{ id: string }>
): InstanceConfiguration[] {
  return instanceConfigurations.filter((config) => {
    if (!config.node_types || !config.node_types.includes(type)) {
      return false
    }

    if (forceInclude && forceInclude.some((c) => c.id === config.id)) {
      return true
    }

    return !isDeprecatedConfig(config) && (allowMulti || isDedicatedConfig(config))
  })
}

export function getInstanceConfigsByType(
  instanceConfigurations: InstanceConfiguration[],
  type: string,
) {
  return instanceConfigurations.filter((config) => config.instance_type === type)
}

export function getInstanceConfigsFromPlan(plan: AnyPlan): string[] {
  const nodeConfigurations: AnyTopologyElement[] | undefined = plan.cluster_topology

  if (!nodeConfigurations) {
    return []
  }

  const configurationIds = nodeConfigurations.map(
    (nodeConfiguration) => nodeConfiguration.instance_configuration_id,
  )
  const validConfigurationIds = configurationIds.filter(Boolean) as string[]
  const uniques = uniq(validConfigurationIds)

  return uniques
}

//  Gets the instances that have a filter that matches a specified allocator tag
export function getInstancesWithMatchingFilter({
  instances,
  tag,
}: {
  instances: any
  tag: MetadataItem
}) {
  return instances.filter((instance) => {
    const clauses = allocatorFilterToClauses(instance.instanceConfiguration.allocator_filter)
    const innerClauses: InnerClause[] = []
    clauses.forEach((clause) => {
      clause.innerClauses.forEach((innerClause) => {
        innerClauses.push(innerClause)
      })
    })
    const matchingClauses = innerClauses.filter(
      (innerClause) => innerClause.value === tag.value && innerClause.key === tag.key,
    )

    return matchingClauses.length > 0
  })
}
