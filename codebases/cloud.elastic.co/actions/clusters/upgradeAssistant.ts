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

import { FETCH_DEPRECATIONS_ASSISTANT, SET_CLUSTER_VERSION } from '../../constants/actions'
import asyncRequest from '../asyncRequests'
import { getKibProxyRequestsUrl } from '../../lib/api/v1/urls'
import { diff, gte } from '../../lib/semver'

export function upgradeAssistant({ version, previousVersion, clusterId, regionId }) {
  return (dispatch) => {
    const action = {
      type: SET_CLUSTER_VERSION,
      payload: {
        value: version,
      },
    }

    if (previousVersion == null) {
      return dispatch(action)
    }

    const useMajorUpgradeRules = diff(version, previousVersion) === `major` && gte(version, `6.0.0`)

    if (!useMajorUpgradeRules) {
      return dispatch(action)
    }

    const kibanaPath = `api/upgrade_assistant/status`
    const url = getKibProxyRequestsUrl({
      clusterId,
      regionId,
      kibanaPath,
    })

    dispatch(action)

    return dispatch(
      asyncRequest({
        type: FETCH_DEPRECATIONS_ASSISTANT,
        url,
        meta: {
          regionId,
          clusterId,
          version,
        },
        crumbs: [regionId, clusterId],
        requestSettings: {
          request: {
            headers: {
              'X-Management-Request': true,
            },
          },
        },
      }),
    )
  }
}
