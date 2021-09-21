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

import { HEROKU_AUTH_HANDSHAKE } from '../../constants/actions'

import { saveToken } from '../auth'

import history from '../../lib/history'
import { resolveDeploymentUrlForEsCluster, deploymentUrl } from '../../lib/urlBuilder'
import { getHerokuHandshakeParams } from '../../lib/heroku'

import LocalStorageKey from '../../constants/localStorageKeys'

import { HerokuAuthenticationParams } from '../../types'

export const startHerokuAuthHandshake = (authParams: HerokuAuthenticationParams) => {
  const { clusterId, regionId } = authParams

  return (dispatch) => {
    dispatch(
      asyncRequest({
        type: HEROKU_AUTH_HANDSHAKE,
        method: `POST`,
        url: `api/v0/users/_sso_auth`,
        payload: getHerokuHandshakeParams(authParams),
      }),
    )
      .then((actionResult) =>
        Promise.all([
          dispatch(saveToken(actionResult.payload.token)),
          dispatch(persistHerokuCluster(regionId, clusterId)),
          dispatch(redirectToCluster(regionId, clusterId)),
        ]),
      )
      .catch(() => dispatch(clearHerokuCluster))
  }
}

function persistHerokuCluster(regionId, id) {
  return () => localStorage.setItem(LocalStorageKey.herokuCluster, JSON.stringify({ regionId, id }))
}

function clearHerokuCluster() {
  localStorage.removeItem(LocalStorageKey.herokuCluster)
}

function redirectToCluster(regionId, clusterId) {
  return () => history.replace(resolveDeploymentUrlForEsCluster(deploymentUrl, regionId, clusterId))
}
