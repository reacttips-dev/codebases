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

import { IpFilterRule, IpFilterRuleset } from '../../lib/api/v1/types'

import asyncRequest from '../asyncRequests'
import { CREATE_IP_FILTER_RULE } from '../../constants/actions'
import { updateIpFilterRulesetUrl } from '../../lib/api/v1/urls'
import { setIpFilterRuleset } from './createIpFilterRuleset'
import { fetchIpFilterRuleset } from './fetchIpFilterRuleset'

export function createIpFilterRule({
  regionId,
  rule,
  ruleset,
}: {
  regionId: string
  rule: IpFilterRule
  ruleset: IpFilterRuleset
}) {
  const rulesetPayload = {
    ...ruleset,
    rules: [
      ...ruleset.rules,
      {
        ...rule,
      },
    ],
  }

  const url = updateIpFilterRulesetUrl({ rulesetId: ruleset.id!, regionId })

  return (dispatch) => {
    if (ruleset.id == null) {
      return Promise.resolve()
    }

    return dispatch(
      asyncRequest({
        type: CREATE_IP_FILTER_RULE,
        method: `PUT`,
        url,
        payload: rulesetPayload,
        meta: { regionId },
        crumbs: [ruleset.id!],
      }),
    )
      .then((successAction) =>
        dispatch(setIpFilterRuleset(successAction.payload.id, rulesetPayload)),
      )
      .then((successAction) =>
        dispatch(fetchIpFilterRuleset({ rulesetId: successAction.payload.id, regionId })),
      )
  }
}
