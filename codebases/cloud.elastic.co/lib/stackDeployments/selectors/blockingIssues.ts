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
  ElasticsearchClusterBlockingIssueElement,
  ElasticsearchClusterBlockingIssues,
  ElasticsearchResourceInfo,
} from '../../api/v1/types'

export function hasBlockingIssues({ resource }: { resource: ElasticsearchResourceInfo }): boolean {
  const blockingIssues = getBlockingIssues({ resource })

  if (!blockingIssues) {
    return false
  }

  return blockingIssues.healthy === false
}

export function getBlockingIssues({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): ElasticsearchClusterBlockingIssues {
  return resource.info.elasticsearch.blocking_issues
}

export function getIndexBlockingIssues({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): ElasticsearchClusterBlockingIssueElement[] {
  const blockingIssues = getBlockingIssues({ resource })

  if (!blockingIssues || !blockingIssues.index_level) {
    return []
  }

  return blockingIssues.index_level
}

export function getClusterBlockingIssues({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): ElasticsearchClusterBlockingIssueElement[] {
  const blockingIssues = getBlockingIssues({ resource })

  if (!blockingIssues || !blockingIssues.cluster_level) {
    return []
  }

  return blockingIssues.cluster_level
}
