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

import { getUsersUrl } from '../../lib/api/v1/urls'
import asyncRequest, { resetAsyncRequest } from '../asyncRequests'
import { EXTEND_TRIAL } from '../../constants/actions'
import { FETCH_PROFILE } from '../../apps/userconsole/constants/actions'
import { addExtendTrialToast } from '../../lib/toasts'

export function extendTrial(selectedAnswer?: string, textAreaValue?: string) {
  const url = `api/v1/users/trials/_extend`

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: EXTEND_TRIAL,
        method: `POST`,
        url,
        payload: {
          answers: {
            selectedAnswer,
            textAreaValue,
          },
        },
      }),
    ).then(() => {
      dispatch(fetchProfile())
      dispatch(addExtendTrialToast())
    })
}

const fetchProfile = () =>
  asyncRequest({
    type: FETCH_PROFILE,
    url: getUsersUrl(),
    meta: { extend_trial: true },
  })

export function resetExtendTrial() {
  return resetAsyncRequest(EXTEND_TRIAL)
}
