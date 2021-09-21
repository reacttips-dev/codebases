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

import {
  DELETE_ACTIVE_DIRECTORY_SECURITY_REALM,
  DELETE_LDAP_SECURITY_REALM,
  DELETE_SAML_SECURITY_REALM,
  FETCH_SECURITY_REALMS,
  REORDER_SECURITY_REALMS,
} from '../constants/actions'
import { AsyncAction, RegionId } from '../../../types'
import { SecurityRealmInfoList } from '../../../lib/api/v1/types'

export interface State {
  [regionId: string]: SecurityRealmInfoList
}

interface FetchRealms extends AsyncAction<typeof FETCH_SECURITY_REALMS, SecurityRealmInfoList> {
  meta: { regionId: RegionId }
}

interface ReorderRealms extends AsyncAction<typeof REORDER_SECURITY_REALMS> {
  meta: { regionId: RegionId }
}

interface DeleteActiveDirectoryRealm
  extends AsyncAction<typeof DELETE_ACTIVE_DIRECTORY_SECURITY_REALM> {
  meta: {
    regionId: RegionId
    realmId: string
  }
}

interface DeleteLdapRealm extends AsyncAction<typeof DELETE_LDAP_SECURITY_REALM> {
  meta: {
    regionId: RegionId
    realmId: string
  }
}

interface DeleteSamlRealm extends AsyncAction<typeof DELETE_SAML_SECURITY_REALM> {
  meta: {
    regionId: RegionId
    realmId: string
  }
}

type Action =
  | FetchRealms
  | ReorderRealms
  | DeleteActiveDirectoryRealm
  | DeleteLdapRealm
  | DeleteSamlRealm

export default function securityRealmsReducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case FETCH_SECURITY_REALMS:
      if (!action.error && action.payload) {
        return {
          ...state,
          [action.meta.regionId]: action.payload,
        }
      }

      return state

    case DELETE_ACTIVE_DIRECTORY_SECURITY_REALM:
    case DELETE_LDAP_SECURITY_REALM:
    case DELETE_SAML_SECURITY_REALM:
      if (!action.error && action.payload) {
        const { regionId, realmId } = action.meta
        const currentState = state[regionId]
        const newState = {
          ...state,
          [regionId]: {
            ...currentState,
            realms: currentState.realms.filter((realm) => realm.id !== realmId),
          },
        }
        return newState
      }

      return state

    default:
      return state
  }
}

export function getSecurityRealms(state: State, regionId: RegionId) {
  return state[regionId]
}
