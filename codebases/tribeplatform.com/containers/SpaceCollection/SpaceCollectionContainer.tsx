import React, { useEffect } from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Collection, SpaceCollection } from 'tribe-api'
import {
  EmptySpaces,
  NonIdealState,
  SkeletonProvider,
  Text,
} from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { CenterLayout, LayoutHeader } from 'components/Layout'

import ErrorContainer from 'containers/Error'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import { JoinNetworkButton, NewSpaceButton } from 'containers/Space/components'
import { AllSpaces } from 'containers/Space/Spaces/AllSpaces'
import { AuthSpaces } from 'containers/Space/Spaces/AuthSpaces'
import { SpaceCollectionOptions } from 'containers/SpaceCollection/components'
import { useGetSpaceCollection } from 'containers/SpaceCollection/hooks'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'

const ActionButtons = ({ collectionId }: { collectionId: string }) => {
  const { authUser } = useAuthMember()
  const { isMobile } = useResponsive()

  if (authUser) {
    return <NewSpaceButton collectionId={collectionId} />
  }

  if (!isMobile) {
    return <JoinNetworkButton />
  }

  return null
}

export const SpaceCollectionContainer = () => {
  const router = useRouter()
  const { 'collection-id': collectionId } = router.query
  const {
    spaceCollection,
    isInitialLoading,
    error,
    isEmpty,
  } = useGetSpaceCollection(String(collectionId))
  const { t } = useTranslation()
  const { isMobile, mobileHeader, isSidebarOpen } = useResponsive()
  const { isSearchModalOpen } = useSearch()

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen) return

    mobileHeader.setRight(<ActionButtons collectionId={String(collectionId)} />)
  }, [collectionId, isSearchModalOpen, isSidebarOpen, mobileHeader])

  if (error || !spaceCollection) {
    if (error) {
      logger.error(error)
    }

    return <ErrorContainer error={error} />
  }

  const collection = spaceCollection as Collection

  return (
    <CenterLayout>
      <VStack align="stretch" spacing={8}>
        {!isMobile && (
          <SkeletonProvider loading={isInitialLoading}>
            <LayoutHeader pb={0} pl={0}>
              <HStack w="full" justify="space-between" align="top" spacing={8}>
                <VStack align="stretch" flexGrow={1}>
                  <HStack align="baseline" w="full" justify="space-between">
                    <HStack>
                      <Text textStyle="bold/2xlarge" data-testid="page-title">
                        {spaceCollection?.name}
                      </Text>
                      <SpaceCollectionOptions spaceCollection={collection} />
                    </HStack>

                    <ActionButtons collectionId={String(collectionId)} />
                  </HStack>
                  {spaceCollection?.description && (
                    <Text textStyle="regular/medium">
                      {spaceCollection?.description}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </LayoutHeader>
          </SkeletonProvider>
        )}

        {isEmpty ? (
          <NonIdealState
            height="70vh"
            icon={<EmptySpaces />}
            title={t(
              'spaceCollection:spaces.empty.title',
              'You don’t have any spaces in this collection yet',
            )}
            description={t(
              'spaceCollection:spaces.empty.subtitle',
              'Collections help you to organize your spaces into groups',
            )}
            minHeight="30vh"
          />
        ) : (
          <CollectionSpaces spaceCollection={collection} />
        )}
      </VStack>
    </CenterLayout>
  )
}

const CollectionSpaces = ({
  spaceCollection,
}: {
  spaceCollection: SpaceCollection
}) => {
  const { authUser } = useAuthMember()

  return authUser ? (
    <AuthSpaces memberId={authUser?.id} collectionId={spaceCollection?.id} />
  ) : (
    <AllSpaces collectionId={spaceCollection?.id} />
  )
}
