import React, { useCallback, useEffect, useState } from 'react'

import { Box, Grid, HStack } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import {
  PermissionContext,
  Space,
  SpaceMembershipStatus,
} from 'tribe-api/interfaces'
import {
  BannerProvider,
  Icon,
  Link,
  Text,
  SIDEBAR_VISIBLE,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { MOBILE_HEADER_HEIGHT } from 'components/Layout/MobileHeader'

import { useNavbarHeight } from 'containers/Network/components/Navbar'
import { CreateSpacePreview } from 'containers/Space/CreateSpacePreview'
import { useCreateSpace } from 'containers/Space/hooks/useCreateSpace'
import { useGetSpaceTypes } from 'containers/Space/hooks/useGetSpaceTypes'
import { useGetSpaceCollections } from 'containers/SpaceCollection/hooks'

import { useCreateEmojis } from 'hooks/useCreateEmojis'
import { useResponsive } from 'hooks/useResponsive'

import useAuthMember from '../../hooks/useAuthMember'
import useGetNetwork from '../Network/useGetNetwork'
import {
  CreateSpaceForm,
  CreateSpaceFormInput,
} from './components/CreateSpaceForm'

export const CreateSpaceContainer = () => {
  const router = useRouter()
  const { collectionId: queryCollectionId } = router?.query || {}

  const { network } = useGetNetwork()
  const { spaceTypes } = useGetSpaceTypes()
  const { createSpace } = useCreateSpace()
  const { spaceCollections } = useGetSpaceCollections()
  const { authUser } = useAuthMember()
  const { createEmojis } = useCreateEmojis()
  const { isMobile } = useResponsive()
  const navbarHeight = useNavbarHeight()

  const [space, setSpace] = useState<Space | null>(null)

  useEffect(() => {
    if (!space && network && authUser && spaceTypes?.length > 0) {
      const spaceType =
        spaceTypes?.find(it => it.name === 'Discussion') || spaceTypes?.[0]
      const collection =
        spaceCollections?.find(it => it.id === queryCollectionId) ||
        spaceCollections?.[0]

      const defaultSpace: Space = {
        id: ``,
        __typename: 'Space',
        name: '',
        description: '',
        image: {
          __typename: 'Emoji',
          id: '',
          text: 'speech_balloon',
        },
        slug: '',
        banner: null,
        postsCount: 0,
        membersCount: 1,
        private: false,
        hidden: false,
        network,
        createdAt: new Date().toISOString(),
        createdBy: authUser,
        members: null,
        authMemberProps: {
          __typename: 'SpaceAuthMemberProps',
          membershipStatus: SpaceMembershipStatus.JOINED,
          context: PermissionContext.SPACE,
        },
        posts: undefined,
        roles: [],
        spaceType,
        collection,
        customOrderingIndexInGroup: 100,
        createdById: authUser?.id,
        groupId: '',
        networkId: network?.id,
        spaceTypeId: '',
      }
      setSpace(defaultSpace)
    }
  }, [
    space,
    network,
    authUser,
    spaceTypes,
    spaceCollections,
    queryCollectionId,
  ])

  const onChange = useCallback(
    async (data: CreateSpaceFormInput) => {
      const { emoji, ...rest } = data
      setSpace({
        ...space,
        ...rest,
        image: emoji,
      } as Space)
    },
    [space],
  )

  const onSubmit = useCallback(
    async (data: CreateSpaceFormInput) => {
      const { emoji } = data

      let imageId = emoji?.id

      if (emoji?.__typename === 'Emoji' && !imageId) {
        const uploadedEmojis = await createEmojis([{ text: emoji.text }])

        imageId = uploadedEmojis[0]?.id
      }

      const result = await createSpace({
        input: {
          name: data.name,
          description: data.description,
          imageId,
          spaceTypeId: space?.spaceType?.id || '',
          collectionId: data.spaceCollection?.id || spaceCollections?.[0]?.id,
          private: data.private,
          hidden: data.hidden,
        },
      })

      if (result) {
        await router.push('/[space-slug]/[section]', `/${result?.slug}/posts`)
      }
    },
    [createEmojis, createSpace, router, space],
  )

  return (
    <BannerProvider>
      <Grid
        templateColumns={{ base: '1fr', lg: '380px auto' }}
        templateAreas={{
          base: `
            'sidebar'
            `,
          [SIDEBAR_VISIBLE]: `
            'sidebar preview'
            `,
        }}
        height={{
          base: `calc(100vh - ${MOBILE_HEADER_HEIGHT})`,
          [SIDEBAR_VISIBLE]: `calc(100vh - ${navbarHeight})`,
        }}
      >
        <Box
          gridArea="sidebar"
          bg="bg.base"
          borderRight="1px solid"
          borderColor="border.base"
          p="6"
          overflowY="auto"
        >
          {!isMobile && (
            <NextLink
              passHref
              href={
                queryCollectionId
                  ? `/collection/${queryCollectionId}`
                  : '/spaces'
              }
            >
              <Link display="inline-block">
                <HStack color="label.secondary">
                  <Icon as={ArrowLeftLineIcon} />

                  <Text color="inherit">
                    <Trans i18nKey="common:cancel" defaults="Cancel" />
                  </Text>
                </HStack>
              </Link>
            </NextLink>
          )}

          <Box
            pt={{
              base: 0,
              [SIDEBAR_VISIBLE]: 6,
            }}
          >
            {space && (
              <CreateSpaceForm
                defaultValues={{
                  name: space?.name || '',
                  description: space?.description || '',
                  emoji: space?.image || null,
                  private: Boolean(space?.private),
                  hidden: Boolean(space?.hidden),
                  spaceType: space?.spaceType,
                  spaceCollection: space?.collection || null,
                }}
                onSubmit={onSubmit}
                onChange={onChange}
              />
            )}
          </Box>
        </Box>
        <Box
          gridArea="preview"
          overflowY="auto"
          maxHeight="100vh"
          bg="bg.secondary"
          display={{
            base: 'none',
            lg: 'block',
          }}
        >
          {space && <CreateSpacePreview space={space} />}
        </Box>
      </Grid>

      <Global
        styles={`
          body {
            overflow: hidden;
          }
        `}
      />
    </BannerProvider>
  )
}
