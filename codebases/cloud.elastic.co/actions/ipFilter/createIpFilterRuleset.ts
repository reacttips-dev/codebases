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
import { CREATE_IP_FILTER_RULESET, SET_IP_FILTER_RULESET } from '../../constants/actions'
import { createIpFilterRulesetUrl } from '../../lib/api/v1/urls'

import { IpFilterRuleset } from '../../lib/api/v1/types'

export function createIpFilterRuleset({
  regionId,
  payload,
}: {
  regionId: string
  payload: IpFilterRuleset
}) {
  return (dispatch) => {
    const url = createIpFilterRulesetUrl({ regionId })
    return dispatch(
      asyncRequest({
        type: CREATE_IP_FILTER_RULESET,
        method: `POST`,
        url,
        payload,
        meta: { regionId },
      }),
    ).then((successAction) => dispatch(setIpFilterRuleset(successAction.payload.id, payload)))
  }
}

export const setIpFilterRuleset = (id: string, payload: IpFilterRuleset) => ({
  type: SET_IP_FILTER_RULESET,
  payload: {
    ...payload,
    total_associations: 0,
    id,
  },
})
