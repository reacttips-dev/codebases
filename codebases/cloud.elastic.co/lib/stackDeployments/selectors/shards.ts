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

import { minBy, maxBy, map } from 'lodash'

import { ElasticsearchResourceInfo } from '../../api/v1/types'

export function hasHealthyShards({ resource }: { resource: ElasticsearchResourceInfo }): boolean {
  return resource.info.elasticsearch.shard_info.healthy
}

export function countShards({ resource }: { resource: ElasticsearchResourceInfo }) {
  const shardInfo = resource.info.elasticsearch.shard_info

  const available = minBy(map(shardInfo.available_shards, `shard_count`)) || 0
  const unavailable = maxBy(map(shardInfo.unavailable_shards, `shard_count`)) || 0
  const total = available + unavailable

  return {
    total,
    available,
    unavailable,
  }
}
