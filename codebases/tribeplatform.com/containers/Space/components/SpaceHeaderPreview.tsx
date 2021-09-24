import React, { FC, memo, useCallback } from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { RemixiconReactIconComponentType } from 'remixicon-react'
import Lock2FillIcon from 'remixicon-react/Lock2FillIcon'
import LogoutBoxLineIcon from 'remixicon-react/LogoutBoxLineIcon'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'
import NotificationLineIcon from 'remixicon-react/NotificationLineIcon'
import Settings4LineIcon from 'remixicon-react/Settings4LineIcon'
import UserAddLineIcon from 'remixicon-react/UserAddLineIcon'

import { SpaceQuery } from 'tribe-api'
import { ActionPermissions } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Banner,
  BannerAddImage,
  BannerProvider,
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Icon,
  IconButton,
  IconButtonProps,
  Text,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { SpaceImagePicker } from 'containers/Space/components/SpaceImagePicker'
import {
  useRemoveSpaceBanner,
  useUpdateSpaceBanner,
} from 'containers/Space/hooks'

import { useResponsive } from 'hooks/useResponsive'
import useUpdateImage from 'hooks/useUpdateImage'

import { CONTENT_PADDING } from '../constants'
import { useLeaveSpace } from '../hooks/useLeaveSpace'

export interface SpaceHeaderPreviewProps {
  space: SpaceQuery['space']
}

const styles = {
  wrapper: {
    px: CONTENT_PADDING,
  },
  container: {
    style: { marginTop: 20 },
  },
}

interface HeaderButtonProps extends IconButtonProps {
  icon: RemixiconReactIconComponentType
}

const HeaderButton: FC<HeaderButtonProps> = ({ icon: Icon, ...rest }) => {
  return (
    <IconButton
      variant="solid"
      size="sm"
      borderRadius="md"
      icon={<Icon size="16px" />}
      highlighted
      {...rest}
    />
  )
}

export const SpaceHeaderPreview = memo(({ space }: SpaceHeaderPreviewProps) => {
  const { isPhone } = useResponsive()
  const { network } = useGetNetwork()
  const router = useRouter()

  const { t } = useTranslation()
  const { leaveSpace } = useLeaveSpace({ space })
  const { updateBanner } = useUpdateSpaceBanner({
    space,
  })
  const { removeBanner } = useRemoveSpaceBanner({
    space,
  })

  const goToSpaceSetting = useCallback(() => {
    router.push(
      '/admin/space/[space-slug]/[section]',
      `/admin/space/${space?.slug}/settings`,
    )
  }, [router, space?.slug])

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]
  const { authorized: canAddMembers } = hasActionPermission(
    permissions || [],
    'addSpaceMembers',
  )

  let spaceControls: JSX.Element | null | boolean = null
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

  const { updateImage } = useUpdateImage(space?.banner?.id || '')

  if (space) {
    spaceControls = isPhone ? (
      (canAddMembers || canUpdateSpaceSetting || canLeaveSpace) && (
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
                disabled
                onClick={() => false}
                data-testid="add-user-space-button"
              >
                <Trans i18nKey="space.aria.addUser" defaults="Add members" />
              </DropdownItem>
            )}
            {canUpdateSpaceSetting && (
              <DropdownItem
                icon={Settings4LineIcon}
                disabled
                onClick={() => false}
                data-testid="space-settings-ddi"
              >
                <Trans i18nKey="space.aria.settings" defaults="Settings" />
              </DropdownItem>
            )}
            {canLeaveSpace && (
              <DropdownItem
                disabled
                onClick={() => false}
                icon={LogoutBoxLineIcon}
                data-testid="space-leave-ddi"
              >
                <Trans i18nKey="space.header.leave" defaults="Leave space" />
              </DropdownItem>
            )}
          </DropdownList>
        </Dropdown>
      )
    ) : (
      <HStack>
        {canUpdateSpaceSetting && <BannerAddImage />}
        {canAddMembers && (
          <HeaderButton
            icon={UserAddLineIcon}
            aria-label={t('space.aria.addUser', 'Add members')}
            onClick={() => false}
            disabled
            data-testid="add-user-space-button"
          />
        )}
        {canUpdateMemberNotificationSettings && (
          <HeaderButton
            icon={NotificationLineIcon}
            aria-label={t(
              'space:header.notificationSettings',
              'Notification Settings',
            )}
            onClick={() => false}
            disabled
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

  return (
    <BannerProvider>
      <Banner
        onSave={updateBanner}
        onEdit={updateImage}
        onRemove={canUpdateSpaceSetting ? removeBanner : undefined}
        image={
          space?.banner?.__typename === 'Image' ? space?.banner : undefined
        }
      />
      <Box w="full" px={styles.wrapper.px} py={5} bg="bg.base">
        <HStack
          w="full"
          flexGrow={1}
          justifyContent="space-between"
          style={styles.container.style}
        >
          <HStack spacing="3" zIndex="second">
            <SpaceImagePicker space={space} preview />

            <VStack align="left" spacing="1">
              <Text
                textStyle="semibold/xlarge"
                lineHeight={6}
                color="label.primary"
              >
                {space?.name}
              </Text>
              {!space?.name && (
                <Text
                  textStyle="semibold/xlarge"
                  lineHeight={6}
                  color="placeholder"
                >
                  <Trans i18nKey="space:header.space" defaults="Space Name" />
                </Text>
              )}
              <HStack>
                <Text
                  display="flex"
                  alignItems="center"
                  textStyle="regular/small"
                  color="label.secondary"
                >
                  {space?.private && <Icon as={Lock2FillIcon} mr={1} />}
                  <Trans i18nKey="space.type.name" defaults="Space" />
                </Text>
                <Text textStyle="regular/small" color="label.secondary">
                  {' · '}
                </Text>
                <Text textStyle="regular/small" color="label.secondary">
                  <Trans
                    i18nKey="space:header.members"
                    defaults="{{ membersCount, ifNumAbbr }} members"
                    values={{
                      membersCount: space?.membersCount || 0,
                    }}
                  />
                </Text>
              </HStack>
            </VStack>
          </HStack>
          {spaceControls}
        </HStack>
      </Box>
    </BannerProvider>
  )
})
