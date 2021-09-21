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

import { getPlanInfo } from './fundamentals'

import {
  ElasticsearchClusterPlanInfo,
  ElasticsearchResourceInfo,
  RemoteResourceRef,
} from '../../api/v1/types'

export function hasHealthyRemotes({ resource }: { resource: ElasticsearchResourceInfo }): boolean {
  const remotes = getRemotes({ resource })
  return remotes.some(({ info }) => info?.healthy)
}

export function getRemotes({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): RemoteResourceRef[] {
  const planInfo = getPlanInfo({ resource }) as ElasticsearchClusterPlanInfo | null

  if (!planInfo?.plan?.transient?.remote_clusters) {
    return []
  }

  return planInfo.plan.transient.remote_clusters.resources
}
