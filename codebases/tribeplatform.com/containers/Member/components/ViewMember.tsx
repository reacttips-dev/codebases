import React, { useEffect } from 'react'

import { Box, Flex, HStack, Spacer } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'
import Settings4LineIcon from 'remixicon-react/Settings4LineIcon'

import { hasActionPermission } from 'tribe-api/permissions'
import {
  Avatar,
  Banner,
  BannerAddImage,
  BannerProvider,
  Icon,
  IconButton,
  Link,
  Skeleton,
  SkeletonProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { FeedLayout, FeedLayoutMain, FeedLayoutWide } from 'components/Layout'
import { MOBILE_HEADER_HEIGHT } from 'components/Layout/MobileHeader'

import { MemberFeed } from 'containers/Member/components/MemberFeed'
import { MemberSpacesTable } from 'containers/Member/components/MemberSpacesTable'
import {
  useRemoveMemberBanner,
  useUpdateMemberBanner,
} from 'containers/Member/hooks'
import { useNavbarHeight } from 'containers/Network/components/Navbar'
import useGetNetwork from 'containers/Network/useGetNetwork'
import { useSearch } from 'containers/Search/hooks/useSearchModal'
import { CONTENT_PADDING } from 'containers/Space/constants'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'
import useUpdateImage from 'hooks/useUpdateImage'

import Error from '../../Error'
import useGetMember from '../hooks/useGetMember'
import MemberBadge from './MemberBadge'

dayjs.extend(relativeTime)

export interface ViewMemberProps {
  memberId: string
}

const ViewMember = ({ memberId }: ViewMemberProps) => {
  const { member, isInitialLoading, error } = useGetMember(memberId)
  const router = useRouter()
  const { network } = useGetNetwork()
  const { authUser } = useAuthMember()
  const { updateBanner } = useUpdateMemberBanner({ member })
  const { removeBanner } = useRemoveMemberBanner({ member })
  const navbarHeight = useNavbarHeight()

  const { isPhone, isMobile, isSidebarOpen, mobileHeader } = useResponsive()
  const { isSearchModalOpen } = useSearch()

  useEffect(() => {
    if (isSidebarOpen || isSearchModalOpen) return

    if (isPhone) {
      mobileHeader.setRight(
        <NextLink
          href="/member/[memberId]/edit"
          as={`/member/${memberId}/edit?from=/member/${memberId}`}
          passHref
        >
          <IconButton
            aria-label="Settings"
            buttonType="secondary"
            backgroundColor="bg.secondary"
            borderRadius="base"
            px={2}
            icon={<MoreLineIcon size="16px" />}
            as={Link}
          />
        </NextLink>,
      )
    } else {
      mobileHeader.setRight(null)
    }
  }, [isPhone, isSearchModalOpen, isSidebarOpen, memberId, mobileHeader])

  const { authorized: hasEditPermission } = hasActionPermission(
    member?.authMemberProps?.permissions || [],
    'updateMember',
  )
  const { authorized: hasViewSpacesPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'memberSpaces',
  )

  const isAuthUserProfile = authUser?.id === memberId

  const { updateImage } = useUpdateImage(member?.banner?.id)

  if (error || member == null) {
    return <Error error={{ code: 404 }} />
  }

  const showBannerEditButton = hasEditPermission && !isPhone

  const banner =
    member?.banner?.__typename === 'Image' ? member.banner : undefined

  return (
    <>
      <BannerProvider>
        <SkeletonProvider loading={isInitialLoading}>
          <Banner
            onRemove={showBannerEditButton ? removeBanner : undefined}
            onSave={showBannerEditButton ? updateBanner : undefined}
            onEdit={updateImage}
            image={banner}
          />
          <Box
            px={CONTENT_PADDING}
            py="4"
            bg="bg.base"
            borderBottom="1px"
            borderColor="border.lite"
            w="full"
            mt={[banner ? '-50px' : 0, 0]}
          >
            {!isAuthUserProfile && (
              <Link pb={4} display="inline-block" onClick={router.back}>
                <HStack color="label.secondary">
                  <Icon as={ArrowLeftLineIcon} />
                  <Text color="inherit">
                    <Trans i18nKey="common.back" defaults="Back" />
                  </Text>
                </HStack>
              </Link>
            )}

            <HStack justify="space-between" align="start" spacing="4">
              <Box
                d="flex"
                w="full"
                flexDirection={['column', 'row']}
                alignItems={['center', 'stretch']}
              >
                <Avatar
                  size="2xl"
                  name={member.name}
                  src={member.profilePicture}
                />
                <Flex align="flex-end" spacing="0.5" ml={[0, 3]} flex="1">
                  <Box>
                    <Skeleton>
                      <HStack mt={[1, 0]}>
                        <Text textStyle="bold/2xlarge" as="h2">
                          {member.name}
                        </Text>
                        <MemberBadge memberRole={member?.role} />
                      </HStack>
                    </Skeleton>
                    <Skeleton>
                      {member.tagline && (
                        <Box
                          textStyle="regular/medium"
                          as="h5"
                          minH="18px"
                          mt={1}
                          color="tertiary"
                        >
                          {member.tagline}
                        </Box>
                      )}
                    </Skeleton>
                  </Box>
                  <Spacer />
                  {hasEditPermission && !isPhone && (
                    <Box d="flex" flexWrap="wrap" justifyContent="flex-end">
                      <BannerAddImage />
                      <NextLink
                        href="/member/[memberId]/edit"
                        as={`/member/${memberId}/edit`}
                        passHref
                      >
                        <IconButton
                          data-testid="profile-edit-button"
                          aria-label="Edit"
                          highlighted
                          size="sm"
                          ml={2}
                          buttonType="secondary"
                          icon={<Settings4LineIcon size="16px" />}
                          as={Link}
                        />
                      </NextLink>
                    </Box>
                  )}
                </Flex>
              </Box>
            </HStack>
          </Box>
        </SkeletonProvider>
      </BannerProvider>
      <Tabs
        w="100%"
        style={{ marginTop: '0' }}
        pos="sticky"
        top={
          // eslint-disable-next-line no-nested-ternary
          isMobile ? MOBILE_HEADER_HEIGHT : navbarHeight
        }
        width="full"
        zIndex="docked"
      >
        <TabList pl={CONTENT_PADDING}>
          <Tab data-testid="posts-sticky">
            <Trans i18nKey="common:profile.tabs.posts" defaults="Posts" />
          </Tab>
          {hasViewSpacesPermission && (
            <Tab data-testid="spaces-sticky">
              <Trans i18nKey="common:profile.tabs.spaces" defaults="Spaces" />
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel data-testid="tab-feed">
            <FeedLayout>
              <FeedLayoutMain>
                <MemberFeed memberId={memberId} />
              </FeedLayoutMain>
            </FeedLayout>
          </TabPanel>
          {hasViewSpacesPermission && (
            <TabPanel data-testid="tab-spaces">
              <FeedLayout>
                <FeedLayoutWide>
                  <MemberSpacesTable memberId={memberId} />
                </FeedLayoutWide>
              </FeedLayout>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  )
}

export default ViewMember
