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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import {
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  FETCH_ORGANIZATION,
  FETCH_ORGANIZATIONS,
  DELETE_ORGANIZATION,
  CREATE_ORGANIZATION_INVITATION,
  FETCH_ORGANIZATION_INVITATIONS,
  DELETE_ORGANIZATION_INVITATIONS,
  CREATE_ORGANIZATION_MEMBERSHIP,
  FETCH_ORGANIZATION_MEMBERSHIPS,
  DELETE_ORGANIZATION_MEMBERSHIPS,
} from '../../constants/actions'

import {
  getOrganizationUrl,
  listOrganizationsUrl,
  deleteOrganizationUrl,
  updateOrganizationUrl,
  createOrganizationUrl,
  listOrganizationInvitationsUrl,
  deleteOrganizationInvitationsUrl,
  createOrganizationInvitationUrl,
  listOrganizationMembersUrl,
  deleteOrganizationMembershipsUrl,
  createOrganizationMembershipUrl,
} from '../../lib/api/v1/urls'

import {
  OrganizationRequest,
  OrganizationInvitationRequest,
  OrganizationMembershipRequest,
} from '../../lib/api/v1/types'

export function fetchOrganizations() {
  const url = listOrganizationsUrl()

  return asyncRequest({
    type: FETCH_ORGANIZATIONS,
    method: `GET`,
    url,
  })
}

export function fetchOrganization({ organizationId }: { organizationId: string }) {
  const url = getOrganizationUrl({ organizationId })

  return asyncRequest({
    type: FETCH_ORGANIZATION,
    method: `GET`,
    url,
    meta: { organizationId },
    crumbs: [organizationId],
  })
}

export function updateOrganization({
  organizationId,
  organization,
}: {
  organizationId: string
  organization: OrganizationRequest
}) {
  const url = updateOrganizationUrl({ organizationId })

  return asyncRequest({
    type: UPDATE_ORGANIZATION,
    method: `PUT`,
    url,
    meta: { organizationId },
    crumbs: [organizationId],
    payload: organization,
  })
}

export function deleteOrganization({ organizationId }: { organizationId: string }) {
  const url = deleteOrganizationUrl({ organizationId })

  return asyncRequest({
    type: DELETE_ORGANIZATION,
    method: `DELETE`,
    url,
    meta: { organizationId },
    crumbs: [organizationId],
  })
}

export function createOrganization({ name }: { name?: string }) {
  const url = createOrganizationUrl()

  const payload: OrganizationRequest = {
    name,
  }

  return asyncRequest({
    type: CREATE_ORGANIZATION,
    method: `POST`,
    url,
    payload,
  })
}

export function fetchOrganizationInvitations({ organizationId }: { organizationId: string }) {
  const url = listOrganizationInvitationsUrl({ organizationId })

  return asyncRequest({
    type: FETCH_ORGANIZATION_INVITATIONS,
    method: `GET`,
    url,
    meta: { organizationId },
    crumbs: [organizationId],
  })
}

export function createOrganizationInvitation({
  organizationId,
  email,
}: {
  organizationId: string
  email: string
}) {
  const url = createOrganizationInvitationUrl({ organizationId })

  const payload: OrganizationInvitationRequest = {
    email,
  }

  return asyncRequest({
    type: CREATE_ORGANIZATION_INVITATION,
    method: `POST`,
    url,
    meta: { organizationId, email },
    crumbs: [organizationId, email],
    payload,
  })
}

export function deleteOrganizationInvitations({
  organizationId,
  tokens,
}: {
  organizationId: string
  tokens: string[]
}) {
  const concatenatedTokens = tokens.join(',')
  const url = deleteOrganizationInvitationsUrl({
    organizationId,
    invitationTokens: concatenatedTokens,
  })

  return asyncRequest({
    type: DELETE_ORGANIZATION_INVITATIONS,
    method: `DELETE`,
    url,
    meta: { organizationId, tokens },
    crumbs: [organizationId, concatenatedTokens],
  })
}

export function fetchOrganizationMemberships({ organizationId }: { organizationId: string }) {
  const url = listOrganizationMembersUrl({ organizationId })

  return asyncRequest({
    type: FETCH_ORGANIZATION_MEMBERSHIPS,
    method: `GET`,
    url,
    meta: { organizationId },
    crumbs: [organizationId],
  })
}

export function createOrganizationMembership({
  organizationId,
  userId,
}: {
  organizationId: string
  userId: string
}) {
  const url = createOrganizationMembershipUrl({ organizationId })

  const payload: OrganizationMembershipRequest = {
    user_id: userId,
  }

  return asyncRequest({
    type: CREATE_ORGANIZATION_MEMBERSHIP,
    method: `POST`,
    url,
    meta: { organizationId, userId },
    crumbs: [organizationId, userId],
    payload,
  })
}

export function deleteOrganizationMemberships({
  organizationId,
  userIds,
}: {
  organizationId: string
  userIds: string[]
}) {
  const concatenatedUserIds = userIds.join(',')
  const url = deleteOrganizationMembershipsUrl({ organizationId, userIds: concatenatedUserIds })

  return asyncRequest({
    type: DELETE_ORGANIZATION_MEMBERSHIPS,
    method: `DELETE`,
    url,
    meta: { organizationId, userIds },
    crumbs: [organizationId, concatenatedUserIds],
  })
}

export const resetFetchOrganizations = (...crumbs: string[]) =>
  resetAsyncRequest(FETCH_ORGANIZATIONS, crumbs)

export const resetFetchOrganization = (...crumbs: string[]) =>
  resetAsyncRequest(FETCH_ORGANIZATION, crumbs)

export const resetCreateOrganization = (...crumbs: string[]) =>
  resetAsyncRequest(CREATE_ORGANIZATION, crumbs)

export const resetUpdateOrganization = (...crumbs: string[]) =>
  resetAsyncRequest(UPDATE_ORGANIZATION, crumbs)

export const resetDeleteOrganization = (...crumbs: string[]) =>
  resetAsyncRequest(DELETE_ORGANIZATION, crumbs)

export const resetFetchOrganizationInvitations = (...crumbs: string[]) =>
  resetAsyncRequest(FETCH_ORGANIZATION_INVITATIONS, crumbs)

export const resetCreateOrganizationInvitation = (...crumbs: string[]) =>
  resetAsyncRequest(CREATE_ORGANIZATION_INVITATION, crumbs)

export const resetDeleteOrganizationInvitations = (...crumbs: string[]) =>
  resetAsyncRequest(DELETE_ORGANIZATION_INVITATIONS, crumbs)

export const resetFetchOrganizationMemberships = (...crumbs: string[]) =>
  resetAsyncRequest(FETCH_ORGANIZATION_MEMBERSHIPS, crumbs)

export const resetCreateOrganizationMembership = (...crumbs: string[]) =>
  resetAsyncRequest(CREATE_ORGANIZATION_MEMBERSHIP, crumbs)

export const resetDeleteOrganizationMemberships = (...crumbs: string[]) =>
  resetAsyncRequest(DELETE_ORGANIZATION_MEMBERSHIPS, crumbs)
