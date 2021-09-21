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

import asyncRequest from '../../../../actions/asyncRequests'
import { ThunkAction } from '../../../../types'
import { getConfigForKey } from '../../../../selectors'
import { FETCH_INTERCOM_DATA } from '../../constants/actions'

export function fetchIntercomData(): ThunkAction {
  return (dispatch, getState) => {
    const intercomUrl = getConfigForKey(getState(), 'INTERCOM_URL')
    const intercomData = getConfigForKey(getState(), 'INTERCOM_DATA')
    const url = `${intercomUrl}/${intercomData}`
    return dispatch(
      asyncRequest({
        type: FETCH_INTERCOM_DATA,
        method: `GET`,
        url,
      }),
    )
  }
}
