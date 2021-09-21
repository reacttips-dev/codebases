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

import { endsWith } from 'lodash'
import { FETCH_LOGS } from '../../constants/actions'
import { ElasticsearchLogMessage, FetchLogsAction, LogsApiResponse, State } from './logTypes'
import { ElasticsearchId, RegionId } from '../../../../types'

function mapFields(_id, fields): ElasticsearchLogMessage {
  // search is direct from ES and while the timestamp is UTC time, it's not
  // always UTC format -- so correct that here
  let timestamp = fields[`@timestamp`][0]

  if (!endsWith(timestamp, `Z`)) {
    timestamp = timestamp + `Z`
  }

  return {
    _id,
    instanceId:
      parseInt(fields.instance_name[0].replace(/^(?:instance|tiebreaker)-0*/, ``), 10) || 0,
    instanceName: fields.instance_name[0].replace(/^(?:instance|tiebreaker)-/, ``),
    isTiebreaker: /^tiebreaker/.test(fields.instance_name[0]),
    level: fields.level[0],
    timestamp: new Date(timestamp),
    loggerName: getLoggerName(fields),
    clusterName: fields.cluster_name[0],
    zone: fields[`instance_data.logical_zone_name`][0],
    shortMessage: fields.short_message[0],
  }
}

function getLoggerName(fields) {
  if (fields.loggerName != null) {
    return fields.loggerName[0]
  } else if (fields.logger != null) {
    return fields.logger[0]
  }

  return ``
}

function reduceLogs(body: LogsApiResponse) {
  return {
    total: {
      value: body.hits.total.value,
      relation: body.hits.total.relation,
    },
    entries: body.hits.hits.map((hit) => mapFields(hit._id, hit.fields)),
  }
}

export default function logsReducer(state: State = {}, action: FetchLogsAction): State {
  if (action.type === FETCH_LOGS) {
    if (action.error == null && action.payload != null) {
      const payload = action.payload
      const { regionId, clusterId, etag } = action.meta

      const key = `${regionId}/${clusterId}`
      const currentLogState = state[key]

      if (currentLogState != null && currentLogState.etag === etag) {
        return state
      }

      return {
        ...state,
        [key]: {
          ...currentLogState,
          etag,
          logs: reduceLogs(payload),
        },
      }
    }
  }

  return state
}

export function getLogs(state: any, regionId: RegionId, clusterId: ElasticsearchId) {
  const logsState = (state.logs as State)[`${regionId}/${clusterId}`]
  return logsState == null ? null : logsState.logs
}
