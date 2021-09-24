import React from 'react'

import { Box, Flex, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import EmotionLineIcon from 'remixicon-react/EmotionLineIcon'
import ReplyLineIcon from 'remixicon-react/ReplyLineIcon'

import { Space, ThemeTokens } from 'tribe-api/interfaces'
import {
  Button,
  Card,
  Icon,
  SkeletonProvider,
  TableColumnWrapper,
  TableWrapper,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UserBar,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { FeedLayout, FeedLayoutMain, FeedLayoutWide } from 'components/Layout'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import { DiscussionPostContent } from 'containers/Discussion/components/DiscussionPostContent'
import { SpaceTabList } from 'containers/Space/components/SpaceTabList'
import ComposerCard from 'containers/Space/ComposerCard'
import { useSpaceTabs } from 'containers/Space/hooks/useSpaceTabs'

import useAuthMember from 'hooks/useAuthMember'

import { AboutTab } from './components/AboutTab'
import { SpaceHeaderPreview } from './components/SpaceHeaderPreview'

export const EmptyPost = () => {
  const { themeSettings } = useThemeSettings()

  return (
    <>
      <SkeletonProvider loading speed={10}>
        <Flex flexDirection="column" align="stretch">
          <Box mt={5} />
          <DiscussionPostContent
            post={null}
            themeSettings={themeSettings as ThemeTokens}
          />
        </Flex>
      </SkeletonProvider>
      <Box mb={5} />
      <Box mt={3}>
        <Wrap>
          <WrapItem>
            <Button
              buttonType="secondary"
              size="sm"
              leftIcon={<Icon as={ReplyLineIcon} />}
              borderRadius="full"
            >
              <Trans i18nKey="common:post.reactions.reply" defaults="Reply" />
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              d="flex"
              variant="solid"
              colorScheme="gray"
              size="xs"
              borderRadius="full"
              borderColor="border.lite"
              border="1px"
            >
              <Icon as={EmotionLineIcon} h="16px" w="16px" mr="4px" />
              <Trans i18nKey="common:post.reactions.react" defaults="React" />
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </>
  )
}

export const CreateSpacePreview = ({ space }: { space: Space }) => {
  const { t } = useTranslation()
  const members = [space.createdBy]
  const { authUser } = useAuthMember()

  const { activeTabIndex, handleTabsChange, availableTabs } = useSpaceTabs({
    space,
    preview: true,
  })

  return (
    <>
      <Box bg="bg.secondary" flexGrow={1}>
        <SpaceHeaderPreview space={space} />
        <SpaceTabList
          space={space}
          availableTabs={availableTabs}
          activeTabIndex={activeTabIndex}
          handleTabsChange={handleTabsChange}
          top={0}
        />
        <Tabs index={activeTabIndex} isLazy display="flex" h="full">
          <TabPanels>
            {availableTabs.includes('posts') && (
              <TabPanel>
                <FeedLayout>
                  <FeedLayoutMain>
                    <ComposerCard onClick={() => null} />
                    <Card>
                      <UserBar
                        size="lg"
                        title={authUser?.name}
                        picture={authUser?.profilePicture}
                      />
                      <EmptyPost />
                    </Card>
                    <SkeletonProvider loading speed={10}>
                      {[...Array(3)].map((_, index) => {
                        return (
                          // // It's a static array, so we can use indexes as keys //
                          // eslint-disable-next-line react/no-array-index-key
                          <Card key={index}>
                            <UserBar title={null} />
                            <EmptyPost />
                          </Card>
                        )
                      })}
                    </SkeletonProvider>
                  </FeedLayoutMain>
                </FeedLayout>
              </TabPanel>
            )}
            {availableTabs.includes('questions') && (
              <TabPanel pt={0}>
                <FeedLayout>
                  <FeedLayoutMain>
                    <ComposerCard onClick={() => null} />
                    <Card>
                      <UserBar
                        size="lg"
                        title={authUser?.name}
                        picture={authUser?.profilePicture}
                      />
                      <EmptyPost />
                    </Card>
                    <SkeletonProvider loading speed={10}>
                      {[...Array(3)].map((_, index) => {
                        return (
                          // // It's a static array, so we can use indexes as keys //
                          // eslint-disable-next-line react/no-array-index-key
                          <Card key={index}>
                            <UserBar title={null} />
                            <EmptyPost />
                          </Card>
                        )
                      })}
                    </SkeletonProvider>
                  </FeedLayoutMain>
                </FeedLayout>
              </TabPanel>
            )}
            {availableTabs.includes('about') && (
              <TabPanel pt={0}>
                <FeedLayout>
                  <FeedLayoutMain>
                    <AboutTab space={space} />
                  </FeedLayoutMain>
                </FeedLayout>
              </TabPanel>
            )}
            {availableTabs.includes('members') && (
              <TabPanel pt={0}>
                <FeedLayout>
                  <FeedLayoutWide>
                    <HStack w="full" justifyContent="space-between">
                      <Text textStyle="medium/large">
                        <Trans
                          i18nKey="space.card.members"
                          defaults="{{ count, ifNumAbbr }} members"
                          count={space?.membersCount}
                        />
                      </Text>
                    </HStack>

                    <TableWrapper
                      data={members}
                      hasMore={false}
                      total={members?.length}
                    >
                      <TableColumnWrapper
                        id="name"
                        title={t('common:name', 'Name')}
                        getColumnProps={() => ({
                          flexGrow: 1,
                          flexBasis: '40%',
                          overflow: 'hidden',
                        })}
                      >
                        {member => {
                          const memberLink = {
                            href: '/[space-slug]/[section]',
                            as: `/${space?.slug}/posts`,
                          }
                          return (
                            <UserBar
                              size="lg"
                              title={member.name}
                              titleLink={memberLink}
                              subtitle={member.tagline}
                              subtitleLink={memberLink}
                              picture={member.profilePicture}
                              pictureLink={memberLink}
                              data-testid={`admin-role-${member.id}`}
                            />
                          )
                        }}
                      </TableColumnWrapper>
                      <TableColumnWrapper
                        id="role"
                        title={t('common:member.role', 'Role')}
                      >
                        <Text
                          color="label.primary"
                          textStyle="regular/small"
                          textTransform="capitalize"
                        >
                          {t('common:space.members.owner', 'Owner')}
                        </Text>
                      </TableColumnWrapper>
                    </TableWrapper>
                  </FeedLayoutWide>
                </FeedLayout>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}
