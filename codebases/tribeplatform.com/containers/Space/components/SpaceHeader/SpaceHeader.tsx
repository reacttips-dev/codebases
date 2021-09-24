import React, { memo } from 'react'

import { Box, HStack } from '@chakra-ui/react'

import { SpaceQuery } from 'tribe-api'
import { ActionPermissions } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Banner, BannerProvider } from 'tribe-components'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { SpaceNotificationSettingsModal } from 'containers/Notifications/components/SpaceNotificationSettingsModal'
import {
  useRemoveSpaceBanner,
  useUpdateSpaceBanner,
} from 'containers/Space/hooks'

import { useSpace } from 'hooks/space/useSpace'
import useToggle from 'hooks/useToggle'
import useUpdateImage from 'hooks/useUpdateImage'

import { CONTENT_PADDING } from '../../constants'
import AddMembersModal from '../AddMembersModal'
import { SpaceHeaderBackToSpaces } from './components/SpaceHeaderBackToSpaces'
import { SpaceHeaderControls } from './components/SpaceHeaderControls'
import { SpaceHeaderName } from './components/SpaceHeaderName'

export interface SpaceHeaderProps {
  spaceSlug: SpaceQuery['space']['slug'] | undefined
}

const styles = {
  wrapper: {
    px: CONTENT_PADDING,
  },
  container: {
    style: { marginTop: 20 },
  },
}

export const SpaceHeader = memo(({ spaceSlug }: SpaceHeaderProps) => {
  const { space } = useSpace({
    skip: spaceSlug === undefined,
    variables: {
      slug: spaceSlug,
    },
  })

  const { network } = useGetNetwork()

  const [isAddMembersModalOpen, toggleAddMembersModal] = useToggle(false)
  const [
    isNotificationSettingsModalOpen,
    toggleNotificationSettingsModalOpen,
  ] = useToggle(false)

  const { updateBanner } = useUpdateSpaceBanner({
    space,
  })
  const { removeBanner } = useRemoveSpaceBanner({
    space,
  })

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canAddMembers } = hasActionPermission(
    permissions || [],
    'addSpaceMembers',
  )

  const { authorized: canUpdateSpaceSetting } = hasActionPermission(
    permissions || [],
    'updateSpace',
  )

  const {
    authorized: canUpdateMemberNotificationSettings,
  } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateMemberSpaceNotificationSettings',
  )

  const { updateImage } = useUpdateImage(space?.banner?.id || '')

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
        <SpaceHeaderBackToSpaces space={space} />

        <HStack
          w="full"
          flexGrow={1}
          justifyContent="space-between"
          style={styles.container.style}
        >
          <SpaceHeaderName spaceSlug={spaceSlug} />

          <SpaceHeaderControls
            onAddMembersClick={toggleAddMembersModal}
            onNotificationSettingsButtonClick={
              toggleNotificationSettingsModalOpen
            }
            spaceSlug={spaceSlug}
          />
        </HStack>
      </Box>
      {canAddMembers && (
        <AddMembersModal
          isOpen={isAddMembersModalOpen}
          onClose={toggleAddMembersModal}
          spaceSlug={space?.slug}
        />
      )}
      {canUpdateMemberNotificationSettings && (
        <SpaceNotificationSettingsModal
          isOpen={isNotificationSettingsModalOpen}
          onClose={toggleNotificationSettingsModalOpen}
          space={space}
        />
      )}
    </BannerProvider>
  )
})
