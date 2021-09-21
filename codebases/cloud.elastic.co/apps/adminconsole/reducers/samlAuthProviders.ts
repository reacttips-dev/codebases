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

import { FETCH_SAML_SETTINGS } from '../constants/actions'

import { SamlSettings } from '../../../lib/api/v1/types'
import { AsyncAction, RegionId } from '../../../types'

export interface State {
  [id: string]: SamlSettings
}

interface FetchSamlProvider extends AsyncAction<typeof FETCH_SAML_SETTINGS, SamlSettings> {
  meta: {
    regionId: RegionId
    realmId: string
  }
}

type Action = FetchSamlProvider

export default function samlAuthProvidersReducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case FETCH_SAML_SETTINGS:
      if (!action.error && action.payload) {
        const { regionId, realmId } = action.meta
        return {
          ...state,
          [`${regionId}/${realmId}`]: action.payload,
        }
      }

      return state

    default:
      return state
  }
}

export function getSamlAuthProvider(
  state: State,
  regionId: RegionId,
  realmId: string,
): SamlSettings | undefined {
  return state[`${regionId}/${realmId}`]
}
