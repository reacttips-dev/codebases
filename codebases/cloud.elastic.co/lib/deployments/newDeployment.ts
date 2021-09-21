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

import { ProfileState } from '../../types'
import { isMarketPlaceUser, isUnSubscribedMarketPlaceUser } from '../marketPlace'

export const disableDeploymentCreation = ({
  profile,
  hasDeployments,
}: {
  profile?: ProfileState
  hasDeployments: boolean
}): boolean => {
  if (!profile) {
    return false
  }

  const isPaying = profile.is_paying || profile.allow_provisioning_without_payment_established
  const { hasExpiredTrial, inTrial } = profile

  if (inTrial) {
    if (hasExpiredTrial) {
      // Disable deployment creation if expired trial user is NOT paying
      return !isPaying
    }

    // Disable deployment creation for trial users that have a deployment already
    return hasDeployments
  }

  return false
}

export const disableDeploymentButton = ({ profile }) =>
  isMarketPlaceUser(profile) && isUnSubscribedMarketPlaceUser(profile)
