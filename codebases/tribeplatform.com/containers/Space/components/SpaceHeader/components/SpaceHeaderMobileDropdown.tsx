import React, { useCallback } from 'react'

import { useRouter } from 'next/router'
import LogoutBoxLineIcon from 'remixicon-react/LogoutBoxLineIcon'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'
import Settings4LineIcon from 'remixicon-react/Settings4LineIcon'
import UserAddLineIcon from 'remixicon-react/UserAddLineIcon'

import { ActionPermissions, hasActionPermission, SpaceQuery } from 'tribe-api'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Icon,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { useSpace } from 'hooks/space/useSpace'

import { useLeaveSpace } from '../../../hooks/useLeaveSpace'

interface SpaceHeaderMobileDropdownProps {
  onAddMembersClick: () => void
  spaceSlug: SpaceQuery['space']['slug'] | undefined
}

export const SpaceHeaderMobileDropdown: React.FC<SpaceHeaderMobileDropdownProps> = ({
  onAddMembersClick,
  spaceSlug,
}) => {
  const { space } = useSpace({
    skip: spaceSlug === undefined,
    variables: {
      slug: spaceSlug,
    },
  })
  const { t } = useTranslation()

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

  const { leaveSpace } = useLeaveSpace({ space })

  const router = useRouter()

  const goToSpaceSetting = useCallback(() => {
    router.push(
      '/admin/space/[space-slug]/[section]',
      `/admin/space/${space?.slug}/settings`,
    )
  }, [router, space?.slug])

  return canAddMembers || canUpdateSpaceSetting || canLeaveSpace ? (
    <Dropdown>
      <DropdownIconButton
        aria-label={t('space.about.members.seeAllMembers', 'See all')}
        border={0}
        color="label.primary"
        background="bg.secondary"
        backgroundColor="bg.secondary"
        size="md"
        borderEndRadius="base"
        borderStartRadius="base"
        p={2}
        variant="ghost"
        date-testid="space-options-dd"
        icon={<Icon as={MoreLineIcon} boxSize={6} />}
      />
      <DropdownList>
        {canAddMembers && (
          <DropdownItem
            icon={UserAddLineIcon}
            onClick={onAddMembersClick}
            data-testid="add-user-space-button"
          >
            <Trans i18nKey="space.aria.addUser" defaults="Add members" />
          </DropdownItem>
        )}
        {canUpdateSpaceSetting && (
          <DropdownItem
            icon={Settings4LineIcon}
            onClick={goToSpaceSetting}
            data-testid="space-settings-ddi"
          >
            <Trans i18nKey="space.aria.settings" defaults="Settings" />
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
  ) : null
}
