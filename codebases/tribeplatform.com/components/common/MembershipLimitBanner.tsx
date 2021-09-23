import React from 'react'

import { useRouter } from 'next/router'

import { Alert, AlertIcon, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useMemberCapacity from 'hooks/useMemberCapacity'
import { useUpgradeTouchpoint } from 'hooks/useUpgradeTouchpoint'

export const MEMBERSHIP_LIMIT_BANNER_HEIGHT = 48
export const MEMBERSHIP_LIMIT_BANNER_ID = 'membership-limit-banner'

export const MembershipLimitBanner = () => {
  const router = useRouter()
  const { didReachLimit, isApproachingLimit, isLoading } = useMemberCapacity({
    skip: typeof window === 'undefined',
  })
  const { upgradeLink } = useUpgradeTouchpoint()

  if (
    isLoading ||
    (!didReachLimit && !isApproachingLimit) ||
    !router?.pathname?.includes('admin')
  ) {
    return null
  }

  return (
    <Alert
      alignItems="center"
      status={didReachLimit ? 'error' : 'warning'}
      justifyContent="flex-start"
      borderRadius={0}
      mb={0}
      id={MEMBERSHIP_LIMIT_BANNER_ID}
    >
      <AlertIcon />
      <Text textStyle="regular/medium">
        {isApproachingLimit && (
          <Trans
            i18nKey="member:admin.approaching_membership_limit"
            defaults="You are approaching the membership limit for your free account. <0>Upgrade your plan to allow more members to join.</0>"
          >
            <Link fontSize="md" fontWeight="semibold" href={upgradeLink} />
          </Trans>
        )}

        {didReachLimit && (
          <Trans
            i18nKey="member:admin.reached_membership_limit"
            defaults="You've reached the membership limit for the Premium trial plan. <0>Upgrade your plan to allow more members to join.</0>"
          >
            <Link fontSize="md" fontWeight="semibold" href={upgradeLink} />
          </Trans>
        )}
      </Text>
    </Alert>
  )
}
