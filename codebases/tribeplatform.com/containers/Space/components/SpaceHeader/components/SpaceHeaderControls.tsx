import React, { memo, useCallback } from 'react'

import {
  ActionPermissions,
  hasActionPermission,
  SpaceMembershipStatus,
  SpaceQuery,
} from 'tribe-api'
import { Button, useResponsive } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { clientLoginPageRedirect } from 'containers/Network/Login/utils'
import { useGetSpaceMembershipRequestForMember } from 'containers/Space/hooks/useGetSpaceMembershipRequestForMember'

import { useSpace } from 'hooks/space/useSpace'
import useAuthMember from 'hooks/useAuthMember'

import { useJoinSpace } from '../../../hooks/useJoinSpace'
import useRequestSpaceMembership from '../../../hooks/useRequestSpaceMembership'
import { SpaceHeaderDesktopDropdown } from './SpaceHeaderDesktopDropdown'
import { SpaceHeaderMobileDropdown } from './SpaceHeaderMobileDropdown'

interface SpaceHeaderControlsProps {
  onAddMembersClick: () => void
  onNotificationSettingsButtonClick: () => void
  spaceSlug: SpaceQuery['space']['slug'] | undefined
}

export const SpaceHeaderControls = memo(
  ({
    onAddMembersClick,
    onNotificationSettingsButtonClick,
    spaceSlug,
  }: SpaceHeaderControlsProps) => {
    const { isPhone } = useResponsive()
    const { space } = useSpace({
      skip: spaceSlug === undefined,
      variables: {
        slug: spaceSlug,
      },
    })

    const joined =
      space?.authMemberProps?.membershipStatus === SpaceMembershipStatus.JOINED

    const permissions = space?.authMemberProps
      ?.permissions as ActionPermissions[]

    const { authorized: canRequestSpaceMembership } = hasActionPermission(
      permissions || [],
      'requestSpaceMembership',
    )

    const { authorized: canJoinSpace } = hasActionPermission(
      permissions || [],
      'joinSpace',
    )

    const { isGuest } = useAuthMember()

    const showJoinSpaceButton =
      canRequestSpaceMembership || canJoinSpace || isGuest

    const { isSpacePending } = useGetSpaceMembershipRequestForMember()

    const isJoinRequestPending = isSpacePending(space?.id)

    const { joinSpace } = useJoinSpace(space)
    const { requestSpaceMembership } = useRequestSpaceMembership(space)

    const handleJoinSpace = useCallback(() => {
      if (isGuest && typeof window !== 'undefined') {
        clientLoginPageRedirect(window.location.pathname)
        return
      }

      if (canJoinSpace) {
        joinSpace()
      } else if (canRequestSpaceMembership) {
        requestSpaceMembership()
      }
    }, [
      isGuest,
      joinSpace,
      requestSpaceMembership,
      canRequestSpaceMembership,
      canJoinSpace,
    ])

    if (space) {
      if (joined) {
        return isPhone ? (
          <SpaceHeaderMobileDropdown
            onAddMembersClick={onAddMembersClick}
            spaceSlug={spaceSlug}
          />
        ) : (
          <SpaceHeaderDesktopDropdown
            onAddMembersClick={onAddMembersClick}
            onNotificationSettingsButtonClick={
              onNotificationSettingsButtonClick
            }
            spaceSlug={spaceSlug}
          />
        )
      }

      return showJoinSpaceButton ? (
        <Button
          data-testid="join-space-button"
          buttonType="primary"
          onClick={handleJoinSpace}
          isDisabled={isJoinRequestPending}
        >
          {isJoinRequestPending ? (
            <Trans i18nKey="space.header.pending" defaults="Pending" />
          ) : (
            <Trans i18nKey="space.header.join" defaults="Join space" />
          )}
        </Button>
      ) : null
    }

    return null
  },
  (prevProps, nextProps) => prevProps?.spaceSlug === nextProps?.spaceSlug,
)
