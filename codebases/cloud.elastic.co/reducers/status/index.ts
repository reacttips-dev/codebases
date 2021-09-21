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

import { FETCH_CLOUD_STATUS } from '../../constants/actions'
import { AsyncAction } from '../../types'
import { Summary } from '../../lib/api/v1/types'

export type State = Summary

type FetchCloudStatusAction = AsyncAction<typeof FETCH_CLOUD_STATUS, Summary>

const initialState: State = {
  status: {
    indicator: ``,
    description: ``,
  },
  incidents: [],
}

export default function cloudStatusReducer(
  state: State = initialState,
  action: FetchCloudStatusAction,
): State {
  if (action.type === FETCH_CLOUD_STATUS) {
    if (!action.error && action.payload) {
      return {
        ...state,
        ...action.payload,
      }
    }
  }

  return state
}

export function getCloudStatus(state: State) {
  return state
}
