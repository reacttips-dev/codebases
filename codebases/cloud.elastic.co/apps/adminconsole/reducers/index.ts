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

import { Action, RegionId } from '../../../types'

import securityRealms, * as fromSecurityRealms from './securityRealms'
import securityCluster, * as fromSecurityCluster from './securityCluster'
import activeDirectoryAuthProviders, * as fromActiveDirectoryAuthProviders from './activeDirectoryAuthProviders'
import ldapAuthProviders, * as fromLdapAuthProviders from './ldapAuthProviders'
import samlAuthProviders, * as fromSamlAuthProviders from './samlAuthProviders'
import runnerSearch, * as fromRunnerSearch from './runnerSearch'

/** Represents all the available adminconsole-specific Redux state */
export type AdminconsoleState = {
  activeDirectoryAuthProviders: fromActiveDirectoryAuthProviders.State
  ldapAuthProviders: fromLdapAuthProviders.State
  runnerSearch: fromRunnerSearch.State
  samlAuthProviders: fromSamlAuthProviders.State
  securityRealms: fromSecurityRealms.State
  securityCluster: fromSecurityCluster.State
}

// A type that ensures that we have an appropriate reducer for each key in our
// combined state type.
type AdminconsoleReducer = {
  [T in keyof AdminconsoleState]: (
    state: AdminconsoleState[T] | undefined,
    action: Action<any>,
  ) => AdminconsoleState[T]
}

const adminconsoleReducer: AdminconsoleReducer = {
  activeDirectoryAuthProviders,
  ldapAuthProviders,
  runnerSearch,
  samlAuthProviders,
  securityRealms,
  securityCluster,
}

export default adminconsoleReducer

export const getActiveDirectoryAuthProvider = (
  state: AdminconsoleState,
  regionId: RegionId,
  realmId: string,
) =>
  fromActiveDirectoryAuthProviders.getActiveDirectoryAuthProvider(
    state.activeDirectoryAuthProviders,
    regionId,
    realmId,
  )

export const getLdapAuthProvider = (
  state: AdminconsoleState,
  regionId: RegionId,
  realmId: string,
) => fromLdapAuthProviders.getLdapAuthProvider(state.ldapAuthProviders, regionId, realmId)

export const getSamlAuthProvider = (
  state: AdminconsoleState,
  regionId: RegionId,
  realmId: string,
) => fromSamlAuthProviders.getSamlAuthProvider(state.samlAuthProviders, regionId, realmId)

export const getSecurityRealms = (state: AdminconsoleState, regionId: RegionId) =>
  fromSecurityRealms.getSecurityRealms(state.securityRealms, regionId)

export const getSecurityCluster = (state: AdminconsoleState, regionId: RegionId) =>
  fromSecurityCluster.getSecurityCluster(state.securityCluster, regionId)

export const getRunnerSearchResults = (
  state: AdminconsoleState,
  regionId: RegionId,
  queryId: string,
) => fromRunnerSearch.getRunnerSearchResults(state.runnerSearch, regionId, queryId)

export * from './registry'
