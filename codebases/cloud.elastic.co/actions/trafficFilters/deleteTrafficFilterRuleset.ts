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

import { DELETE_TRAFFIC_FILTER_RULESET } from '../../constants/actions'

import { deleteTrafficFilterRulesetUrl } from '../../lib/api/v1/urls'

export function deleteTrafficFilterRuleset({
  regionId,
  rulesetId,
  ignoreAssociations = false,
}: {
  regionId: string
  rulesetId: string
  ignoreAssociations?: boolean
}) {
  const url = deleteTrafficFilterRulesetUrl({ rulesetId, ignoreAssociations })

  return asyncRequest({
    type: DELETE_TRAFFIC_FILTER_RULESET,
    method: `DELETE`,
    url,
    meta: { regionId, rulesetId },
    crumbs: [regionId, rulesetId],
  })
}
