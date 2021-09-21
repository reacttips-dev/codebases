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

import { FETCH_AUTH_METHODS } from '../constants/actions'

import { isFeatureActivated, getConfigForKey } from '../store'

import Feature from '../lib/feature'

import { RegionId } from '../types'
import { AvailableAuthenticationMethods } from '../lib/api/v1/types'

export type State = AvailableAuthenticationMethods | null

type Action = {
  type: string
  meta: {
    regionId: RegionId
  }
  error?: boolean
  payload?: AvailableAuthenticationMethods
}

export default function authMethodsReducer(state: State = null, action: Action): State {
  if (action.type === FETCH_AUTH_METHODS) {
    if (!action.error && action.payload) {
      // < HACK UNTIL EVERY ENVIRONMENT HAS `sso_methods` DEPLOYED ON IT. REMOVE LATER >
      if (!Array.isArray(action.payload.sso_methods)) {
        const oauthActivated = isFeatureActivated(Feature.oauth)
        const oauthUrl = getConfigForKey(`OAUTH_URL`)

        if (oauthActivated && oauthUrl) {
          return {
            ...action.payload,
            sso_methods: [
              {
                sso_type: oauthUrl.includes(`saml`) ? `saml` : `openid`,
                url: oauthUrl,
                name: `Single Sign-On`,
              },
            ],
          }
        }
      }

      // </ HACK UNTIL EVERY ENVIRONMENT HAS `sso_methods` DEPLOYED ON IT. REMOVE LATER >

      return action.payload
    }
  }

  return state
}
