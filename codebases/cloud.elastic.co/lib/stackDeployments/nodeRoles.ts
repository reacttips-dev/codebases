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

import { cloneDeep, pull, set } from 'lodash'

import { isEnabledConfiguration } from '../deployments/conversion'
import { getTopologiesFromTemplate } from '../deploymentTemplates/getTopologiesFromTemplate'
import {
  getNodeRoles,
  isDedicatedMaster,
  isDedicatedIngest,
  isUsingNodeRoles,
  isWarm,
  isCold,
  isFrozen,
} from './selectors'
import { getDeploymentTemplateInfoForDeploymentUpsertRequest } from '../reduxShortcuts'

import { AnyTopologyElementWithNodeRoles, NodeRole } from '../../types'
import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  ElasticsearchClusterTopologyElement,
} from '../api/v1/types'

export function setNodeRole<T extends AnyTopologyElementWithNodeRoles>({
  topologyElement,
  role,
  value,
}: {
  topologyElement: T
  role: NodeRole
  value: boolean
}): T {
  const newTopologyElement = cloneDeep(topologyElement)

  setNodeRoleInPlace({ topologyElement: newTopologyElement, role, value })

  return newTopologyElement
}

export function setNodeRoleInPlace({
  topologyElement,
  role,
  value,
}: {
  topologyElement: AnyTopologyElementWithNodeRoles
  role: NodeRole
  value: boolean
}): void {
  if (topologyElement.node_roles) {
    const alreadyHasIt = topologyElement.node_roles.includes(role)
    const wantsIt = Boolean(value)

    if (wantsIt && !alreadyHasIt) {
      topologyElement.node_roles.push(role)
    }

    if (!wantsIt && alreadyHasIt) {
      pull(topologyElement.node_roles, role)
    }
  }

  if (topologyElement.node_type == null) {
    topologyElement.node_type = {}
  }

  topologyElement.node_type[role] = value
}

/*
 * Augments a deployment with various metadata from its template, so that we
 * have all we need for UI state when looking directly at a topology element.
 *
 *  - topology_element_control, for minimum size/optionality
 *  - node_roles (with various caveats; see below)
 */
export function enrichDeploymentFromTemplate({
  deployment,
  deploymentTemplate,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  deploymentTemplate: DeploymentCreateRequest
}): void {
  const esTopologies = getTopologiesFromTemplate({
    deploymentTemplate: deployment,
    sliderInstanceType: `elasticsearch`,
  })

  const sizedTopologyElements = esTopologies.filter(isEnabledConfiguration)

  const isAlreadyUsingNodeRoles = sizedTopologyElements.some(
    (topologyElement) => topologyElement.node_roles,
  )

  esTopologies.forEach((topologyElement) => {
    const matchingConfig = getMatchingConfigFromTemplate({
      topologyElement,
      templateInfo: { deployment_template: deploymentTemplate },
    })

    if (!matchingConfig) {
      return // sanity
    }

    // copy optionality from template

    if (matchingConfig.topology_element_control) {
      topologyElement.topology_element_control = matchingConfig.topology_element_control
    }

    // copy node_roles from template if:
    //  - node_roles are already being used on sized elements, or
    //  - the element requires it (i.e. cold tier)

    if (isAlreadyUsingNodeRoles || requiresNodeRoles({ topologyElement })) {
      const nodeRoles = getNodeRoles({ topologyElement: matchingConfig }).filter(
        (x) => x !== `data`,
      ) as Array<
        Exclude<NodeRole, 'data'> // `data` is a legacy node_type, not present in node_roles
      >

      const otherSizedTopologyElements = sizedTopologyElements.filter((x) => x !== topologyElement)

      if (otherSizedTopologyElements.some((x) => isDedicatedMaster({ topologyElement: x }))) {
        pull(nodeRoles, `master`)
      }

      if (otherSizedTopologyElements.some((x) => isDedicatedIngest({ topologyElement: x }))) {
        pull(nodeRoles, `ingest`)
      }

      topologyElement.node_roles = nodeRoles
    }
  })
}

// ensure that the presence of node_roles in topology elements is consistent
export function normalizeNodeRoles({
  deployment,
}: {
  deployment:
    | Pick<DeploymentCreateRequest, 'resources'>
    | Pick<DeploymentUpdateRequest, 'resources'>
}): void {
  let isAutoscalingEnabled: boolean | undefined = false

  const firstEs =
    Array.isArray(deployment.resources!.elasticsearch) && deployment.resources!.elasticsearch[0]

  if (firstEs) {
    isAutoscalingEnabled = firstEs.plan.autoscaling_enabled
  }

  const usingNodeRoles = isUsingNodeRoles({ deployment }) || isAutoscalingEnabled

  if (Array.isArray(deployment.resources!.elasticsearch)) {
    for (const cluster of deployment.resources!.elasticsearch) {
      // we're only concerned with sized (enabled) elements here so that
      // irrelevant nodes (e.g. a disabled warm tier) don't factor in
      const sizedTopologyElements = cluster.plan.cluster_topology.filter(isEnabledConfiguration)

      const templateInfo = getDeploymentTemplateInfoForDeploymentUpsertRequest({ deployment })

      const hasNonHotTiers = sizedTopologyElements.some(
        (topologyElement) =>
          isWarm({ topologyElement }) ||
          isCold({ topologyElement }) ||
          isFrozen({ topologyElement }),
      )

      cluster.plan.cluster_topology.forEach((topologyElement) => {
        const matchingConfig = getMatchingConfigFromTemplate({
          topologyElement,
          templateInfo,
        })

        // do nothing if we can't find an id match between deployment and
        // template -- this is an edge case where the cause should only be
        // that deployment and template have diverged in their topology via
        // the api
        if (!matchingConfig) {
          return
        }

        // backfill node_roles from template

        if (usingNodeRoles && !topologyElement.node_roles) {
          const nodeRoles = getNodeRoles({ topologyElement: matchingConfig }).filter(
            (x) => x !== `data`,
          ) as Array<
            Exclude<NodeRole, 'data'> // `data` is a legacy node_type, not present in node_roles
          >

          const otherSizedTopologyElements = sizedTopologyElements.filter(
            (x) => x !== topologyElement,
          )

          if (otherSizedTopologyElements.some((x) => isDedicatedMaster({ topologyElement: x }))) {
            pull(nodeRoles, `master`)
          }

          if (otherSizedTopologyElements.some((x) => isDedicatedIngest({ topologyElement: x }))) {
            pull(nodeRoles, `ingest`)
          }

          topologyElement.node_roles = nodeRoles
        }

        // backfill node_attributes (e.g. data:hot)) from template if there are multiple enabled tiers

        const dataAttribute = matchingConfig.elasticsearch?.node_attributes?.data

        if (hasNonHotTiers && dataAttribute) {
          set(topologyElement, [`elasticsearch`, `node_attributes`, `data`], dataAttribute)
        }
      })

      // node_roles vs node_type must be homogenous, so remove the other
      cluster.plan.cluster_topology.forEach((topologyElement) => {
        if (usingNodeRoles) {
          delete topologyElement.node_type
        } else {
          delete topologyElement.node_roles
        }
      })
    }
  }
}

function getMatchingConfigFromTemplate({
  topologyElement,
  templateInfo,
}: {
  topologyElement: ElasticsearchClusterTopologyElement
  templateInfo: { deployment_template: DeploymentCreateRequest } | undefined
}): ElasticsearchClusterTopologyElement | undefined {
  if (!templateInfo) {
    return
  }

  const possibleTopologies =
    templateInfo.deployment_template?.resources.elasticsearch?.[0].plan.cluster_topology || []

  return possibleTopologies.find((x) => x.id && x.id === topologyElement.id)
}

function requiresNodeRoles({
  topologyElement,
}: {
  topologyElement: ElasticsearchClusterTopologyElement
}): boolean {
  if (topologyElement.id === `cold` || topologyElement.id === `frozen`) {
    return true
  }

  return false
}
