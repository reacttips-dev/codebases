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

import { omit } from 'lodash'
import { IpFilterRuleset } from '../../lib/api/v1/types'
import asyncRequest from '../asyncRequests'

import { UPDATE_IP_FILTER_RULESET } from '../../constants/actions'
import { updateIpFilterRulesetUrl } from '../../lib/api/v1/urls'
import { setIpFilterRuleset } from './createIpFilterRuleset'

export function updateIpFilterRuleset({
  rulesetId,
  regionId,
  payload,
}: {
  rulesetId: string
  regionId: string
  payload: IpFilterRuleset
}) {
  const url = updateIpFilterRulesetUrl({ rulesetId, regionId })
  const rulesetPayload = omit(payload, ['rulesNumber'])
  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPDATE_IP_FILTER_RULESET,
        method: `PUT`,
        url,
        payload: rulesetPayload,
        meta: { rulesetId, regionId },
      }),
    ).then((successAction) => dispatch(setIpFilterRuleset(successAction.payload.id, payload)))
}
