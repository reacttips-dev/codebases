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
  resolveDeploymentUrlForEsCluster,
  deploymentUrl,
  hostAllocatorUrl,
  hostUrl,
  sliderUrl,
} from '../../../lib/urlBuilder'
import { getSupportedSliderInstanceTypes } from '../../../lib/sliders'

import { RefinedSearchResult, AnyClusterInfo } from '../../../types'

import { ElasticsearchClusterInfo } from '../../../lib/api/v1/types'

export function resourceOverviewUrl(result: RefinedSearchResult): string | null {
  if (result.kind === `allocator`) {
    return hostAllocatorUrl(result.region, result.id)
  }

  if (result.kind === `runner`) {
    return hostUrl(result.region, result.id)
  }

  if (result.kind === `deployment`) {
    return deploymentUrl(result.id)
  }

  if (result.kind === `elasticsearch`) {
    return resolveDeploymentUrlForEsCluster(sliderUrl, result.region, result.id, result.kind)
  }

  if (getSupportedSliderInstanceTypes().includes(result.kind)) {
    return resolveDeploymentUrlForEsCluster(
      sliderUrl,
      result.region,
      (result.info as Exclude<AnyClusterInfo, ElasticsearchClusterInfo>).elasticsearch_cluster
        .elasticsearch_id,
      result.kind,
    )
  }

  return null
}
