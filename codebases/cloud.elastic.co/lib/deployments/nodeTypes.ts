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

import { difference } from 'lodash'

import { setNodeRole } from '../stackDeployments/nodeRoles'
import {
  getNodeRoles,
  isDedicatedMaster,
  isMaster,
  isRoleAnyDataRole,
} from '../stackDeployments/selectors'

import { EsNodeType, NodeType, NodeRoles } from '../../types'

import { ElasticsearchClusterTopologyElement } from '../api/v1/types'

/**
 * Return a list of active node types
 * @param {Object} nodeTypes - a map of node type to enabled status
 * @return {string[]} a list of active types
 */
export function getActiveNodeTypes(nodeTypes?: null | { [T in NodeType]?: boolean }): NodeType[] {
  if (nodeTypes == null) {
    return []
  }

  return Object.keys(nodeTypes).filter((t) => nodeTypes[t] === true) as NodeType[]
}

export type TopologyCategorization = {
  data: ElasticsearchClusterTopologyElement[]
  master: ElasticsearchClusterTopologyElement[]
  ingest: ElasticsearchClusterTopologyElement[]
  ml: ElasticsearchClusterTopologyElement[]
}

function normalizeDataTypes(nodeType: NodeRoles): NodeRoles {
  return isRoleAnyDataRole(nodeType) ? `data` : nodeType
}

/**
 * Takes a deployment template and categorises the topology elements within by
 * their node type.
 * @param plans
 * @return TopologyCategorization
 */
export function categorizeTopologies(
  clusterTopology: ElasticsearchClusterTopologyElement[],
): TopologyCategorization {
  const topologiesByType: TopologyCategorization = {
    data: [],
    master: [],
    ingest: [],
    ml: [],
  }

  const nodeTypesCardinality = [`data`, `master`, `ingest`, `ml`]

  for (const topology of clusterTopology) {
    const candidateNodeTypes = getNodeRoles({ topologyElement: topology })

    switch (candidateNodeTypes.length) {
      case 0:
        // Shouldn't happen, but if it does then treat it like data.
        topologiesByType.data.push(topology)
        break

      case 1:
        // Only one type so it's clear which one it is.
        const type = normalizeDataTypes(candidateNodeTypes[0])
        topologiesByType[type].push(topology)
        break

      default:
        // Trickier, there are multiple types. Select the 'best' using the array
        // above to indicate the cardinality of each type. I confess to making
        // this up myself.
        const finalTypeIndex = candidateNodeTypes
          .map(normalizeDataTypes)
          .map((eachType, nodeIndex) => {
            const cardinality = nodeTypesCardinality.indexOf(eachType)

            // Give unrecognised types a very low cardinality
            return cardinality === -1 ? 100 + nodeIndex : cardinality
          })
          .reduce((prev, next) => Math.min(prev, next))
        const finalType: string = nodeTypesCardinality[finalTypeIndex]
        topologiesByType[finalType].push(topology)
        break
    }
  }

  return topologiesByType
}

export function removeNonDedicatedMasters(
  topology: ElasticsearchClusterTopologyElement[],
): ElasticsearchClusterTopologyElement[] {
  return topology.map((topologyElement) => {
    if (isMaster({ topologyElement }) && !isDedicatedMaster({ topologyElement })) {
      return setNodeRole({ topologyElement, role: `master`, value: false })
    }

    return topologyElement
  })
}

export function sortEsNodeTypes(inputEsNodeTypes: EsNodeType[]): EsNodeType[] {
  const master: EsNodeType = 'master'
  const importantTypes = [`data`, `ml`, `ingest`, `master`] as EsNodeType[]

  const topTypes = difference(importantTypes, [master])
  const otherTypes = difference(inputEsNodeTypes, importantTypes)
  const esNodeTypes = [...topTypes, ...otherTypes, master]
  return esNodeTypes
}
