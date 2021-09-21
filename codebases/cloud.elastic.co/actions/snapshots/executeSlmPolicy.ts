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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { EXECUTE_SLM_POLICY } from '../../constants/actions'

import { putEsProxyRequestsUrl } from '../../lib/api/v1/urls'

import { ThunkAction } from '../../types'
import { ElasticsearchResourceInfo } from '../../lib/api/v1/types'

const policyName = `cloud-snapshot-policy`
const headers = {
  'X-Management-Request': true, // For v0 API
  Accept: `*/*`,
}

export function executeSlmPolicy(resource: ElasticsearchResourceInfo): ThunkAction {
  return (dispatch) => {
    const { region: regionId, id: clusterId } = resource
    const url = putEsProxyRequestsUrl({
      clusterId,
      regionId,
      elasticsearchPath: `_slm/policy/${policyName}/_execute`,
    })

    const req = dispatch(
      asyncRequest({
        type: EXECUTE_SLM_POLICY,
        method: `PUT`,
        url,
        meta: { clusterId, regionId },
        crumbs: [clusterId, regionId],
        requestSettings: {
          request: {
            headers,
          },
        },
      }),
    )

    return req
  }
}

export function resetExecuteSlmPolicyRequest(...crumbs) {
  return resetAsyncRequest(EXECUTE_SLM_POLICY, crumbs)
}
