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

import { getAsyncRequestState } from '../../../reducers/asyncRequests'
import * as actions from '../constants/actions'

export const fetchSecurityRealmsRequest = getAsyncRequestState(actions.FETCH_SECURITY_REALMS)
export const reorderSecurityRealmsRequest = getAsyncRequestState(actions.REORDER_SECURITY_REALMS)
export const fetchSecurityClusterRequest = getAsyncRequestState(actions.FETCH_SECURITY_CLUSTER)
export const createSecurityClusterRequest = getAsyncRequestState(actions.CREATE_SECURITY_CLUSTER)
export const enableSecurityClusterRequest = getAsyncRequestState(actions.ENABLE_SECURITY_CLUSTER)

export const fetchActiveDirectorySecurityRealmRequest = getAsyncRequestState(
  actions.FETCH_ACTIVE_DIRECTORY_SETTINGS,
)
export const createActiveDirectorySecurityRealmRequest = getAsyncRequestState(
  actions.CREATE_ACTIVE_DIRECTORY_SECURITY_REALM,
)
export const updateActiveDirectorySecurityRealmRequest = getAsyncRequestState(
  actions.UPDATE_ACTIVE_DIRECTORY_SECURITY_REALM,
)
export const deleteActiveDirectorySecurityRealmRequest = getAsyncRequestState(
  actions.DELETE_ACTIVE_DIRECTORY_SECURITY_REALM,
)

export const fetchLdapSecurityRealmRequest = getAsyncRequestState(actions.FETCH_LDAP_SETTINGS)
export const createLdapSecurityRealmRequest = getAsyncRequestState(
  actions.CREATE_LDAP_SECURITY_REALM,
)
export const updateLdapSecurityRealmRequest = getAsyncRequestState(
  actions.UPDATE_LDAP_SECURITY_REALM,
)
export const deleteLdapSecurityRealmRequest = getAsyncRequestState(
  actions.DELETE_LDAP_SECURITY_REALM,
)

export const fetchSamlSecurityRealmRequest = getAsyncRequestState(actions.FETCH_SAML_SETTINGS)
export const createSamlSecurityRealmRequest = getAsyncRequestState(
  actions.CREATE_SAML_SECURITY_REALM,
)
export const updateSamlSecurityRealmRequest = getAsyncRequestState(
  actions.UPDATE_SAML_SECURITY_REALM,
)
export const deleteSamlSecurityRealmRequest = getAsyncRequestState(
  actions.DELETE_SAML_SECURITY_REALM,
)
