import React, { useCallback } from 'react'

import { HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import LogoutBoxLineIcon from 'remixicon-react/LogoutBoxLineIcon'
import NotificationLineIcon from 'remixicon-react/NotificationLineIcon'
import Settings4LineIcon from 'remixicon-react/Settings4LineIcon'
import UserAddLineIcon from 'remixicon-react/UserAddLineIcon'

import { SpaceQuery, ActionPermissions, hasActionPermission } from 'tribe-api'
import {
  BannerAddImage,
  Dropdown,
  DropdownIconButton,
  DropdownList,
  DropdownItem,
} from 'tribe-components'
import { useTranslation, Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { useLeaveSpace } from 'containers/Space/hooks'

import { useSpace } from 'hooks/space/useSpace'

import { SpaceHeaderButton } from './SpaceHeaderButton'

interface SpaceHeaderDesktopDropdownProps {
  onAddMembersClick: () => void
  onNotificationSettingsButtonClick: () => void
  spaceSlug: SpaceQuery['space']['slug'] | undefined
}

export const SpaceHeaderDesktopDropdown: React.FC<SpaceHeaderDesktopDropdownProps> = ({
  onAddMembersClick,
  onNotificationSettingsButtonClick,
  spaceSlug,
}) => {
  const { space } = useSpace({
    skip: spaceSlug === undefined,
    variables: {
      slug: spaceSlug,
    },
  })
  const { t } = useTranslation()
  const { network } = useGetNetwork()

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]
  const { authorized: canAddMembers } = hasActionPermission(
    permissions || [],
    'addSpaceMembers',
  )

  const { authorized: canUpdateSpaceSetting } = hasActionPermission(
    permissions || [],
    'updateSpace',
  )

  const { authorized: canLeaveSpace } = hasActionPermission(
    permissions || [],
    'leaveSpace',
  )

  const {
    authorized: canUpdateMemberNotificationSettings,
  } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateMemberSpaceNotificationSettings',
  )

  const { leaveSpace } = useLeaveSpace({ space })

  const router = useRouter()

  const goToSpaceSetting = useCallback(() => {
    router.push(
      '/admin/space/[space-slug]/[section]',
      `/admin/space/${space?.slug}/settings`,
    )
  }, [router, space?.slug])

  return (
    <HStack>
      {canUpdateSpaceSetting && <BannerAddImage />}
      {canAddMembers && (
        <SpaceHeaderButton
          icon={UserAddLineIcon}
          aria-label={t('space.aria.addUser', 'Add members')}
          onClick={onAddMembersClick}
          data-testid="add-user-space-button"
        />
      )}
      {canUpdateMemberNotificationSettings && (
        <SpaceHeaderButton
          icon={NotificationLineIcon}
          aria-label={t(
            'space:header.notificationSettings',
            'Notification Settings',
          )}
          onClick={onNotificationSettingsButtonClick}
          data-testid="notification-settings-space-button"
        />
      )}
      {(canUpdateSpaceSetting || canLeaveSpace) && (
        <Dropdown>
          <DropdownIconButton
            variant="solid"
            size="sm"
            borderRadius="md"
            bgColor="bg.secondary"
            date-testid="space-options-dd"
          />
          <DropdownList zIndex="dropdown">
            {canUpdateSpaceSetting && (
              <DropdownItem
                onClick={goToSpaceSetting}
                icon={Settings4LineIcon}
                data-testid="space-settings-ddi"
              >
                <Trans i18nKey="space.header.settings" defaults="Settings" />
              </DropdownItem>
            )}
            {canLeaveSpace && (
              <DropdownItem
                onClick={leaveSpace}
                icon={LogoutBoxLineIcon}
                data-testid="space-leave-ddi"
              >
                <Trans i18nKey="space.header.leave" defaults="Leave space" />
              </DropdownItem>
            )}
          </DropdownList>
        </Dropdown>
      )}
    </HStack>
  )
}
