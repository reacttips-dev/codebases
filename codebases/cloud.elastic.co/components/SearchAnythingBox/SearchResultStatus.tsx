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

import React, { FunctionComponent } from 'react'

import Status from '../Status'
import ClusterStatus from '../ClusterStatus'
import StackDeploymentStatus from '../StackDeploymentStatus'
import RunnerHealth from '../RunnerHealth'
import AllocatorHealth from '../AllocatorHealth'

import createCluster from '../../reducers/clusters/createCluster'
import createKibana from '../../reducers/kibanas/createKibana'
import createApm from '../../reducers/apms/createApm'
import createAllocator from '../../reducers/allocators/createAllocator'
import { reduceRunner } from '../../reducers/runners'

import { RefinedSearchResult } from '../../types'

import {
  ApmInfo,
  AllocatorInfo,
  DeploymentSearchResponse,
  RunnerInfo,
  ElasticsearchClusterInfo,
  KibanaClusterInfo,
} from '../../lib/api/v1/types'

type Props = {
  searchResult: RefinedSearchResult
}

const SearchResultStatus: FunctionComponent<Props> = ({ searchResult }) => {
  const { kind, region, id, info } = searchResult

  if (kind === `deployment`) {
    return <StackDeploymentStatus deployment={info as DeploymentSearchResponse} />
  }

  if (kind === `elasticsearch`) {
    return (
      <ClusterStatus
        cluster={createCluster({
          regionId: region,
          clusterId: id,
          source: info as ElasticsearchClusterInfo,
          selfUrl: `__unused__`,
        })}
      />
    )
  }

  if (kind === `kibana`) {
    return (
      <ClusterStatus
        kibana={createKibana({
          regionId: region,
          kibanaId: id,
          source: info as KibanaClusterInfo,
          selfUrl: `__unused__`,
        })}
      />
    )
  }

  if (kind === `apm`) {
    return (
      <ClusterStatus
        apm={createApm({
          regionId: region,
          apmId: id,
          source: info as ApmInfo,
          selfUrl: `__unused__`,
        })}
      />
    )
  }

  if (kind === `allocator`) {
    return (
      <AllocatorHealth
        allocator={createAllocator(region, id, `__unused__`, info as AllocatorInfo)}
      />
    )
  }

  if (kind === `runner`) {
    return <RunnerHealth runner={reduceRunner(region, info as RunnerInfo)} />
  }

  const isHealthy = Boolean((info as { healthy?: boolean }).healthy)

  return <Status status={isHealthy} />
}

export default SearchResultStatus
