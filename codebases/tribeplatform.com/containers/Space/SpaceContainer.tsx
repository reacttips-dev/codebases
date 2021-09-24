import React, { memo, useCallback, useEffect, useState } from 'react'

import { VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Lock2FillIcon from 'remixicon-react/Lock2FillIcon'

import { ActionPermissions, SpaceMembershipStatus } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  BannerProvider,
  SkeletonProvider,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import {
  CenterLayout,
  FeedLayout,
  FeedLayoutMain,
  FeedLayoutWidgets,
  SidebarOpenButton,
} from 'components/Layout'

import ErrorContainer from 'containers/Error'
import { QuestionFeed } from 'containers/Question/components'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import AboutTab from 'containers/Space/components/AboutTab'
import { SpaceTabList } from 'containers/Space/components/SpaceTabList'
import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'
import { useSpaceTabs } from 'containers/Space/hooks/useSpaceTabs'

import { useSpace } from 'hooks/space/useSpace'
import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'
import tracker from 'lib/snowplow'

import { SpaceHeader } from './components/SpaceHeader'
import SpaceMembers from './components/SpaceMembers'
import { AboutWidget } from './components/widgets/AboutWidget'
import { AdminsWidget } from './components/widgets/AdminsWidget'
import { MembersWidget } from './components/widgets/MembersWidget'
import { HighlightedTopicsWidget } from './components/widgets/SpaceHighlightedTopics'
import { MODAL_ID as COMPOSER_MODAL_ID } from './Composer'
import DiscussionFeed from './DiscussionFeed'

const WIDGET_MAX_WIDTH = 300

const SpaceContainer: React.FC = () => {
  const [filteredTopicId, setFilteredTopicId] = useState<string | null>(null)
  const { mobileHeader, isSidebarOpen } = useResponsive()
  const { isOpen: isComposerOpen } = useSpaceModal(COMPOSER_MODAL_ID)
  const { query } = useRouter()

  const { isSearchModalOpen } = useSearch()

  const querySpaceSlug = query['space-slug']
    ? String(query['space-slug'])
    : undefined

  const { space, error, loading } = useSpace({
    skip: querySpaceSlug === undefined,
    variables: {
      slug: querySpaceSlug,
    },
  })

  const isInitialLoading = loading && space === undefined

  const { activeTabIndex, handleTabsChange, availableTabs } = useSpaceTabs({
    space,
  })

  const updateMobileHeader = useCallback(() => {
    if (isSidebarOpen || isSearchModalOpen || isComposerOpen) return

    mobileHeader.setLeft(<SidebarOpenButton />)
    mobileHeader.setRight(null)
  }, [isSidebarOpen, isSearchModalOpen, isComposerOpen, mobileHeader])

  // Snowplow Set Space Id fot Target of Events
  useEffect(() => {
    tracker.setTarget({ spaceId: space?.id })
    return () => tracker.setTarget({ spaceId: undefined })
  }, [])

  useEffect(() => {
    updateMobileHeader()
  }, [updateMobileHeader])

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canViewMembers } = hasActionPermission(
    permissions || [],
    'getSpaceMembers',
  )

  if (error) {
    logger.info(error)

    return <ErrorContainer error={error} />
  }

  const handleFilterChange = (topicId: string) => {
    setFilteredTopicId(topicId)
  }

  const handleFilterClear = () => {
    setFilteredTopicId(null)
  }

  const joined =
    space?.authMemberProps?.membershipStatus === SpaceMembershipStatus.JOINED

  const isSpaceForbidden = space?.private && !joined

  return (
    <BannerProvider>
      <SkeletonProvider loading={isInitialLoading}>
        <SpaceHeader spaceSlug={querySpaceSlug} />
        <SpaceTabList
          space={space}
          availableTabs={availableTabs}
          activeTabIndex={activeTabIndex}
          handleTabsChange={handleTabsChange}
        />
      </SkeletonProvider>
      <Tabs index={activeTabIndex} isLazy>
        <TabPanels>
          {isSpaceForbidden && (
            <TabPanel data-testid="space-forbidden-tab-content">
              <VStack
                my={20}
                w={80}
                mx="auto"
                data-testid="forbidden-message-container"
              >
                <Lock2FillIcon
                  size="64px"
                  color="label.secondary"
                  style={{ fill: 'label.secondary' }}
                />
                <Text mt={8} textStyle="semibold/xlarge" color="label.primary">
                  <Trans
                    i18nKey="space:feed.primary.title"
                    defaults="This is a private space"
                  />
                </Text>
                <Text
                  mt={4}
                  align="center"
                  textStyle="regular/medium"
                  color="label.secondary"
                >
                  <Trans
                    i18nKey="space:feed.primary.subtitle"
                    defaults="Only space members can view posts and who’s a member of the space."
                  />
                </Text>
              </VStack>
            </TabPanel>
          )}
          {availableTabs.includes('posts') && (
            <TabPanel data-testid="space-feed-tab-content">
              <FeedLayout
                templateAreas={{
                  base: `'. content .'`,
                  xl: `'. content widgets .'`,
                }}
                templateColumns={{
                  base: '0 auto 0',
                  lg: '1fr auto 1fr',
                  xl: '0 auto auto 0',
                }}
              >
                <FeedLayoutMain
                  justifySelf={{
                    base: 'center',
                    xl: 'end',
                  }}
                  size="lg"
                >
                  <DiscussionFeed
                    onComposerClose={updateMobileHeader}
                    space={space}
                    filteredTopicId={filteredTopicId}
                  />
                </FeedLayoutMain>
                <SkeletonProvider loading={isInitialLoading}>
                  <FeedLayoutWidgets maxW={WIDGET_MAX_WIDTH}>
                    <AboutWidget space={space} />
                    {canViewMembers && (
                      <>
                        <MembersWidget space={space} />
                        <AdminsWidget space={space} />
                      </>
                    )}
                    <HighlightedTopicsWidget
                      onFilterChange={handleFilterChange}
                      onFilterClear={handleFilterClear}
                      space={space}
                    />
                  </FeedLayoutWidgets>
                </SkeletonProvider>
              </FeedLayout>
            </TabPanel>
          )}
          {availableTabs.includes('questions') && (
            <TabPanel data-testid="space-questions-tab-content">
              <FeedLayout
                templateAreas={{
                  base: `'. content .'`,
                  xl: `'. content widgets .'`,
                }}
                templateColumns={{
                  base: '0 auto 0',
                  lg: '1fr auto 1fr',
                  xl: '0 auto auto 0',
                }}
              >
                <FeedLayoutMain
                  justifySelf={{
                    base: 'center',
                    xl: 'end',
                  }}
                  size="lg"
                >
                  <QuestionFeed
                    space={space}
                    filteredTopicId={filteredTopicId}
                  />
                </FeedLayoutMain>
                <FeedLayoutWidgets maxW={WIDGET_MAX_WIDTH}>
                  <AboutWidget space={space} />
                  {canViewMembers && (
                    <>
                      <MembersWidget space={space} />
                      <AdminsWidget space={space} />
                    </>
                  )}
                  <HighlightedTopicsWidget
                    onFilterChange={handleFilterChange}
                    onFilterClear={handleFilterClear}
                    space={space}
                  />
                </FeedLayoutWidgets>
              </FeedLayout>
            </TabPanel>
          )}
          {availableTabs.includes('about') && (
            <TabPanel data-testid="space-about-tab-content">
              <CenterLayout>
                <AboutTab space={space} spaceLoading={isInitialLoading} />
              </CenterLayout>
            </TabPanel>
          )}
          {availableTabs.includes('members') && (
            <TabPanel data-testid="space-members-tab-content">
              <CenterLayout>
                <SpaceMembers space={space} />
              </CenterLayout>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </BannerProvider>
  )
}

export default memo(SpaceContainer)
