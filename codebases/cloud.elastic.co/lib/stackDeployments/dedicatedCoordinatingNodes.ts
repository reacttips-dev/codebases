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

import { isEnabledConfiguration } from '../deployments/conversion'
import { isDedicatedIngest, isIngest } from './selectors'
import { setNodeRoleInPlace } from './nodeRoles'

import {
  ElasticsearchPayload,
  ElasticsearchClusterTopologyElement,
  DeploymentTemplateInfoV2,
} from '../api/v1/types'

export function ensureDedicatedCoordinatingAwareTopology({
  esCluster,
  deploymentTemplate,
}: {
  esCluster: ElasticsearchPayload
  deploymentTemplate: DeploymentTemplateInfoV2
}): ElasticsearchClusterTopologyElement[] {
  const esPlan = esCluster.plan

  if (!esPlan) {
    return []
  }

  const clusterTopology = esPlan.cluster_topology
  const dedicatedCoordinatingNode = clusterTopology.find(isDedicatedCoordinatingNode)

  if (!dedicatedCoordinatingNode) {
    return clusterTopology
  }

  const dedicatedCoordinatingNodeEnabled = isEnabledConfiguration(dedicatedCoordinatingNode)

  if (dedicatedCoordinatingNodeEnabled) {
    removeIngestFromOtherTopologyElements()
  } else {
    addIngestBackToOtherTopologyElements()
  }

  return clusterTopology

  function removeIngestFromOtherTopologyElements() {
    for (const topologyElement of clusterTopology) {
      if (topologyElement === dedicatedCoordinatingNode) {
        continue
      }

      setNodeRoleInPlace({ topologyElement, role: `ingest`, value: false })
    }
  }

  function addIngestBackToOtherTopologyElements() {
    for (const topologyElement of clusterTopology) {
      const templateTopologyElement =
        deploymentTemplate.deployment_template.resources.elasticsearch![0].plan.cluster_topology.find(
          ({ id, instance_configuration_id }) => {
            if (id) {
              return id === topologyElement.id
            }

            return instance_configuration_id === topologyElement.instance_configuration_id
          },
        )

      if (!templateTopologyElement) {
        return // sanity
      }

      const supportsIngestNodeType = isIngest({ topologyElement: templateTopologyElement })

      if (supportsIngestNodeType && topologyElement !== dedicatedCoordinatingNode) {
        setNodeRoleInPlace({ topologyElement, role: `ingest`, value: true })
      }
    }
  }
}

function isDedicatedCoordinatingNode(
  topologyElement: ElasticsearchClusterTopologyElement,
): boolean {
  return isDedicatedIngest({ topologyElement })
}
