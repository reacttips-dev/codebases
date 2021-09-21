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

import { values } from 'lodash'
import {
  isUnhealthy,
  hasStoppedRoutingRequests,
  isNodePausedByUser,
} from '../../../../lib/stackDeployments/instanceStatus'
import { AllNodeRoles, InstanceSummary, NodesVisualizationFilters } from '../../../../types'

export function applyFilters({
  instanceSummaries,
  filters = {},
}: {
  instanceSummaries: InstanceSummary[]
  filters?: NodesVisualizationFilters
}): InstanceSummary[] {
  return instanceSummaries.filter(
    (instanceSummary) =>
      matchesHeathFilter({ instanceSummary, filters }) &&
      matchesInstanceConfigurationFilter({ instanceSummary, filters }) &&
      matchesNodeRoleFilter({ instanceSummary, filters }),
  )
}

function matchesNodeRoleFilter({
  instanceSummary,
  filters = {},
}: {
  instanceSummary: InstanceSummary
  filters?: NodesVisualizationFilters
}) {
  if (!filters.dataTier) {
    return true
  }

  if (!instanceSummary.instance.node_roles) {
    return false
  }

  const instanceRoles = instanceSummary.instance.node_roles as AllNodeRoles
  return instanceRoles.includes(filters.dataTier)
}

function matchesInstanceConfigurationFilter({
  instanceSummary,
  filters = {},
}: {
  instanceSummary: InstanceSummary
  filters?: NodesVisualizationFilters
}) {
  return (
    !filters.instanceConfigurationId ||
    filters.instanceConfigurationId === instanceSummary.instance.instance_configuration?.id
  )
}

function matchesHeathFilter({
  instanceSummary,
  filters = {},
}: {
  instanceSummary: InstanceSummary
  filters?: NodesVisualizationFilters
}) {
  if (!filters.health) {
    return true
  }

  const { instance } = instanceSummary

  if (filters.health === 'healthy') {
    return !(
      isUnhealthy(instance) ||
      hasStoppedRoutingRequests(instance) ||
      isNodePausedByUser(instance)
    )
  }

  if (filters.health === 'stopped-routing') {
    return hasStoppedRoutingRequests(instance)
  }

  if (filters.health === 'node-paused') {
    return isNodePausedByUser(instance)
  }

  if (filters.health === 'unhealthy') {
    return isUnhealthy(instance)
  }
}

export function hasFilters({ filters }: { filters?: NodesVisualizationFilters }): boolean {
  return values(filters).some((value) => value !== undefined)
}
