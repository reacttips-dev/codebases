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

import { filter, omit } from 'lodash'
import asyncRequest from '../asyncRequests'
import { DELETE_IP_FILTER_RULE } from '../../constants/actions'
import { updateIpFilterRulesetUrl } from '../../lib/api/v1/urls'
import { setIpFilterRuleset } from './createIpFilterRuleset'

import { IpFilterRuleset } from '../../lib/api/v1/types'

export function deleteIpFilterRule({
  regionId,
  ruleId,
  ruleset,
}: {
  regionId: string
  ruleId: string
  ruleset: IpFilterRuleset
}) {
  const url = updateIpFilterRulesetUrl({ rulesetId: ruleset.id!, regionId })
  const rules = filter(ruleset.rules, (rule) => rule.id !== ruleId)

  const pickedRuleset = omit(ruleset, ['rulesNumber']) as IpFilterRuleset

  const rulesetPayload = {
    ...pickedRuleset,
    rules,
  }

  return (dispatch) => {
    if (ruleset.id == null) {
      return Promise.resolve()
    }

    return dispatch(
      asyncRequest({
        type: DELETE_IP_FILTER_RULE,
        method: `PUT`,
        url,
        payload: rulesetPayload,
        meta: { ruleId, regionId },
        crumbs: [ruleset.id!],
      }),
    ).then((successAction) =>
      dispatch(setIpFilterRuleset(successAction.payload.id, rulesetPayload)),
    )
  }
}
