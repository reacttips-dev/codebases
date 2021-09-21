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

import { FETCH_IP_FILTER_RULESETS } from '../../constants/actions'
import { getIpFilterRulesetsUrl } from '../../lib/api/v1/urls'

export function fetchIpFilterRulesets({
  regionId,
  includeAssociations = true,
}: {
  regionId: string
  includeAssociations?: boolean
}) {
  const url = getIpFilterRulesetsUrl({ regionId, includeAssociations })
  return asyncRequest({
    type: FETCH_IP_FILTER_RULESETS,
    method: `GET`,
    url,
    meta: { regionId },
    crumbs: [regionId],
  })
}
