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

import { keyBy, omit } from 'lodash'

import {
  CREATE_ORGANIZATION,
  FETCH_ORGANIZATION,
  DELETE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  FETCH_ORGANIZATIONS,
  CREATE_ORGANIZATION_INVITATION,
  DELETE_ORGANIZATION_INVITATIONS,
  FETCH_ORGANIZATION_INVITATIONS,
  CREATE_ORGANIZATION_MEMBERSHIP,
  DELETE_ORGANIZATION_MEMBERSHIPS,
  FETCH_ORGANIZATION_MEMBERSHIPS,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncAction } from '../../types'
import {
  Organization,
  Organizations,
  OrganizationInvitation,
  OrganizationInvitations,
  OrganizationMembership,
  OrganizationMemberships,
} from '../../lib/api/v1/types'

type OrganizationsById = {
  [organizationId: string]: Organization
}

type OrganizationInvitationsByOrganizationId = {
  [organizationId: string]: OrganizationInvitations
}

type OrganizationMembershipsByOrganizationId = {
  [organizationId: string]: OrganizationMemberships
}

export interface State {
  organizations: OrganizationsById
  organizationInvitations: OrganizationInvitationsByOrganizationId
  organizationMemberships: OrganizationMembershipsByOrganizationId
}

const initialState: State = {
  organizations: {},
  organizationInvitations: {},
  organizationMemberships: {},
}

interface CreateOrganizationInvitationAction
  extends AsyncAction<typeof CREATE_ORGANIZATION_INVITATION, OrganizationInvitation> {
  meta: { organizationId: string; email: string }
}

interface CreateOrganizationMembershipAction
  extends AsyncAction<typeof CREATE_ORGANIZATION_MEMBERSHIP, OrganizationMembership> {
  meta: { organizationId: string; userId: string }
}

interface DeleteOrganizationAction extends AsyncAction<typeof DELETE_ORGANIZATION> {
  meta: { organizationId: string }
}

interface DeleteOrganizationInvitationsAction
  extends AsyncAction<typeof DELETE_ORGANIZATION_INVITATIONS> {
  meta: { organizationId: string; tokens: string }
}

interface DeleteOrganizationMembershipsAction
  extends AsyncAction<typeof DELETE_ORGANIZATION_MEMBERSHIPS> {
  meta: { organizationId: string; userIds: string }
}

interface FetchOrganizationInvitationsAction
  extends AsyncAction<typeof FETCH_ORGANIZATION_INVITATIONS, OrganizationInvitations> {
  meta: { organizationId: string }
}

interface FetchOrganizationMembershipsAction
  extends AsyncAction<typeof FETCH_ORGANIZATION_MEMBERSHIPS, OrganizationMemberships> {
  meta: { organizationId: string }
}

interface FetchOrganizationsAction extends AsyncAction<typeof FETCH_ORGANIZATIONS, Organizations> {}

interface FetchOrUpsertOrganizationAction
  extends AsyncAction<
    typeof FETCH_ORGANIZATION | typeof CREATE_ORGANIZATION | typeof UPDATE_ORGANIZATION,
    Organization
  > {}

type Action =
  | CreateOrganizationInvitationAction
  | CreateOrganizationMembershipAction
  | DeleteOrganizationAction
  | DeleteOrganizationInvitationsAction
  | DeleteOrganizationMembershipsAction
  | FetchOrganizationInvitationsAction
  | FetchOrganizationMembershipsAction
  | FetchOrganizationsAction
  | FetchOrUpsertOrganizationAction

export default function organizationsReducer(state: State = initialState, action: Action): State {
  if (action.type === FETCH_ORGANIZATIONS) {
    if (action.payload && !action.error) {
      return replaceIn(state, ['organizations'], keyBy(action.payload.organizations, 'id'))
    }
  }

  if (
    action.type === FETCH_ORGANIZATION ||
    action.type === CREATE_ORGANIZATION ||
    action.type === UPDATE_ORGANIZATION
  ) {
    if (action.payload && !action.error) {
      return replaceIn(state, ['organizations', action.payload.id], action.payload)
    }
  }

  if (action.type === DELETE_ORGANIZATION) {
    if (action.payload && !action.error) {
      return replaceIn(
        state,
        ['organizations'],
        omit(state.organizations, action.meta.organizationId),
      )
    }
  }

  if (action.type === FETCH_ORGANIZATION_INVITATIONS) {
    if (action.payload && !action.error) {
      return replaceIn(
        state,
        ['organizationInvitations', action.meta.organizationId],
        action.payload,
      )
    }
  }

  if (action.type === FETCH_ORGANIZATION_MEMBERSHIPS) {
    if (action.payload && !action.error) {
      return replaceIn(
        state,
        ['organizationMemberships', action.meta.organizationId],
        action.payload,
      )
    }
  }

  if (action.type === CREATE_ORGANIZATION_INVITATION) {
    if (action.payload && !action.error) {
      const {
        meta: { organizationId },
        payload,
      } = action

      const {
        organizationInvitations: { [organizationId]: { invitations: prevInvitations = [] } = {} },
      } = state

      const invitations = [...prevInvitations, payload]

      return replaceIn(
        state,
        ['organizationInvitations', organizationId, 'invitations'],
        invitations,
      )
    }
  }

  if (action.type === CREATE_ORGANIZATION_MEMBERSHIP) {
    if (action.payload && !action.error) {
      const {
        meta: { organizationId },
        payload,
      } = action

      const {
        organizationMemberships: { [organizationId]: { members: prevMembers = [] } = {} },
      } = state

      const members = [...prevMembers, payload]

      return replaceIn(state, ['organizationMemberships', organizationId, 'members'], members)
    }
  }

  if (action.type === DELETE_ORGANIZATION_INVITATIONS) {
    if (action.payload && !action.error) {
      const {
        meta: { organizationId, tokens },
      } = action

      const {
        organizationInvitations: { [organizationId]: { invitations: prevInvitations = [] } = {} },
      } = state

      const invitations = prevInvitations.filter(({ token }) => !tokens.includes(token))

      return replaceIn(
        state,
        ['organizationInvitations', organizationId, 'invitations'],
        invitations,
      )
    }
  }

  if (action.type === DELETE_ORGANIZATION_MEMBERSHIPS) {
    if (action.payload && !action.error) {
      const {
        meta: { organizationId, userIds },
      } = action

      const {
        organizationMemberships: { [organizationId]: { members: prevMembers = [] } = {} },
      } = state

      const members = prevMembers.filter(({ user_id }) => !userIds.includes(user_id))

      return replaceIn(state, ['organizationMemberships', organizationId, 'members'], members)
    }
  }

  return state
}

export function getOrganizations(state: State): OrganizationsById {
  return state.organizations
}

export function getOrganization(state: State, organizationId: string): Organization | undefined {
  return state.organizations[organizationId]
}

export function getOrganizationInvitations(
  state: State,
  organizationId: string,
): OrganizationInvitation[] | undefined {
  return state.organizationInvitations[organizationId]?.invitations
}

export function getOrganizationMembers(
  state: State,
  organizationId: string,
): OrganizationMembership[] | undefined {
  return state.organizationMemberships[organizationId]?.members
}
