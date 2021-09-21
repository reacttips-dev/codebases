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

import { getBwcInstanceConfigurationAggs } from './bwc'
import { getDeploymentStatus } from './status'

import { DeploymentStatusSort } from '../../types'
import { DeploymentSearchResponse } from '../../lib/api/v1/types'

export const sortDeploymentsByRamAndStatus = (
  deployments: DeploymentSearchResponse[],
): DeploymentSearchResponse[] => {
  const deploymentsCopy = deployments.slice()

  deploymentsCopy.sort((left, right) => {
    const leftStatus = getDeploymentStatus({ deployment: left })
    const rightStatus = getDeploymentStatus({ deployment: right })

    if (leftStatus.status !== rightStatus.status) {
      return DeploymentStatusSort[leftStatus.status] - DeploymentStatusSort[rightStatus.status]
    }

    const leftInstanceConfigs = getBwcInstanceConfigurationAggs({ deployment: left })
    const rightInstanceConfigs = getBwcInstanceConfigurationAggs({ deployment: right })

    if (leftInstanceConfigs && rightInstanceConfigs) {
      const maxMemorySumA = Math.max(...leftInstanceConfigs.map((o) => o.memorySum))
      const maxMemorySumB = Math.max(...rightInstanceConfigs.map((o) => o.memorySum))
      return Math.max(maxMemorySumB) - Math.max(maxMemorySumA)
    }

    return 0
  })

  return deploymentsCopy
}
