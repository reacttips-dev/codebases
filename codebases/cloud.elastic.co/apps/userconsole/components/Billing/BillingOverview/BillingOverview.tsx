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

import React, { FunctionComponent } from 'react'

import TrialBillingOverview from './TrialBillingOverview'
import SubscribedBillingOverview from './SubscribedBillingOverview'

import { isTrialUser } from '../../../../../lib/billing'

import { AsyncRequestState, UserProfile } from '../../../../../types'
import { FeaturesUsage } from '../../../../../lib/api/v1/types'

interface Props {
  profile: UserProfile
  isGovCloud?: boolean
  fetchProfileRequest: AsyncRequestState
  updateBillingLevelRequest: AsyncRequestState
  usageDetails?: FeaturesUsage
}

const BillingOverview: FunctionComponent<Props> = ({
  isGovCloud,
  profile,
  fetchProfileRequest,
  updateBillingLevelRequest,
  usageDetails,
}) => {
  const isLoading = updateBillingLevelRequest.inProgress || fetchProfileRequest.inProgress

  if (isTrialUser(profile)) {
    return <TrialBillingOverview isGovCloud={isGovCloud} profile={profile} isLoading={isLoading} />
  }

  return (
    <SubscribedBillingOverview
      isLoading={isLoading}
      profile={profile}
      usageDetails={usageDetails!}
    />
  )
}

export default BillingOverview
