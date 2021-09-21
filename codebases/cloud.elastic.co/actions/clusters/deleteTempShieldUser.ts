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

import { DELETE_TEMP_SHIELD_USER } from '../../constants/actions'

import { resetAsyncRequest, asyncRequestActions } from '../asyncRequests'
import { deleteTempShieldUserReqId } from '../asyncRequests/handcraftedReqIds'

import { post } from '../../lib/ajax'
import { getLink } from '../../lib/links'
import { updateIn } from '../../lib/immutability-helpers'

import { ElasticsearchCluster, FoundUser } from '../../types'

export function deleteTempShieldUser(cluster: ElasticsearchCluster, data: any, user: FoundUser) {
  return (dispatch) => {
    const url = getLink(cluster, `data`)
    const { regionId, id } = cluster

    const { start, failed, success } = asyncRequestActions({
      type: DELETE_TEMP_SHIELD_USER,
      reqId: deleteTempShieldUserReqId(regionId, id),
      meta: { regionId, id, username: user.username },
    })

    const dataWithoutUser = updateIn(
      data,
      [`shield`, `found_users`],
      (users: { [key: string]: FoundUser }) => omit(users, user.username),
    )

    dispatch(start())
    return post(url, dataWithoutUser).then(
      (response) => dispatch(success(response.body)),
      (error) => dispatch(failed(error)),
    )
  }
}

export const resetDeleteTempShieldUserStatus = (...crumbs) =>
  resetAsyncRequest(DELETE_TEMP_SHIELD_USER, crumbs)
