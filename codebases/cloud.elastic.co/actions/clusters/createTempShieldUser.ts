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

import { genSaltSync, hashSync } from 'bcryptjs'
import moment from 'moment'

import { resetAsyncRequest, asyncRequestActions } from '../asyncRequests'
import { createTempShieldUserReqId } from '../asyncRequests/handcraftedReqIds'

import { post } from '../../lib/ajax'
import { getLink } from '../../lib/links'
import { replaceIn } from '../../lib/immutability-helpers'

import {
  CREATE_TEMP_SHIELD_USER,
  NEW_TEMP_SHIELD_USER_SUCCESS,
  RESET_TEMP_SHIELD_USER,
} from '../../constants/actions'

import { Action, ElasticsearchCluster, FoundUser, ThunkAction } from '../../types'

// FIXME: The `user` argument could have had the type `FoundUser`, except that it
// has the property `validUntil` instead of `valid_until`, which is what is
// found in a cluster's metadata. Refactoring this touches more files than
// I'm comfortable with right now, but at some point we could consider
// standardising the property naming, which would streamline the code a
// little.
const createTempShieldUserSuccess: (user: {
  username: string
  password: string
  validUntil: string
}) => Action<typeof NEW_TEMP_SHIELD_USER_SUCCESS> = (user) => ({
  type: NEW_TEMP_SHIELD_USER_SUCCESS,
  meta: {},
  payload: user,
})

export function createTempShieldUser(
  cluster: ElasticsearchCluster,
  data,
  username: string,
): ThunkAction {
  return (dispatch) => {
    const url = getLink(cluster, `data`)
    const { regionId, id } = cluster

    const { start, failed, success } = asyncRequestActions({
      type: CREATE_TEMP_SHIELD_USER,
      reqId: createTempShieldUserReqId(regionId, id),
      meta: { regionId, id },
    })

    const password = genSaltSync(10)
    const validUntil = moment().add(1, `hour`).toISOString()
    const cloudUsername = `cloud-internal-${username}`

    const hash = hashSync(password, genSaltSync(10))
    const newTempUser: FoundUser = {
      password_hash: hash,
      roles: [`superuser`],
      username: cloudUsername,
      valid_until: validUntil,
    }
    const dataWithTempUser = replaceIn(
      data,
      [`shield`, `found_users`, newTempUser.username],
      newTempUser,
    )

    dispatch(createTempShieldUserSuccess({ username: cloudUsername, password, validUntil }))
    dispatch(start())
    return post(url, dataWithTempUser).then(
      (response) => dispatch(success(response.body)),
      (error) => dispatch(failed(error)),
    )
  }
}

export const resetCreateTempShieldUserStatus = (...crumbs: string[]) =>
  resetAsyncRequest(CREATE_TEMP_SHIELD_USER, crumbs)

export const resetTempShieldUser: () => Action<typeof RESET_TEMP_SHIELD_USER> = () => ({
  type: RESET_TEMP_SHIELD_USER,
  meta: {},
})
