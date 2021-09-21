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

import { findIndex, omit } from 'lodash'
import asyncRequest from '../asyncRequests'
import { IpFilterRule, IpFilterRuleset } from '../../lib/api/v1/types'

import { UPDATE_IP_FILTER_RULE } from '../../constants/actions'
import { updateIpFilterRulesetUrl } from '../../lib/api/v1/urls'
import { setIpFilterRuleset } from './createIpFilterRuleset'

export function updateIpFilterRule({
  regionId,
  rule,
  ruleset,
}: {
  regionId: string
  rule: IpFilterRule
  ruleset: IpFilterRuleset
}) {
  return (dispatch) => {
    if (ruleset.id == null) {
      return
    }

    const url = updateIpFilterRulesetUrl({ rulesetId: ruleset.id, regionId })
    const rulesetPayload = omit(ruleset, ['rulesNumber'])
    const ruleIndex = findIndex(ruleset.rules, (el) => el.id === rule.id)
    ruleset.rules.splice(ruleIndex, 1, rule)

    return dispatch(
      asyncRequest({
        type: UPDATE_IP_FILTER_RULE,
        method: `PUT`,
        url,
        payload: rulesetPayload,
        meta: { ruleId: rule.id, regionId },
        crumbs: [rule.id!],
      }),
    ).then((successAction) => dispatch(setIpFilterRuleset(successAction.payload.id, ruleset)))
  }
}
