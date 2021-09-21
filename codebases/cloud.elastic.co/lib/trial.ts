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

import { UserProfile } from '../types'

export function inTrial({ profile }: { profile: UserProfile | null }): boolean {
  if (!profile) {
    return false
  }

  return profile.inTrial
}

export function inActiveTrial({ profile }: { profile: UserProfile | null }): boolean {
  if (!inTrial({ profile })) {
    return false
  }

  return profile!.trials.length > 0
}

export function inTrialBeforeCreateDeployment({
  profile,
}: {
  profile: UserProfile | null
}): boolean {
  if (!inTrial({ profile })) {
    return false
  }

  // trials gets added to when a trial user first creates a deployment
  return profile!.trials.length === 0
}
