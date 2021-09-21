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

import { get } from 'lodash'
import { ProfileState } from '../types'

interface GetUsernameParams {
  isHeroku: boolean
  profile: ProfileState
  userIdFromToken: string | null
  usernameFromToken: string | null
}

export function getUsername({
  isHeroku,
  profile,
  usernameFromToken,
  userIdFromToken,
}: GetUsernameParams): string | null {
  const herokuEmail = get(profile, [`data`, `heroku`, `owner_email`])

  if (isHeroku && herokuEmail) {
    return herokuEmail
  }

  const username =
    (profile && (profile.email || profile.user_id)) || usernameFromToken || userIdFromToken || null

  if (!username) {
    return null
  }

  return String(username)
}

export function isSupportPortal(profile: NonNullable<ProfileState>): boolean {
  const { oktaApplications = [] } = profile

  const isSupportPortalUser = oktaApplications.some(
    (application) => application === `support-portal` || application === `dream-machine`,
  )

  return isSupportPortalUser
}
