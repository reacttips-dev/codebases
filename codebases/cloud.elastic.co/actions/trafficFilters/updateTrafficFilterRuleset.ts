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

import asyncRequest from '../asyncRequests'

import { UPDATE_TRAFFIC_FILTER_RULESET } from '../../constants/actions'

import { fetchTrafficFilterRuleset } from './fetchTrafficFilterRuleset'

import { updateTrafficFilterRulesetUrl } from '../../lib/api/v1/urls'

import { TrafficFilterRulesetRequest } from '../../lib/api/v1/types'

export function updateTrafficFilterRuleset({
  regionId,
  rulesetId,
  ruleset,
}: {
  rulesetId: string
  regionId: string
  ruleset: TrafficFilterRulesetRequest
}) {
  const url = updateTrafficFilterRulesetUrl({ rulesetId })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPDATE_TRAFFIC_FILTER_RULESET,
        method: `PUT`,
        url,
        payload: ruleset,
        meta: { regionId, rulesetId },
        crumbs: [regionId, rulesetId],
      }),
    ).then((actionResult) => {
      dispatch(fetchTrafficFilterRuleset({ regionId, rulesetId: actionResult.payload.id }))
    })
}
