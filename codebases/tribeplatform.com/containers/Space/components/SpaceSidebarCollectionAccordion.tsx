import React, { memo, useMemo, useState } from 'react'

import { Flex, LinkBox, LinkOverlay, Spacer } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import isEqual from 'react-fast-compare'
import AddFillIcon from 'remixicon-react/AddFillIcon'

import { hasActionPermission, Space, SpaceCollection } from 'tribe-api'
import {
  Avatar,
  Icon,
  SIDEBAR_VISIBLE,
  SidebarAccordion,
  SidebarAccordionButton,
  SidebarAccordionPanel,
  SidebarItem,
  SidebarLabel,
  SidebarLeftElement,
  ImagePickerDropdown,
} from 'tribe-components'
import { useTribeFeature, Features } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { SpaceCollectionOptions } from 'containers/SpaceCollection/components'

import { useResponsive } from 'hooks/useResponsive'

import { getUserSettings, setUserSetting } from 'lib/userSettings'

const ArrowDownSLineIcon =
  process.env.NODE_ENV === 'test'
    ? () => null
    : dynamic(import('remixicon-react/ArrowDownSLineIcon'), { ssr: false })

const ArrowRightSLineIcon =
  process.env.NODE_ENV === 'test'
    ? () => null
    : dynamic(import('remixicon-react/ArrowRightSLineIcon'), { ssr: false })

const SpaceSidebarCollectionAccordion = ({
  collection,
}: {
  collection: SpaceCollection
}) => {
  const router = useRouter()
  const { 'collection-id': queryCollectionId, 'space-slug': querySpaceSlug } =
    router?.query || {}

  const spaces = useMemo(
    () => collection?.spaces?.edges?.map(it => it.node as Space) || [],
    [collection],
  )

  const [isHeaderButtonHover, setHeaderButtonHover] = useState(false)

  const hasAccessibleSpaces =
    collection?.spaces && collection.spaces.totalCount > 0

  const { network } = useGetNetwork()
  const { authorized: canAddSpace } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'addSpace',
  )
  const { authorized: canUpdateGroup } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateGroup',
  )
  const { authorized: canOrganizeGroupSpaces } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'organizeGroupSpaces',
  )
  const { authorized: canRemoveGroup } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'removeGroup',
  )

  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  const canUpdateSpaceCollection =
    canAddSpace || canUpdateGroup || canOrganizeGroupSpaces || canRemoveGroup
  const { responsive } = useResponsive()

  const hasContents = canAddSpace || hasAccessibleSpaces

  if (!(hasContents || canUpdateSpaceCollection)) {
    return null
  }

  const userSettings = getUserSettings()

  return (
    <SidebarAccordion
      defaultIsOpen={
        userSettings?.spaceCollections?.[collection?.id]?.isExpanded
      }
      mt={4}
    >
      <LinkBox aria-label="Sidebar Collection">
        <SidebarAccordionButton
          active={queryCollectionId === collection?.id}
          collapseIcon={<Icon as={ArrowRightSLineIcon} />}
          expandIcon={<Icon as={ArrowDownSLineIcon} />}
          hideArrow={!hasContents}
          id={collection?.id}
          key={collection?.id}
          onArrowClick={isOpen =>
            setUserSetting('spaceCollection', {
              id: collection?.id,
              isExpanded: isOpen,
              name: collection?.name,
            })
          }
          onMouseEnter={() => setHeaderButtonHover(true)}
          onMouseLeave={() => setHeaderButtonHover(false)}
        >
          <NextLink passHref href={`/collection/${collection?.id}`}>
            <LinkOverlay aria-label={collection?.name} />
          </NextLink>

          <SidebarLabel>{collection?.name}</SidebarLabel>
          <Spacer />
          {canUpdateSpaceCollection && isHeaderButtonHover && (
            <Flex ml={2} maxW={8}>
              <SpaceCollectionOptions
                spaceCollection={collection}
                showAddSpace
              />
            </Flex>
          )}
        </SidebarAccordionButton>
      </LinkBox>
      <SidebarAccordionPanel>
        {spaces?.map(space => (
          <NextLink key={space.id} href={`/${space.slug}/posts`} passHref>
            <SidebarItem
              active={space.slug === querySpaceSlug}
              data-testid={`sidebar-space-link-to-${space.slug}`}
            >
              <SidebarLeftElement
                height={responsive?.[SIDEBAR_VISIBLE] ? 5 : 8}
              >
                {space?.image && isImagePickerDropdownEnabled ? (
                  <ImagePickerDropdown
                    emojiSize={responsive?.[SIDEBAR_VISIBLE] ? '2xs' : 'sm'}
                    image={space?.image}
                    imageBoxSize={responsive?.[SIDEBAR_VISIBLE] ? 5 : 8}
                    isDisabled
                  />
                ) : (
                  <Avatar
                    src={space?.image}
                    size={responsive?.[SIDEBAR_VISIBLE] ? '2xs' : 'sm'}
                    name={space?.name}
                  />
                )}
              </SidebarLeftElement>
              <SidebarLabel>{space.name}</SidebarLabel>
            </SidebarItem>
          </NextLink>
        ))}

        {canAddSpace && (
          <NextLink
            passHref
            href={`/space/create?collectionId=${collection?.id}`}
          >
            <SidebarItem
              icon={AddFillIcon}
              data-testid={`sidebar-create-space-button-for-${collection?.id}`}
              variant="ghost"
            >
              <SidebarLabel color="label.secondary">
                <Trans
                  i18nKey="common:space.sidebar.create"
                  defaults="New space"
                />
              </SidebarLabel>
            </SidebarItem>
          </NextLink>
        )}
      </SidebarAccordionPanel>
    </SidebarAccordion>
  )
}

export default memo(SpaceSidebarCollectionAccordion, isEqual)
