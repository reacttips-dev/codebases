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
import { DeploymentMetadata } from './api/v1/types'
import { getDeploymentTags } from './stackDeployments'

export const isAWSUser = (profile: UserProfile): boolean => profile.domain === 'aws'
export const isGCPUser = (profile: UserProfile): boolean => profile.domain === 'gcp'
export const isAzureUser = (profile: UserProfile): boolean => profile.domain === 'azure'
export const isAzurePlusUser = (profile: UserProfile): boolean => {
  const { integrated_marketplace_account } = profile
  return isAzureUser(profile) && integrated_marketplace_account
}

export const isMarketPlaceUser = (profile: UserProfile): boolean =>
  isAWSUser(profile) || isGCPUser(profile) || isAzureUser(profile)

export const isUnSubscribedMarketPlaceUser = (profile: UserProfile): boolean => {
  const { aws_subscribed, gcp_subscribed } = profile
  return (isAWSUser(profile) && !aws_subscribed) || (isGCPUser(profile) && !gcp_subscribed)
}

export function isIntegratedAzurePlusDeployment(deployment: {
  metadata?: DeploymentMetadata
}): boolean {
  // is azure++ deployment managed by ms
  const tags = getDeploymentTags({ deployment })

  if (!tags) {
    return false
  }

  return tags.some(({ key }) => key === 'azure_subscription_id')
}
