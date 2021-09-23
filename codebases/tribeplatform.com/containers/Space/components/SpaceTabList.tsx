import React from 'react'

import { TabsProps } from '@chakra-ui/react'

import { SpaceQuery } from 'tribe-api'
import { SpaceMembershipStatus } from 'tribe-api/interfaces'
import { Tab, TabList, Tabs, useResponsive } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { MOBILE_HEADER_HEIGHT } from 'components/Layout/MobileHeader'

import { useNavbarHeight } from 'containers/Network/components/Navbar'
import { CONTENT_PADDING } from 'containers/Space/constants'
import { SpaceTab } from 'containers/Space/hooks/useSpaceTabs'

type SpaceTabsProps = Partial<TabsProps> & {
  space: SpaceQuery['space']
  availableTabs: SpaceTab[]
  activeTabIndex: number
  handleTabsChange: (index: number) => void
}

export const SpaceTabList = ({
  space,
  availableTabs = [],
  activeTabIndex,
  handleTabsChange,
  ...props
}: SpaceTabsProps) => {
  const { isMobile } = useResponsive()
  const navbarHeight = useNavbarHeight()

  const joined =
    space?.authMemberProps?.membershipStatus === SpaceMembershipStatus.JOINED

  const isSpaceForbidden = space?.private && !joined

  return (
    <Tabs
      index={activeTabIndex}
      onChange={handleTabsChange}
      isLazy
      w="full"
      pos="sticky"
      bg="bg.base"
      zIndex="default"
      top={isMobile ? MOBILE_HEADER_HEIGHT : navbarHeight}
      {...props}
    >
      <TabList
        px={CONTENT_PADDING}
        borderBottom="1px"
        borderColor="border.base"
        data-testid="space-tabs"
      >
        {availableTabs.includes('posts') && (
          <Tab data-testid="space-feed-tab">
            <Trans
              i18nKey="settings:general.space.tabs.discussion"
              defaults="Discussion"
            />
          </Tab>
        )}
        {availableTabs.includes('questions') && (
          <Tab data-testid="space-questions-tab">
            <Trans
              i18nKey="settings:general.space.tabs.questions"
              defaults="Q&A"
            />
          </Tab>
        )}
        {availableTabs.includes('about') && (
          <Tab
            data-testid="space-about-tab"
            isDisabled={Boolean(isSpaceForbidden)}
          >
            <Trans
              i18nKey="settings:general.space.tabs.about"
              defaults="About"
            />
          </Tab>
        )}
        {availableTabs.includes('members') && (
          <Tab
            data-testid="space-members-tab"
            isDisabled={Boolean(isSpaceForbidden)}
          >
            <Trans
              i18nKey="settings:general.space.tabs.members"
              defaults="Members"
            />
          </Tab>
        )}
      </TabList>
    </Tabs>
  )
}
