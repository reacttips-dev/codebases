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

import { asyncRequestActions } from '../asyncRequests'
import { enableTwoFactorReqId } from '../asyncRequests/handcraftedReqIds'

import { post } from '../../lib/ajax'
import { getLink } from '../../lib/links'

import { ENABLE_TWO_FACTOR_AUTH } from '../../constants/actions'
import { RootConfig, ThunkAction } from '../../types'

export function enableTwoFactorAuth(
  root: RootConfig,
  token: string,
  secret: Uint8Array,
): ThunkAction {
  return (dispatch) => {
    const url = getLink(root, `enable-two-factor`)

    const { start, failed, success } = asyncRequestActions({
      type: ENABLE_TWO_FACTOR_AUTH,
      reqId: enableTwoFactorReqId(),
    })

    dispatch(start())
    return post(url, { token, secret }).then(
      (response) => dispatch(success(response.body)),
      (error) => dispatch(failed(error)),
    )
  }
}
