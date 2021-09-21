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

import { forEach, get } from 'lodash'
import { FETCH_METRICS } from '../../constants/actions'

export default function metricsReducer(state = {}, action) {
  if (action.type === FETCH_METRICS) {
    if (!action.error && action.payload) {
      const { regionId, clusterId, etag } = action.meta

      const key = `${regionId}/${clusterId}`
      const oldMetrics = state[key]

      if (oldMetrics != null && oldMetrics.etag !== etag) {
        return state
      }

      return {
        ...state,
        [key]: { etag, metrics: reduceMetrics(action.payload) },
      }
    }
  }

  return state
}

export function getMetrics(state, regionId, clusterId) {
  const metricsState = state.metrics[`${regionId}/${clusterId}`]
  return metricsState == null ? null : metricsState.metrics
}

function calculateCpuMetrics(cpuUsagePerNode) {
  const cpuUsage = []
  const cpuCredits = []
  const pressurePerNode = []
  const diskUsagePerNode = []

  forEach(cpuUsagePerNode, (nodeBucket) => {
    const nodeName = nodeBucket.key.replace(/-00+/, `-0`)
    const cpuNode = {
      name: nodeName,
      x: [],
      y: [],
      showlegend: false,
      line: { width: 1 },
      mode: `lines`,
    }
    const cpuCreditsNode = {
      name: nodeName,
      x: [],
      y: [],
      connectgaps: false,
      showlegend: false,
      line: { width: 1 },
      mode: `lines`,
    }
    const memoryPressure = {
      name: nodeName,
      x: [],
      y: [],
      connectgaps: false,
      showlegend: false,
      line: { width: 1 },
      mode: `lines`,
    }
    const diskUsage = {
      name: nodeName,
      x: [],
      y: [],
      connectgaps: false,
      showlegend: false,
      line: { width: 1 },
      mode: `lines`,
    }

    const cpuData = []
    const creditData = []

    forEach(get(nodeBucket, [`per_interval`, `buckets`], []), (timeBucket) => {
      const timestamp = new Date(timeBucket.key)
      const normalizationFactor =
        // If there's no boost value, it's 1000, i.e. no boosting.
        (get(timeBucket, [`boost`, `value`]) || 1000) / 1000 / 1000

      // normalizationFactor to turn it into a percentage taking boosting into account
      // both boost and the multiplied number are in thousands, so we divide by 1000 twice

      const cpuCreditsMin = get(timeBucket, [`cpu_credits`, `value`]) || 0

      cpuData.push({
        timestamp,
        avg: get(timeBucket, [`cpu_usage`, `avg`], 0) * normalizationFactor,
        max: get(timeBucket, [`cpu_usage`, `max`], 0) * normalizationFactor,
        min: get(timeBucket, [`cpu_usage`, `min`], 0) * normalizationFactor,
      })

      creditData.push({
        timestamp,
        min: cpuCreditsMin,
      })

      cpuNode.x.push(timestamp)
      cpuNode.y.push((get(timeBucket, [`cpu_usage`, `max`]) || 0) * normalizationFactor * 100)

      cpuCreditsNode.x.push(timestamp)
      cpuCreditsNode.y.push(cpuCreditsMin)

      memoryPressure.x.push(timestamp)
      memoryPressure.y.push(get(timeBucket, [`old_pressure_percent`, `value`], 0))

      diskUsage.x.push(timestamp)
      diskUsage.y.push(get(timeBucket, [`disk_used_percent`, `value`], 0))
    })

    cpuUsage.push(cpuNode)
    cpuCredits.push(cpuCreditsNode)
    pressurePerNode.push(memoryPressure)
    diskUsagePerNode.push(diskUsage)
  })

  return {
    cpuUsage,
    cpuCredits,
    pressurePerNode,
    diskUsagePerNode,
  }
}

function calculateRequestMetrics(requestsPerAction) {
  const requestCounts = []
  const statsPerAction = { index: [], search: [] }

  forEach(requestsPerAction, (actionBucket) => {
    const action = actionBucket.key
    const _95ths = {
      name: `95th percentile`,
      x: [],
      y: [],
      showlegend: false,
      line: { width: 1 },
    }
    const _99ths = {
      name: `99th percentile`,
      x: [],
      y: [],
      showlegend: false,
      line: { width: 1 },
    }
    const averages = {
      name: `Average`,
      x: [],
      y: [],
      showlegend: false,
      line: { width: 1 },
    }
    const counts = {
      name: action,
      x: [],
      y: [],
      showlegend: false,
      line: { width: 1 },
    }

    forEach(actionBucket.per_interval.buckets, (timeBucket) => {
      const timestamp = new Date(timeBucket.key)

      // eslint-disable-next-line lodash/prefer-map
      forEach([_95ths, _99ths, averages, counts], (trace) => {
        trace.x.push(timestamp)
      })

      counts.y.push(get(timeBucket, [`total`, `value`], 0))
      _95ths.y.push(get(timeBucket, [`p95`, `value`], 0))
      _99ths.y.push(get(timeBucket, [`p99`, `value`], 0))
      averages.y.push(get(timeBucket, [`avg`, `value`], 0))
    })

    requestCounts.push(counts)
    statsPerAction[action] = [averages, _95ths, _99ths]
  })

  return {
    requestCounts,
    statsPerAction,
  }
}

function calculateMemoryMetrics(gcsPerNode) {
  const majorGCsPerNode = []
  forEach(gcsPerNode, (nodeBucket) => {
    const gcForNode = {
      name: nodeBucket.key.replace(/-00+/, `-0`),
      x: [],
      y: [],
      showlegend: false,
      line: { width: 1 },
      mode: `lines`,
    }

    forEach(nodeBucket.per_interval.buckets, (timeBucket) => {
      gcForNode.x.push(new Date(timeBucket.key))
      gcForNode.y.push(get(timeBucket, [`overhead_percentage`, `value`], 0))
    })

    majorGCsPerNode.push(gcForNode)
  })

  return majorGCsPerNode
}

function reduceMetrics(metrics) {
  const { cpu_metrics, request_metrics, gc_metrics } = metrics

  const cpuMetrics = calculateCpuMetrics(
    get(cpu_metrics, [`aggregations`, `per_node`, `buckets`], []),
  )

  const requestMetrics = calculateRequestMetrics(
    get(request_metrics, [`aggregations`, `per_action`, `buckets`], []),
  )

  const memoryMetrics = calculateMemoryMetrics(
    get(gc_metrics, [`aggregations`, `per_node`, `buckets`], []),
  )

  return {
    cpu: cpuMetrics,
    request: requestMetrics,
    memory: memoryMetrics,
  }
}
